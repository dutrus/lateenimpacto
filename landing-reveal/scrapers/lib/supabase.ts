import { createClient } from '@supabase/supabase-js';

/**
 * Constructs a Supabase client using environment variables.  The service
 * role key must be provided via SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL.
 *
 * It's important to use a service role key only in secure server-side
 * environments.  Do not expose this key in client-side code.
 */
const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

/**
 * Inserts or updates opportunity records in the database.  Records are
 * deduplicated based on the URL.  Returns the number of records
 * affected.
 *
 * @param rows Array of opportunity objects to upsert
 */
export async function upsertOpportunities(rows: any[]) {
  if (!rows.length) return { count: 0 };
  const { data, error } = await supabase
    .from('opportunities')
    .upsert(rows, { onConflict: 'url' })
    .select('id');
  if (error) throw error;
  return { count: data?.length || 0 };
}