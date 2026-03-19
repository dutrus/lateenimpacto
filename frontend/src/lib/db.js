import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export async function getOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id, title, organization, link, category, program_type, resumen, aplica_latam, fuente, pais_destino, fecha_cierre, deadline, created_at')
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(row => ({
    ...row,
    deadline: row.fecha_cierre ?? row.deadline,
  }));
}
