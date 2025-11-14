# 🕷️ Jainworld.com Scraper Guide

## Overview
This scraper extracts quotes and articles from jainworld.com to populate your database.

## Prerequisites
```bash
npm install axios cheerio
```

## Usage

### Run Scraper
```bash
cd jainverse
npm run scrape
```

### What It Does
1. Scrapes main pages from jainworld.com
2. Extracts quotes (texts mentioning Jain concepts)
3. Extracts articles (full page content)
4. Saves to `data/quotes.json` and `data/articles.json`
5. Respects rate limits (1 second delay between requests)

### Output
- **quotes.json**: Array of quotes with source
- **articles.json**: Array of articles with title, content, URL

## Manual Scraping

If you want to scrape specific pages, edit `scripts/scrape_jainworld.js`:

```javascript
const mainPages = [
  '/',
  '/jain-history',
  '/jain-philosophy',
  '/your-custom-page',
];
```

## Import to Database

After scraping, import to Supabase:

```bash
npm run setup-db
```

Or manually:
1. Go to Supabase Dashboard
2. Table Editor → Import Data
3. Select `data/quotes.json` or `data/articles.json`

## Notes
- **Ethical Scraping**: Respects robots.txt and rate limits
- **Error Handling**: Continues if page fails
- **Data Quality**: Filters for relevant Jain content
- **Updates**: Re-run scraper periodically for new content

---

## Troubleshooting

**Error: "Cannot find module 'axios'"**
```bash
npm install axios cheerio
```

**Error: "Network timeout"**
- Check internet connection
- Site may be temporarily down
- Increase timeout in script

**No data scraped**
- Check if jainworld.com structure changed
- Update selectors in script
- Verify site is accessible

