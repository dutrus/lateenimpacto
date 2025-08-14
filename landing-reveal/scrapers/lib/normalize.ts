/**
 * Describes the shape of raw data extracted from a web page.  Not every
 * property is required; normalisation will drop entries lacking the
 * mandatory fields.
 */
export type RawItem = {
  title?: string;
  url?: string;
  org?: string;
  country?: string;
  deadline?: string;
  type?: string;
  level?: string;
  description?: string;
  tags?: string[];
};

/**
 * Converts a loosely structured raw item into a consistent record for
 * ingestion into Supabase.  Missing titles or URLs will cause the item
 * to be discarded.
 */
export function normalize(raw: RawItem) {
  if (!raw.title || !raw.url) return null;
  const safeDate = raw.deadline ? new Date(raw.deadline) : null;
  return {
    title: raw.title.trim(),
    url: raw.url.trim(),
    org: raw.org?.trim() || null,
    country: raw.country || null,
    deadline:
      safeDate && !isNaN(safeDate.valueOf())
        ? safeDate.toISOString().slice(0, 10)
        : null,
    type: raw.type || 'scholarship',
    level: raw.level || 'general',
    description: raw.description || null,
    tags: raw.tags || [],
    status: 'draft',
  };
}