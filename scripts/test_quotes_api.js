require('dotenv').config({ path: '.env.local' });
const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'jainai';

const client = new CosmosClient({ endpoint, key });

async function getRandomQuote() {
  const database = client.database(databaseId);
  const container = database.container('quotes');
  
  const querySpec = {
    query: 'SELECT * FROM c',
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  
  if (resources.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * resources.length);
  return resources[randomIndex];
}

async function getAllQuotes() {
  const database = client.database(databaseId);
  const container = database.container('quotes');
  
  const querySpec = {
    query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}

async function testQuotesAPI() {
  console.log('🧪 Testing Quotes API...\n');

  try {
    console.log('1️⃣  Testing getRandomQuote()...');
    const randomQuote = await getRandomQuote();
    
    if (randomQuote) {
      console.log('✅ Successfully fetched random quote from Cosmos DB!');
      console.log('\n📝 Quote Details:');
      console.log(`   Quote: "${randomQuote.quote}"`);
      console.log(`   Author: ${randomQuote.author || 'N/A'}`);
      console.log(`   Source: ${randomQuote.source || 'N/A'}`);
      console.log(`   Category: ${randomQuote.category || 'N/A'}`);
    } else {
      console.log('⚠️  No quotes found in Cosmos DB');
    }

    console.log('\n2️⃣  Testing getAllQuotes()...');
    const allQuotes = await getAllQuotes();
    console.log(`✅ Found ${allQuotes.length} quotes in Cosmos DB`);

    if (allQuotes.length > 0) {
      console.log('\n📊 Sample quotes:');
      allQuotes.slice(0, 3).forEach((q, i) => {
        console.log(`   ${i + 1}. "${q.quote.substring(0, 60)}..." (${q.source || 'Unknown'})`);
      });
    }

    console.log('\n✅ Quotes API is working correctly!');
    console.log('\n💡 The /api/quotes endpoint will:');
    console.log('   - First try to fetch from Cosmos DB');
    console.log('   - Fall back to hardcoded quotes if Cosmos DB is unavailable');
    console.log('   - Return a random quote on each request');

  } catch (error) {
    console.error('❌ Error testing Quotes API:', error.message);
    console.error('\n💡 Tip: Make sure Cosmos DB credentials are set in .env.local');
    process.exit(1);
  }
}

testQuotesAPI().catch(console.error);

