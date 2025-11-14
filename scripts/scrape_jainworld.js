const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const JAINWORLD_BASE_URL = 'https://www.jainworld.com';

const quotes = [];
const articles = [];
const stories = [];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  try {
    await delay(1000);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    return cheerio.load(response.data);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function scrapeQuotes($) {
  $('p, blockquote').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 50 && text.length < 500) {
      if (text.includes('ahimsa') || text.includes('Ahimsa') || 
          text.includes('Mahavira') || text.includes('Jain') ||
          text.includes('soul') || text.includes('karma')) {
        quotes.push({
          quote: text,
          source: 'Jainworld.com',
          category: 'general'
        });
      }
    }
  });
}

async function scrapeArticles($, url) {
  const title = $('h1, h2').first().text().trim();
  const content = $('p').map((i, elem) => $(elem).text().trim()).get().join('\n\n');
  
  if (title && content.length > 200) {
    articles.push({
      title,
      content,
      url,
      scrapedAt: new Date().toISOString()
    });
  }
}

async function scrapeMainPages() {
  const mainPages = [
    '/',
    '/jain-history',
    '/jain-philosophy',
    '/jain-principles',
    '/jain-practices',
    '/jain-texts',
    '/jain-saints',
  ];

  for (const page of mainPages) {
    console.log(`Scraping ${page}...`);
    const $ = await fetchPage(`${JAINWORLD_BASE_URL}${page}`);
    if ($) {
      await scrapeQuotes($);
      await scrapeArticles($, `${JAINWORLD_BASE_URL}${page}`);
    }
  }
}

async function scrapeLinks() {
  const $ = await fetchPage(JAINWORLD_BASE_URL);
  if (!$) return;

  const links = [];
  $('a[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && href.startsWith('/') && !href.includes('#') && !href.includes('mailto:')) {
      links.push(href);
    }
  });

  const uniqueLinks = [...new Set(links)].slice(0, 50);
  
  for (const link of uniqueLinks) {
    console.log(`Scraping ${link}...`);
    const $ = await fetchPage(`${JAINWORLD_BASE_URL}${link}`);
    if ($) {
      await scrapeQuotes($);
      await scrapeArticles($, `${JAINWORLD_BASE_URL}${link}`);
    }
  }
}

async function saveData() {
  const dataDir = path.join(__dirname, '../data');
  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(
    path.join(dataDir, 'quotes.json'),
    JSON.stringify(quotes, null, 2)
  );

  await fs.writeFile(
    path.join(dataDir, 'articles.json'),
    JSON.stringify(articles, null, 2)
  );

  console.log(`\n✅ Saved ${quotes.length} quotes and ${articles.length} articles`);
}

async function main() {
  console.log('🚀 Starting Jainworld.com scraper...\n');
  
  await scrapeMainPages();
  await scrapeLinks();
  await saveData();
  
  console.log('\n✅ Scraping complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeJainworld: main };

