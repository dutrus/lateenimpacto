# Lateen Impacto 🌎

Automated opportunity aggregation engine that scrapes, filters, and distributes academic and professional opportunities across Latin America — scholarships, fellowships, competitions, grants, and more.

## The problem

Opportunities in Latin America are scattered across hundreds of sources. Most students and young professionals miss them because there's no centralized, up-to-date, noise-free feed. Lateen solves that.

## How it works

```
GitHub Actions (cronjob)
    │
    ├── Playwright scraper
    │     ├── Extracts DOM from target sources
    │     ├── Validates and cleans raw data
    │     └── Drops irrelevant or duplicate entries before DB writes
    │
    ├── Groq LLM (noise filter)
    │     └── Classifies whether each opportunity is relevant for LATAM
    │           before it touches the database — saves compute and storage
    │
    └── Supabase (PostgreSQL)
          └── Idempotent upsert by URL — re-runs never create duplicates
```

The scraper runs automatically on a schedule via GitHub Actions. No manual intervention needed.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Astro · Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Scraping | Python · Playwright |
| LLM filtering | Groq (ultra-fast inference) |
| Automation | GitHub Actions (CI/CD + cron) |

## Key engineering decisions

**Idempotent ingestion** — every record is upserted using the source URL as a unique key. Successive cron runs never produce duplicate entries in the database.

**LLM-powered noise filter** — before any record hits the database, Groq classifies whether the opportunity is actually relevant for a LATAM audience. Junk gets dropped early, keeping the DB clean and the frontend fast.

**Fault-tolerant scraper** — built to survive DOM changes gracefully. Structured data cleaning runs after extraction, not before, so partial data doesn't crash the pipeline.

**Immutable source tracking** — every record stores its origin source, making it possible to audit, replay, or remove data from any given source at any time.
