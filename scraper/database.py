import os
import re
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ---------------------------------------------------------------------------
# Junk-title filter — descarta filas de navegación web antes de insertar
# ---------------------------------------------------------------------------

_JUNK_EXACT = {
    # Navegación general
    "back to home", "back to top", "skip to content", "skip navigation",
    "home", "menu", "search", "navigation", "breadcrumb",
    # Legales / footer
    "legal notice", "legal", "privacy policy", "private policy",
    "terms of service", "terms and conditions", "cookie policy",
    "all rights reserved", "sitemap",
    # CTAs vacíos
    "get in touch", "contact us", "contáctanos", "contact", "contacto",
    "postula", "apply", "apply now", "read more", "learn more",
    "click here", "subscribe", "sign up", "log in", "login",
    # Secciones de página
    "nosotros", "about us", "about", "our team", "our startups",
    "our clients", "our services", "our work", "our story",
    "innovation services", "esg", "esg / impact",
    # Cursos / plataformas genéricas
    "course catalog", "explore learning", "digital credentials",
    "try it before you register", "hackathons",
    # Países / regiones solos (sin contexto de oportunidad)
    "united kingdom", "united states", "europe",
    # Social
    "follow us", "share this", "social media",
    # Misc scraping garbage
    "female founder factor_", "nosotros_", "send",
}

_JUNK_PATTERNS = re.compile(
    r"^("
    r"loading\.{0,3}"          # "Loading..."
    r"|\.{2,}"                  # "..." o "...."
    r"|\W{1,5}"                 # solo símbolos/puntuación
    r"|https?://\S+"            # URL cruda como título
    r")$",
    re.IGNORECASE,
)

def is_junk_title(title: str) -> bool:
    """Devuelve True si el título es basura de navegación web (no insertar)."""
    if not title or not title.strip():
        return True
    t = title.strip()
    # Demasiado corto para ser una oportunidad real
    if len(t) < 4:
        return True
    # Coincidencia exacta con lista negra (normalizado a minúsculas)
    if t.lower().rstrip("_. ") in _JUNK_EXACT:
        return True
    # Patrón regex (URLs, sólo puntos, sólo símbolos)
    if _JUNK_PATTERNS.match(t):
        return True
    return False

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS opportunities (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    organization TEXT,
    link         TEXT UNIQUE,
    deadline     DATE,
    description  TEXT,
    category     TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
"""

def get_connection():
    """Return a new psycopg2 connection using DATABASE_URL from .env."""
    return psycopg2.connect(DATABASE_URL)

def init_db():
    """Create the opportunities table if it does not already exist."""
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(CREATE_TABLE_SQL)
        print("OK - Table 'opportunities' is ready.")
    finally:
        conn.close()

def insert_opportunity(title, organization, link, deadline, description, category, program_type=None):
    """
    Insert one opportunity. Skips silently if:
      - the link already exists (dedup), or
      - the title is identified as web-navigation junk.
    Returns the new row id, or None if skipped.
    """
    if is_junk_title(title):
        print(f"  [SKIP junk title] {repr(title)}")
        return None
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO opportunities
                        (title, organization, link, deadline, description, category, program_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (link) DO NOTHING
                    RETURNING id
                    """,
                    (title, organization, link, deadline, description, category, program_type),
                )
                row = cur.fetchone()
                return row[0] if row else None
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
