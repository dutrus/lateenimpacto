-- =====================================================================
-- MIGRACIÓN 01 — Agregar columnas nuevas a opportunities
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================================

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS pais_destino text,
  ADD COLUMN IF NOT EXISTS fecha_cierre date,
  ADD COLUMN IF NOT EXISTS resumen      text,
  ADD COLUMN IF NOT EXISTS razon_filtro text,
  ADD COLUMN IF NOT EXISTS aplica_latam boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS activo       boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS fuente       text;

-- Asegurar que filas preexistentes (sin default) tengan valor true
UPDATE public.opportunities
SET aplica_latam = true,
    activo       = true
WHERE aplica_latam IS NULL
   OR activo IS NULL;

SELECT 'Columnas agregadas OK' AS status;
