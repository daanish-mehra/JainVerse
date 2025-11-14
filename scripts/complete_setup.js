const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Complete Cosmos DB Setup Script\n');

const envPath = path.join(__dirname, '../.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.error('Please run: npm run setup-env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');

if (envContent.includes('your-cosmos-account') || envContent.includes('your_primary_key_here')) {
  console.error('❌ .env.local file contains placeholder values!');
  console.error('Please edit .env.local with your actual Azure Cosmos DB credentials:');
  console.error('  1. Go to Azure Portal → Your Cosmos DB account → Keys');
  console.error('  2. Copy URI and PRIMARY KEY');
  console.error('  3. Update .env.local with real values');
  process.exit(1);
}

console.log('✅ .env.local file found with credentials\n');

console.log('📋 Step 1: Testing Cosmos DB connection...\n');
try {
  execSync('npm run test-cosmos', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('\n✅ Connection test successful!\n');
} catch (error) {
  console.error('\n❌ Connection test failed!');
  console.error('Please check your credentials in .env.local');
  process.exit(1);
}

console.log('📋 Step 2: Running scraper...\n');
try {
  execSync('npm run scrape', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('\n✅ Scraper completed!\n');
} catch (error) {
  console.error('\n❌ Scraper failed!');
  process.exit(1);
}

console.log('📋 Step 3: Importing data to Cosmos DB...\n');
try {
  execSync('npm run import-cosmos', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('\n✅ Data import completed!\n');
} catch (error) {
  console.error('\n❌ Data import failed!');
  process.exit(1);
}

console.log('🎉 All setup steps completed successfully!');
console.log('\n✅ Next steps:');
console.log('  - Check Azure Portal → Data Explorer → jainai → quotes/articles containers');
console.log('  - Your Quotes API will now use real data from Cosmos DB');
console.log('  - Ready to connect Chat API and other features!\n');

