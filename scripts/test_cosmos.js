const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config({ path: '.env.local' });

const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'jainai';

if (!endpoint || !key) {
  console.error('❌ Missing Azure Cosmos DB credentials!');
  console.error('Please set in .env.local:');
  console.error('  AZURE_COSMOS_ENDPOINT');
  console.error('  AZURE_COSMOS_KEY');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function testConnection() {
  console.log('🧪 Testing Azure Cosmos DB connection...\n');
  
  try {
    console.log('📡 Connecting to:', endpoint.replace(/\/\/.*@/, '//***@'));
    
    const databasesResult = await client.databases.readAll().fetchAll();
    const databases = databasesResult.resources || databasesResult || [];
    console.log(`✅ Connected! Found ${databases.length} database(s)\n`);
    
    const db = client.database(databaseId);
    
    try {
      const { resource: dbInfo } = await db.read();
      console.log(`📦 Database "${databaseId}" found!`);
      console.log(`   ID: ${dbInfo.id}`);
      console.log(`   _rid: ${dbInfo._rid}\n`);
    } catch (error) {
      console.log(`⚠️  Database "${databaseId}" not found. It will be created on first import.\n`);
      return;
    }
    
    const containers = ['quotes', 'articles', 'practices', 'quizResults'];
    
    for (const containerId of containers) {
      try {
        const container = db.container(containerId);
        const { resource: containerInfo } = await container.read();
        
        const { resources: items } = await container.items.readAll().fetchAll();
        
        console.log(`📂 Container: "${containerId}"`);
        console.log(`   Partition key: ${containerInfo.partitionKey?.paths?.[0] || 'N/A'}`);
        console.log(`   Items: ${items.length}`);
        
        if (items.length > 0) {
          const sample = items[0];
          const keys = Object.keys(sample).filter(k => !k.startsWith('_'));
          console.log(`   Sample keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
        }
        console.log('');
      } catch (error) {
        console.log(`⚠️  Container "${containerId}" not found. Create it in Azure Portal.\n`);
      }
    }
    
    console.log('✅ Connection test complete!');
    
  } catch (error) {
    console.error('❌ Connection test failed!');
    console.error('Error:', error.message);
    
    if (error.code === 401) {
      console.error('\n💡 Tip: Check your AZURE_COSMOS_KEY - it might be incorrect.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: Check your AZURE_COSMOS_ENDPOINT - the URL might be incorrect.');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  testConnection().catch(console.error);
}

module.exports = { testConnection };

