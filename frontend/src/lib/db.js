import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export async function getOpportunities() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT
        id, title, organization, link, category, program_type,
        resumen, aplica_latam, fuente, pais_destino,
        COALESCE(fecha_cierre, deadline) AS deadline
      FROM opportunities
      WHERE activo = true
      ORDER BY created_at DESC
    `);
    return rows;
  } finally {
    client.release();
  }
}
