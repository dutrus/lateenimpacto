import { upsertOpportunities } from './lib/supabase';
import { scrapeFundacionCarolina } from './sources/fundacion-carolina';
// Import additional sources here as you add more scrapers
// import { scrapeOtherSource } from './sources/other-source';

/**
 * Run every configured scraper and collect their results.  If any
 * individual scraper fails, we catch the error and continue so that
 * one broken source doesn't prevent other sources from running.
 */
async function scrapeAll() {
  const results = await Promise.allSettled([
    scrapeFundacionCarolina(),
    // scrapeOtherSource(),
  ]);
  let merged: any[] = [];
  for (const res of results) {
    if (res.status === 'fulfilled') {
      merged = merged.concat(res.value);
    } else {
      console.error('Source failed:', res.reason);
    }
  }
  return merged;
}

async function main() {
  const rows = await scrapeAll();
  const { count } = await upsertOpportunities(rows);
  console.log(`Imported/updated: ${count} opportunities`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});