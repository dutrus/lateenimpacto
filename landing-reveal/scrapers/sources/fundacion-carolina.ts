import { withPage } from '../lib/browser';
import * as cheerio from 'cheerio';
import { normalize } from '../lib/normalize';

/**
 * Scrapes scholarship opportunities from Fundación Carolina.  This
 * implementation uses Playwright to fetch the HTML and Cheerio to parse it.
 * The selectors used here are best guesses based on the current structure of
 * fundacioncarolina.org and may need adjusting if the site changes.
 */
export async function scrapeFundacionCarolina() {
  return withPage(async (page) => {
    // The main listing of scholarships for a given call.  Feel free to
    // change this URL to point at a specific year or category.
    const url = 'https://fundacioncarolina.org/convocatoria/';
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Get the page content as HTML and load it into Cheerio
    const html = await page.content();
    const $ = cheerio.load(html);

    const items: any[] = [];

    // Each scholarship is represented by a card element.  Update the
    // selector below if the site structure changes.
    $('.scholarship-card').each((_, el) => {
      const title = $(el).find('.scholarship-card__title').text();
      const link = $(el).find('a').attr('href');
      const org = 'Fundación Carolina';
      const deadlineText = $(el).find('.scholarship-card__deadline').text();
      const description = $(el).find('.scholarship-card__excerpt').text();
      const country = null;
      const type = 'scholarship';
      const level = 'general';
      const deadline = parseDeadline(deadlineText);
      const normalized = normalize({ title, url: link, org, country, deadline, type, level, description });
      if (normalized) {
        items.push(normalized);
      }
    });

    return items;
  });
}

/**
 * Parses a human-readable Spanish date into ISO format (YYYY-MM-DD).
 * Accepts strings like "15 de septiembre de 2025".  Returns null if no
 * match could be found.
 */
function parseDeadline(text: string): string | null {
  if (!text) return null;
  const match = text.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
  if (match) {
    const [, day, monthName, year] = match;
    const months: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      setiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };
    const month = months[monthName.toLowerCase()];
    if (month !== undefined) {
      const date = new Date(parseInt(year, 10), month, parseInt(day, 10));
      return date.toISOString().slice(0, 10);
    }
  }
  return null;
}