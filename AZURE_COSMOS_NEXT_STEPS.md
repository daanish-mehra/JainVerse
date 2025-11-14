# 🎉 Azure Cosmos DB Deployment Complete - Next Steps

## ✅ Deployment Status: **COMPLETE**

Your Azure Cosmos DB account has been successfully created! Now let's set it up.

---

## Step 1: Get Your Connection Keys 🔑

### In Azure Portal:

1. **Go to your Cosmos DB account** (click "Go to resource" or find it in "All resources")

2. **Navigate to "Keys"** (in the left sidebar under "Settings")

3. **Copy these values** (you'll need them for `.env.local`):
   - **URI** (Endpoint): Something like `https://jainai-cosmos-xxx.documents.azure.com:443/`
   - **PRIMARY KEY**: Long string starting with something like `xxxxxxxxxxxx...`

   ⚠️ **Keep these secure!** Never commit them to GitHub.

---

## Step 2: Create Database & Containers 📦

### In Azure Portal:

1. **Go to "Data Explorer"** (left sidebar)

2. **Create Database:**
   - Click **"New Container"**
   - **Database**: Select **"Create new database"**
   - **Database name**: `jainai`
   - **Throughput**: **"Autoscale"** (default - 400 RU/s is fine)
   - **Container name**: `quotes`
   - **Partition key**: `/id`
   - Click **"OK"** (this creates both the database and first container)

3. **Create Container 2: `articles`**
   - Click **"New Container"** again
   - **Database**: Select `jainai` (existing)
   - **Container name**: `articles`
   - **Partition key**: `/id`
   - Click **"OK"**

4. **Create Container 3: `practices`** (for user practices)
   - Click **"New Container"**
   - **Database**: Select `jainai`
   - **Container name**: `practices`
   - **Partition key**: `/userId`
   - Click **"OK"**

5. **Create Container 4: `quizResults`** (for quiz results)
   - Click **"New Container"**
   - **Database**: Select `jainai`
   - **Container name**: `quizResults`
   - **Partition key**: `/userId`
   - Click **"OK"**

**Expected result**: You should see:
- Database: `jainai`
  - Container: `quotes`
  - Container: `articles`
  - Container: `practices`
  - Container: `quizResults`

---

## Step 3: Set Up Environment Variables 🔐

### Create/Update `.env.local` file:

1. **Navigate to your project:**
   ```bash
   cd /Users/daanish/Desktop/JainAI/jainverse
   ```

2. **Create/Edit `.env.local` file:**
   ```bash
   # If file doesn't exist, create it
   touch .env.local
   
   # Or open it in your editor
   # nano .env.local
   # or
   # code .env.local
   ```

3. **Add these lines** (replace with YOUR values from Step 1):
   ```env
   # Azure Cosmos DB
   AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
   AZURE_COSMOS_KEY=your_primary_key_here
   AZURE_COSMOS_DATABASE=jainai
   
   # Azure OpenAI (if you have it)
   AZURE_OPENAI_API_KEY=your_key_here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   
   # ElevenLabs (if you have it)
   ELEVENLABS_API_KEY=your_key_here
   ```

4. **Save the file** (`Ctrl+S` or `Cmd+S`)

   ⚠️ **Make sure `.env.local` is in `.gitignore`** (it should be by default)

---

## Step 4: Run the Scraper (If Not Done) 📥

If you haven't scraped jainworld.com yet:

```bash
cd /Users/daanish/Desktop/JainAI/jainverse
npm run scrape
```

This will create:
- `data/quotes.json`
- `data/articles.json`

**Expected output:**
```
🚀 Starting Jainworld.com scraper...
Scraping /...
✅ Saved X quotes and Y articles
```

---

## Step 5: Import Data to Cosmos DB 📤

Once you have the data files and environment variables set:

```bash
cd /Users/daanish/Desktop/JainAI/jainverse
npm run import-cosmos
```

**Expected output:**
```
🚀 Starting Azure Cosmos DB import...

📥 Importing quotes...
  ✅ Imported 10/100 quotes...
  ✅ Imported 20/100 quotes...
✅ Imported 100 quotes (0 errors)

📥 Importing articles...
  ✅ Imported 5/50 articles...
  ✅ Imported 10/50 articles...
✅ Imported 50 articles (0 errors)

✅ Import complete!
```

---

## Step 6: Verify Data Import ✅

### In Azure Portal:

1. **Go to "Data Explorer"** in your Cosmos DB account

2. **Click on `jainai` database → `quotes` container**

3. **Click "Items"** (should see your imported quotes!)

4. **Check `articles` container** (should see articles too!)

**You should see:**
- Quotes with fields: `id`, `quote`, `author`, `source`, `category`, `createdAt`
- Articles with fields: `id`, `title`, `content`, `url`, `category`, `scrapedAt`, `createdAt`

---

## Step 7: Test the Connection 🧪

I'll create a test script to verify everything works:

```bash
cd /Users/daanish/Desktop/JainAI/jainverse
node scripts/test_cosmos.js
```

This will:
- ✅ Test connection to Cosmos DB
- ✅ List databases and containers
- ✅ Count items in each container
- ✅ Show sample data

---

## 🎯 Quick Checklist

- [ ] ✅ Cosmos DB account created
- [ ] Get connection keys (URI + Primary Key)
- [ ] Create database: `jainai`
- [ ] Create container: `quotes` (partition: `/id`)
- [ ] Create container: `articles` (partition: `/id`)
- [ ] Create container: `practices` (partition: `/userId`)
- [ ] Create container: `quizResults` (partition: `/userId`)
- [ ] Create/update `.env.local` with connection keys
- [ ] Run scraper: `npm run scrape` (if needed)
- [ ] Import data: `npm run import-cosmos`
- [ ] Verify data in Azure Portal
- [ ] Test connection

---

## 🚀 Next: Connect APIs to Cosmos DB

Once data is imported, I'll help you:
1. Update API routes to fetch from Cosmos DB
2. Create helper functions for Cosmos DB queries
3. Test the chat API with real data
4. Connect all features to the database

---

## ❓ Need Help?

If you run into any issues:
1. Check the error message
2. Verify `.env.local` has correct values
3. Make sure containers are created
4. Check Azure Portal → Data Explorer → verify items exist

Let me know when you've completed these steps! 🎉

