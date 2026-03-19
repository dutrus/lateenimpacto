"""
main.py - Scholarship & Internship Scraper (LatAm focused)
Reads targets.json, scrapes each source with Playwright, saves to Postgres.
"""

import asyncio
import io
import json
import os
import re
import sys
from datetime import date
from urllib.parse import urlparse

from dotenv import load_dotenv
from playwright.async_api import async_playwright

from database import insert_opportunity, get_connection, is_junk_title

# Force UTF-8 output on Windows (handles emojis in Substack titles)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

load_dotenv()

# ---------------------------------------------------------------------------
# LatAm detection helpers
# ---------------------------------------------------------------------------

LATAM_COUNTRIES = [
    "México", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Perú",
    "Brasil", "Brazil", "Venezuela", "Ecuador", "Bolivia", "Paraguay",
    "Uruguay", "Guatemala", "Honduras", "El Salvador", "Nicaragua",
    "Costa Rica", "Panama", "Panamá", "Cuba", "República Dominicana",
    "Puerto Rico", "América Latina", "Latin America", "Latinoamérica",
    "Iberoamérica", "LATAM", "Centroamérica", "Sudamérica", "Caribe",
    "Mesoamérica",
]

FIELD_CATEGORIES = {
    "Neuroscience": ["neuro", "brain", "cognitive", "cerebro", "neurocien"],
    "AI": ["artificial intelligence", "machine learning", "inteligencia artificial",
           "deep learning", "data science", "ciencia de datos"],
    "Engineering": ["engineering", "ingeniería", "ingenieria", "tecnología",
                    "tecnologia", "computer science", "computación"],
    "Medicine": ["medicine", "medicina", "health", "salud", "medical", "biomedicine"],
    "Arts": ["arts", "artes", "design", "diseño", "creative", "creativo"],
    "Social Sciences": ["social", "sociology", "political", "economics", "economía",
                        "derecho", "law"],
    "Environment": ["environment", "medio ambiente", "climate", "clima", "ecology",
                    "ecología", "sustainability", "sostenibilidad"],
}

def detect_category(text: str) -> str:
    """Return the best-match LATAM country or academic field from text."""
    text_lower = text.lower()
    for country in LATAM_COUNTRIES:
        if country.lower() in text_lower:
            return country
    for category, keywords in FIELD_CATEGORIES.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return "General"

def is_latam_relevant(text: str) -> bool:
    """Return True if text mentions any LatAm country/region keyword."""
    text_lower = text.lower()
    return any(country.lower() in text_lower for country in LATAM_COUNTRIES)


# ---------------------------------------------------------------------------
# Deadline parser (Spanish + English)
# ---------------------------------------------------------------------------

MONTHS_ES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
    "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
    "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12,
}
MONTHS_EN = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

def parse_deadline(text: str):
    """Extract the first recognisable deadline date from free-form text."""
    if not text:
        return None

    # Spanish: "hasta el 23 de marzo del 2026" / "23 de marzo de 2026"
    m = re.search(r"(\d{1,2})\s+de\s+(\w+)\s+del?\s+(\d{4})", text, re.I)
    if m:
        day, month_str, year = m.groups()
        month = MONTHS_ES.get(month_str.lower())
        if month:
            try:
                return date(int(year), month, int(day))
            except ValueError:
                pass

    # English: "May 15, 2026" / "April 3 2026"
    m = re.search(
        r"(January|February|March|April|May|June|July|August|"
        r"September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})",
        text, re.I,
    )
    if m:
        month_str, day, year = m.groups()
        month = MONTHS_EN.get(month_str.lower())
        if month:
            try:
                return date(int(year), month, int(day))
            except ValueError:
                pass

    # ISO: 2026-05-15
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
    if m:
        try:
            d = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            if d.year >= 2026:
                return d
        except ValueError:
            pass

    # DD/MM/YYYY
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", text)
    if m:
        try:
            d = date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
            if d.year >= 2026:  # sanity-check: ignore implausible past years
                return d
        except ValueError:
            pass

    return None


# Generic Substack section headings that are NOT individual opportunities
_SKIP_HEADINGS = {
    "top 3 de la semana",
    "top 5 de la semana",
    "esta semana",
    "las favoritas",
    "resumen",
    "introducción",
    "introduccion",
    "bienvenida",
    "editorial",
    "novedades",
}


# ---------------------------------------------------------------------------
# Substack scraper
# ---------------------------------------------------------------------------

async def scrape_substack(page, source: dict, max_posts: int = 3) -> list:
    results = []

    print(f"  Navigating to archive: {source['archive_url']}")
    await page.goto(source["archive_url"], wait_until="domcontentloaded", timeout=30000)
    await page.wait_for_timeout(3000)

    # Collect unique post URLs
    raw_links = await page.eval_on_selector_all(
        "a[href]",
        "els => els.map(el => el.href)",
    )
    seen = set()
    post_urls = []
    for href in raw_links:
        if "/p/" in href and "becas.substack.com" in href and href not in seen:
            # Exclude archive/about/etc pages
            if not any(skip in href for skip in ["#", "?", "/archive", "/about"]):
                seen.add(href)
                post_urls.append(href)

    post_urls = post_urls[:max_posts]
    print(f"  Found {len(post_urls)} post(s) to scrape.")

    for post_url in post_urls:
        print(f"  -> {post_url}")
        try:
            await page.goto(post_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(3000)

            # Try multiple selectors for the post body
            body_el = None
            for sel in [
                ".available-content",
                ".body.markup",
                "div[class*='body'] .markup",
                "article .available-content",
                ".post-content",
                "article",
            ]:
                body_el = await page.query_selector(sel)
                if body_el:
                    break

            if not body_el:
                print("    Could not find post body, skipping.")
                continue

            # Get all h1/h2 inside the body (each = one opportunity)
            headings = await body_el.query_selector_all("h1, h2")
            # Get all external links inside the body
            ext_links = await body_el.eval_on_selector_all(
                "a[href^='http']",
                "els => els.map(el => ({href: el.href, text: el.innerText.trim()}))",
            )
            # Filter out Substack internal links
            ext_links = [
                lk for lk in ext_links
                if "substack.com" not in lk["href"]
                and "substackcdn.com" not in lk["href"]
            ]

            full_text = await body_el.inner_text()
            # Split body into sections separated by headings
            # We'll match each heading to the text that follows it
            heading_texts = []
            for h in headings:
                t = (await h.inner_text()).strip()
                if t:
                    heading_texts.append(t)

            # Split the full text into chunks at each heading
            sections = []
            remaining = full_text
            for ht in heading_texts:
                clean_ht = re.sub(r"[\U0001F300-\U0001FAFF\s]+", " ", ht).strip()
                idx = remaining.find(ht)
                if idx == -1:
                    idx = remaining.find(clean_ht)
                if idx != -1:
                    sections.append(remaining[:idx])
                    remaining = remaining[idx:]
                else:
                    sections.append("")
            sections.append(remaining)
            sections = sections[1:]  # first chunk is intro text before first heading

            # Build a per-heading section map for link extraction
            # Each section_el holds the body element to query links within
            heading_els = await body_el.query_selector_all("h1, h2")

            for i, heading_text in enumerate(heading_texts):
                # Clean emoji from title
                title = re.sub(r"[\U0001F300-\U0001FAFF\U0001F1E0-\U0001F1FF]+", "", heading_text).strip()
                title = title.strip("→ ").strip()
                if not title or len(title) < 4:
                    continue

                # Skip generic section headers — they are not opportunities
                title_clean = re.sub(r"[^\w\s]", "", title.lower()).strip()
                if title_clean in _SKIP_HEADINGS:
                    continue

                section_text = sections[i] if i < len(sections) else full_text

                # Extract the first external non-Substack link found in this section's text
                opp_link = None
                for lk in ext_links:
                    href = lk["href"]
                    if (
                        "substack.com" not in href
                        and "substackcdn.com" not in href
                        and href in section_text
                    ):
                        opp_link = href
                        break
                # Fallback: first unmatched external link not yet used
                if not opp_link:
                    used = {r.get("link") for r in results if r.get("link")}
                    for lk in ext_links:
                        href = lk["href"]
                        if (
                            "substack.com" not in href
                            and "substackcdn.com" not in href
                            and href not in used
                        ):
                            opp_link = href
                            break

                deadline = parse_deadline(section_text)
                category = detect_category(section_text)

                # Organization: look for bold label patterns
                org = None
                for pattern in [
                    r"(?:Organización|Organization|Institución|Institution|Offered by|Organismo)[:\s→]+([^\n]+)",
                    r"(?:Por|By)[:\s]+([^\n]{3,60})",
                ]:
                    org_m = re.search(pattern, section_text, re.I)
                    if org_m:
                        org = org_m.group(1).strip()
                        break

                opp = {
                    "title": title,
                    "organization": org,
                    "link": opp_link,
                    "deadline": deadline,
                    "description": section_text[:600].strip(),
                    "category": category,
                    "program_type": source.get("program_type", "Scholarship / Internship"),
                }
                results.append(opp)
                print(
                    f"    + {title[:55]:<55} | "
                    f"deadline: {str(deadline):<12} | "
                    f"cat: {category}"
                )

        except Exception as e:
            print(f"    ERROR on {post_url}: {e}")

    return results


# ---------------------------------------------------------------------------
# Standard listing-page scraper
# ---------------------------------------------------------------------------

async def _try_selectors(el, selectors_str: str):
    """Try a comma-separated list of selectors, return first match text."""
    if not selectors_str:
        return None
    for sel in [s.strip() for s in selectors_str.split(",")]:
        try:
            child = await el.query_selector(sel)
            if child:
                return (await child.inner_text()).strip()
        except Exception:
            continue
    return None

async def _try_selectors_attr(el, selectors_str: str, attr: str):
    """Try selectors and return an attribute value."""
    if not selectors_str:
        return None
    for sel in [s.strip() for s in selectors_str.split(",")]:
        try:
            child = await el.query_selector(sel)
            if child:
                val = await child.get_attribute(attr)
                if val:
                    return val
        except Exception:
            continue
    return None

async def scrape_standard(page, source: dict) -> list:
    results = []
    url = source["url"]
    sel = source["selectors"]
    base_parsed = urlparse(url)
    base_url = f"{base_parsed.scheme}://{base_parsed.netloc}"
    page_num = 0

    while url:
        page_num += 1
        print(f"  Page {page_num}: {url}")
        # networkidle for all — 15s hard timeout, 5s render buffer
        loaded = False
        try:
            await page.goto(url, wait_until="networkidle", timeout=15000)
            loaded = True
        except Exception as e:
            if "net::ERR_NAME_NOT_RESOLVED" in str(e) or "net::ERR_CONNECTION" in str(e):
                print(f"    DNS/connection failed — skipping source.")
                break
            # Timeout or other — continue with whatever rendered
            loaded = True
        if not loaded:
            break
        await page.wait_for_timeout(5000)
        if source.get("wait_for_selector"):
            try:
                await page.wait_for_selector(source["wait_for_selector"], timeout=5000)
            except Exception:
                pass

        cards = []
        for card_sel in [s.strip() for s in sel["listing"].split(",")]:
            try:
                cards = await page.query_selector_all(card_sel)
            except Exception:
                cards = []
            if cards:
                break

        print(f"    Found {len(cards)} card(s) via CSS selector")

        # --- FALLBACK: if no cards found, harvest raw <a href> links from body ---
        if not cards:
            raw_links = await page.eval_on_selector_all(
                "main a[href], article a[href], .content a[href], body a[href]",
                "els => els.map(e => ({href: e.href, text: e.innerText.trim()})).filter(l => l.text.length > 8 && !l.href.includes('#'))"
            )
            external = [l for l in raw_links if base_url not in l["href"] and l["href"].startswith("http")][:20]
            if external:
                print(f"    Fallback: harvested {len(external)} raw links")
                for lk in external:
                    title = lk["text"][:120].strip()
                    link  = lk["href"]
                    if title and link:
                        results.append({
                            "title": title,
                            "organization": source["name"],
                            "link": link,
                            "deadline": None,
                            "description": f"[raw link from {source['name']}]",
                            "category": detect_category(title),
                            "program_type": source.get("program_type", "Scholarship / Internship"),
                        })
            break  # no pagination on fallback

        for card in cards:
            title = await _try_selectors(card, sel.get("title"))
            if not title:
                continue

            link = await _try_selectors_attr(card, sel.get("link"), "href")
            if link and link.startswith("/"):
                link = base_url + link

            org = await _try_selectors(card, sel.get("organization"))
            dl_text = await _try_selectors(card, sel.get("deadline"))
            deadline = parse_deadline(dl_text) if dl_text else None
            description = await _try_selectors(card, sel.get("description"))

            full_text = f"{title} {org or ''} {description or ''}"
            category = detect_category(full_text)

            if title and link:
                results.append({
                    "title": title,
                    "organization": org,
                    "link": link,
                    "deadline": deadline,
                    "description": (description or "")[:600],
                    "category": category,
                    "program_type": source.get("program_type", "Scholarship / Internship"),
                })

        # Pagination — stop after page 2 to avoid huge runs
        if page_num >= 2:
            break

        next_url = None
        if sel.get("next_page"):
            next_el = await page.query_selector(sel["next_page"])
            if next_el:
                next_url = await next_el.get_attribute("href")
                if next_url and next_url.startswith("/"):
                    next_url = base_url + next_url
        url = next_url

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main():
    # Usage: python main.py [max_posts] [--source "Source Name"]
    max_posts = 3
    source_filter = None
    args = sys.argv[1:]
    if args and not args[0].startswith("--"):
        max_posts = int(args.pop(0))
    for i, a in enumerate(args):
        if a == "--source" and i + 1 < len(args):
            source_filter = args[i + 1].lower()

    with open("targets.json", "r", encoding="utf-8") as f:
        config = json.load(f)

    all_results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            locale="es-419",
        )
        for source in config["sources"]:
            if not source.get("enabled", True):
                continue
            # Apply --source filter if specified
            if source_filter and source_filter not in source["name"].lower():
                continue

            print(f"\n{'='*60}")
            print(f"[{source['name']}]")

            # Fresh page per source prevents cross-navigation contamination
            page = await context.new_page()
            try:
                if source["type"] == "substack":
                    results = await scrape_substack(page, source, max_posts=max_posts)
                else:
                    results = await scrape_standard(page, source)

                saved = skipped = junk_skipped = 0
                for opp in results:
                    if not opp.get("link"):
                        continue

                    title = opp.get("title") or ""

                    # Rule 1: Junk title guard — no DB attempt whatsoever
                    if is_junk_title(title):
                        junk_skipped += 1
                        continue

                    # Rule 3: LatAm relevance determines aplica_latam flag
                    full_text = f"{title} {opp.get('organization') or ''} {opp.get('description') or ''}"
                    aplica_latam = is_latam_relevant(full_text)

                    # Rules 2 & 4: URL-keyed upsert with fuente traceability
                    row_id = insert_opportunity(
                        title=title,
                        organization=opp.get("organization"),
                        link=opp.get("link"),
                        deadline=opp.get("deadline"),
                        description=opp.get("description"),
                        category=opp.get("category"),
                        program_type=opp.get("program_type"),
                        fuente=source["name"],
                        activo=True,
                        aplica_latam=aplica_latam,
                    )
                    if row_id:
                        saved += 1
                        latam_tag = " [LATAM]" if aplica_latam else ""
                        print(f"  [SAVED id={row_id}]{latam_tag} {title[:60]}")
                    else:
                        skipped += 1

                # DB total count after this source
                try:
                    _conn = get_connection()
                    with _conn.cursor() as _cur:
                        _cur.execute("SELECT COUNT(*) FROM opportunities")
                        db_total = _cur.fetchone()[0]
                    _conn.close()
                except Exception:
                    db_total = "?"
                print(f"  [{source['name'][:40]}] -> ENCONTRADOS: {len(results)} | GUARDADOS: {saved} | JUNK: {junk_skipped} | TOTAL DB: {db_total}")
                all_results.extend(results)

            except Exception as e:
                print(f"  ERROR: {e}")
            finally:
                await page.close()

        await browser.close()

    # -----------------------------------------------------------------------
    # Summary table
    # -----------------------------------------------------------------------
    print(f"\n{'='*60}")
    print(f"TOTAL OPPORTUNITIES FOUND: {len(all_results)}")
    print(f"{'='*60}")
    print(f"{'TITLE':<50} {'DEADLINE':<13} {'CATEGORY'}")
    print(f"{'-'*50} {'-'*13} {'-'*20}")
    for r in all_results:
        title = (r.get("title") or "")[:49]
        dl = str(r.get("deadline") or "unknown")
        cat = (r.get("category") or "General")[:20]
        print(f"{title:<50} {dl:<13} {cat}")


if __name__ == "__main__":
    asyncio.run(main())
