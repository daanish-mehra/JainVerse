const { CosmosClient } = require('@azure/cosmos');
const fs = require('fs').promises;
const path = require('path');

const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'jainai';

if (!endpoint || !key) {
  console.error('❌ Missing Azure Cosmos DB credentials!');
  console.error('Please set:');
  console.error('  AZURE_COSMOS_ENDPOINT');
  console.error('  AZURE_COSMOS_KEY');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function importQuotes() {
  console.log('📥 Importing quotes...');
  
  const quotesPath = path.join(__dirname, '../data/quotes.json');
  let quotes;
  try {
    quotes = JSON.parse(await fs.readFile(quotesPath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Error reading ${quotesPath}: ${error.message}`);
    console.error('💡 Tip: Run "npm run scrape" first to create the data files.');
    return;
  }
  
  if (!Array.isArray(quotes) || quotes.length === 0) {
    console.log('⚠️  No quotes found in data file. Skipping...');
    return;
  }
  
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container } = await database.containers.createIfNotExists({ 
    id: 'quotes',
    partitionKey: { paths: ['/id'] }
  });
  
  let imported = 0;
  let errors = 0;
  
  for (const quote of quotes) {
    try {
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quote: quote.quote,
        author: quote.author || null,
        source: quote.source || 'Jainworld.com',
        category: quote.category || 'general',
        createdAt: new Date().toISOString(),
      };
      
      await container.items.create(item);
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`  ✅ Imported ${imported}/${quotes.length} quotes...`);
      }
    } catch (error) {
      errors++;
      console.error(`  ❌ Error importing quote: ${error.message}`);
    }
  }
  
  console.log(`✅ Imported ${imported} quotes (${errors} errors)`);
}

async function importArticles() {
  console.log('📥 Importing articles...');
  
  const articlesPath = path.join(__dirname, '../data/articles.json');
  let articles;
  try {
    articles = JSON.parse(await fs.readFile(articlesPath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Error reading ${articlesPath}: ${error.message}`);
    console.error('💡 Tip: Run "npm run scrape" first to create the data files.');
    return;
  }
  
  if (!Array.isArray(articles) || articles.length === 0) {
    console.log('⚠️  No articles found in data file. Skipping...');
    return;
  }
  
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container } = await database.containers.createIfNotExists({ 
    id: 'articles',
    partitionKey: { paths: ['/id'] }
  });
  
  let imported = 0;
  let errors = 0;
  
  for (const article of articles) {
    try {
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        content: article.content,
        url: article.url,
        category: article.category || 'general',
        scrapedAt: article.scrapedAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      await container.items.create(item);
      imported++;
      
      if (imported % 5 === 0) {
        console.log(`  ✅ Imported ${imported}/${articles.length} articles...`);
      }
    } catch (error) {
      errors++;
      console.error(`  ❌ Error importing article: ${error.message}`);
    }
  }
  
  console.log(`✅ Imported ${imported} articles (${errors} errors)`);
}

async function main() {
  console.log('🚀 Starting Azure Cosmos DB import...\n');
  
  try {
    await importQuotes();
    console.log('');
    await importArticles();
    
    console.log('\n✅ Import complete!');
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { importToCosmos: main };

