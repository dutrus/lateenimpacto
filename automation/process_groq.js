/**
 * process_groq.js
 *
 * Flujo:
 *  1. Conecta a Supabase con variables de entorno
 *  2. Trae filas de opportunities donde activo = true AND resumen IS NULL
 *  3. Limpia el campo description con cleanText()
 *  4. Para cada fila llama a Groq (llama-3.3-70b-versatile) con un system prompt estricto
 *  5. Parsea el JSON devuelto y actualiza la fila en Supabase
 *
 * Variables de entorno requeridas:
 *   SUPABASE_URL          → URL del proyecto Supabase
 *   SUPABASE_SERVICE_KEY  → service_role key (no la anon key)
 *   GROQ_API_KEY          → API key de Groq
 */

import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

// ─── Config ────────────────────────────────────────────────────────────────

const REQUIRED_ENV = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "GROQ_API_KEY"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[ERROR] Variable de entorno faltante: ${key}`);
    process.exit(1);
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";
const BATCH_SIZE = 20;  // máximo de filas por ejecución (control de costos)
const DELAY_MS   = 1200; // pausa entre llamadas para no saturar rate limit

// ─── Text cleaning ─────────────────────────────────────────────────────────

// Frases exactas de navegación web que se eliminan (case-insensitive)
const NAV_PHRASES = [
  "accept cookies",
  "accept all cookies",
  "we use cookies",
  "cookie policy",
  "skip to content",
  "skip to main content",
  "skip navigation",
  "privacy policy",
  "terms of service",
  "terms and conditions",
  "all rights reserved",
  "subscribe to newsletter",
  "subscribe to our newsletter",
  "sign up for newsletter",
  "javascript is required",
  "please enable javascript",
  "enable javascript",
  "this site requires javascript",
  "loading",
  "search",
  "menu",
  "navigation",
  "breadcrumb",
  "back to top",
  "read more",
  "learn more",
  "click here",
  "share this",
  "follow us",
  "social media",
];

/**
 * Limpia el campo description eliminando:
 *  - Líneas que coinciden con frases de navegación web conocidas
 *  - Líneas con menos de 4 palabras (no aportan contenido real)
 *  - Líneas vacías duplicadas
 *
 * @param {string|null} text
 * @returns {string}
 */
function cleanText(text) {
  if (!text || typeof text !== "string") return "";

  const navRegex = new RegExp(
    `^(${NAV_PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`,
    "i"
  );

  const cleaned = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;

      // Eliminar líneas que coinciden con frases de navegación
      if (navRegex.test(line)) return false;

      // Eliminar líneas con menos de 4 palabras
      const wordCount = line.split(/\s+/).filter(Boolean).length;
      if (wordCount < 4) return false;

      return true;
    })
    .join("\n")
    // Colapsar múltiples líneas en blanco consecutivas
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned;
}

// ─── Prompt ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres un asistente que analiza oportunidades académicas y profesionales orientadas a jóvenes latinoamericanos.

Tu única tarea es devolver un objeto JSON válido con exactamente estas tres claves:

{
  "resumen": "string — exactamente 2 párrafos motivadores en español, separados por \\n\\n. Destaca por qué vale la pena postularse, qué se gana y a quién va dirigido.",
  "pais_destino": "string o null — país o región donde se desarrolla la oportunidad (ej: 'Estados Unidos', 'España', 'América Latina'). null si no es identificable.",
  "fecha_cierre": "string o null — fecha límite de postulación en formato YYYY-MM-DD. null si no está disponible."
}

Reglas estrictas:
- Responde ÚNICAMENTE con el JSON, sin texto adicional, sin markdown, sin comentarios.
- No inventes fechas; si no hay fecha explícita, usa null.
- El resumen debe ser entusiasta y profesional, nunca genérico.
- Si el título o descripción están en inglés, el resumen igual va en español.`;

// ─── Helpers ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extrae JSON del texto de respuesta de Groq.
 * Tolera que el modelo envuelva el JSON en backticks o texto extra.
 */
function extractJSON(raw) {
  try {
    return JSON.parse(raw.trim());
  } catch (_) {}

  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {}
  }

  throw new Error(`No se pudo parsear JSON de la respuesta: ${raw.slice(0, 200)}`);
}

/**
 * Valida que el objeto tenga las claves requeridas y tipos correctos.
 */
function validatePayload(obj) {
  if (typeof obj.resumen !== "string" || obj.resumen.trim().length < 20) {
    throw new Error(`'resumen' inválido: ${JSON.stringify(obj.resumen)}`);
  }
  if (obj.pais_destino !== null && typeof obj.pais_destino !== "string") {
    throw new Error(`'pais_destino' debe ser string o null`);
  }
  if (obj.fecha_cierre !== null) {
    if (typeof obj.fecha_cierre !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(obj.fecha_cierre)) {
      throw new Error(`'fecha_cierre' debe ser YYYY-MM-DD o null, recibido: ${obj.fecha_cierre}`);
    }
  }
  return {
    resumen:      obj.resumen.trim(),
    pais_destino: obj.pais_destino?.trim() || null,
    fecha_cierre: obj.fecha_cierre || null,
  };
}

// ─── Core ──────────────────────────────────────────────────────────────────

async function processRow(row) {
  const cleanedDescription = cleanText(row.description);

  const userContent = [
    `Título: ${row.title}`,
    row.organization          ? `Organización: ${row.organization}`       : null,
    cleanedDescription        ? `Descripción: ${cleanedDescription}`       : null,
    row.deadline              ? `Deadline (raw): ${row.deadline}`          : null,
    row.category              ? `Categoría: ${row.category}`              : null,
    row.link                  ? `Link: ${row.link}`                       : null,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    max_tokens: 800,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJSON(raw);
  return validatePayload(parsed);
}

async function main() {
  console.log(`[${new Date().toISOString()}] Iniciando process_groq.js — modelo: ${MODEL}`);

  // 1. Traer filas pendientes
  const { data: rows, error: fetchError } = await supabase
    .from("opportunities")
    .select("id, title, organization, description, deadline, category, link")
    .eq("activo", true)
    .is("resumen", null)
    .limit(BATCH_SIZE);

  if (fetchError) {
    console.error("[ERROR] No se pudo leer Supabase:", fetchError.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("[OK] No hay filas pendientes (activo=true y resumen=null). Nada que hacer.");
    return;
  }

  console.log(`[INFO] ${rows.length} fila(s) pendiente(s) de procesar.`);

  let ok = 0;
  let failed = 0;

  // 2. Iterar
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const label = `[id=${row.id}] "${(row.title || "").slice(0, 50)}"`;
    try {
      console.log(`  Procesando ${label}...`);
      const payload = await processRow(row);

      // 3. UPDATE en Supabase
      const { error: updateError } = await supabase
        .from("opportunities")
        .update({
          resumen:      payload.resumen,
          pais_destino: payload.pais_destino,
          fecha_cierre: payload.fecha_cierre,
        })
        .eq("id", row.id);

      if (updateError) {
        throw new Error(`Supabase UPDATE falló: ${updateError.message}`);
      }

      console.log(`  [OK] ${label}`);
      ok++;
    } catch (err) {
      console.error(`  [FAIL] ${label} → ${err.message}`);
      failed++;
    }

    // Pausa entre llamadas (salvo la última)
    if (i < rows.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // 4. Resumen final
  console.log(`\n[DONE] Procesadas: ${ok + failed} | OK: ${ok} | Fallidas: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[FATAL]", err);
  process.exit(1);
});
