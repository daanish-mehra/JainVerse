const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please set:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('📊 Creating database tables...');

  const tables = [
    {
      name: 'quotes',
      sql: `
        CREATE TABLE IF NOT EXISTS quotes (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          quote TEXT NOT NULL,
          author TEXT,
          source TEXT,
          category TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    },
    {
      name: 'articles',
      sql: `
        CREATE TABLE IF NOT EXISTS articles (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          url TEXT,
          category TEXT,
          scraped_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    },
    {
      name: 'user_practices',
      sql: `
        CREATE TABLE IF NOT EXISTS user_practices (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id TEXT,
          practice_type TEXT NOT NULL,
          completed_at TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    },
    {
      name: 'quiz_results',
      sql: `
        CREATE TABLE IF NOT EXISTS quiz_results (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id TEXT,
          quiz_id INTEGER,
          score INTEGER,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.log(`⚠️  Table ${table.name} might already exist or needs manual creation`);
      } else {
        console.log(`✅ Created table: ${table.name}`);
      }
    } catch (err) {
      console.log(`⚠️  ${table.name}: ${err.message}`);
    }
  }
}

async function importScrapedData() {
  console.log('\n📥 Importing scraped data...');
  
  try {
    const quotesPath = path.join(__dirname, '../data/quotes.json');
    const articlesPath = path.join(__dirname, '../data/articles.json');

    const quotesData = JSON.parse(await fs.readFile(quotesPath, 'utf-8'));
    const articlesData = JSON.parse(await fs.readFile(articlesPath, 'utf-8'));

    if (quotesData.length > 0) {
      const { error } = await supabase.from('quotes').upsert(quotesData, { onConflict: 'quote' });
      if (error) {
        console.error('❌ Error importing quotes:', error);
      } else {
        console.log(`✅ Imported ${quotesData.length} quotes`);
      }
    }

    if (articlesData.length > 0) {
      const { error } = await supabase.from('articles').upsert(articlesData, { onConflict: 'url' });
      if (error) {
        console.error('❌ Error importing articles:', error);
      } else {
        console.log(`✅ Imported ${articlesData.length} articles`);
      }
    }
  } catch (error) {
    console.error('❌ Error reading scraped data:', error.message);
    console.log('⚠️  Run the scraper first: npm run scrape');
  }
}

async function main() {
  console.log('🚀 Setting up database...\n');
  
  await createTables();
  await importScrapedData();
  
  console.log('\n✅ Database setup complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase: main };

