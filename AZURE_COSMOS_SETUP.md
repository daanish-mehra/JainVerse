# 🚀 Azure Cosmos DB Setup Guide

## 🎯 Quick Reference for All Tabs

**See [AZURE_COSMOS_ALL_TABS.md](./AZURE_COSMOS_ALL_TABS.md) for complete guide to every tab.**

**TL;DR - Use defaults on all tabs except:**
- **Basics**: Serverless, Dev/Testing ✅
- **Global distribution**: Disable geo-redundancy ✅
- **Networking**: All Networks (for demo) ✅
- Rest: Use defaults ✅

---

## Step 1: Create Cosmos DB Account

### On the Azure Portal Page:

1. **Select API**: Choose **"Core (SQL) - Recommended"**
   - This is the **SQL (NoSQL) API** option
   - Best for JSON documents
   - Native Azure integration

2. **Subscription**: Select your subscription

3. **Resource Group**: 
   - Create new: `jainai-rg`
   - Or use existing

4. **Account Name**: `jainai-cosmos` (must be globally unique)
   - Add random numbers if taken: `jainai-cosmos-123`

5. **Location**: ⚠️ **IMPORTANT** - Choose from available regions for your subscription
   - **Recommended for US demos**: `eastus` or `eastus2` or `centralus` or `westus2`
   - **Available regions**: 
     - US: `eastus`, `eastus2`, `centralus`, `westus`, `westus2`, `westus3`, `northcentralus`, `southcentralus`, `westcentralus`
     - Europe: `northeurope`, `westeurope`, `uksouth`, `ukwest`, `francecentral`, `germanywestcentral`
     - Asia: `eastasia`, `southeastasia`, `japaneast`, `japanwest`, `koreacentral`, `centralindia`, `southindia`, `westindia`
     - Others: `canadacentral`, `canadaeast`, `brazilsouth`, `australiaeast`, `australiasoutheast`
   - **⚠️ DO NOT USE**: `centraluseuap` - This is not available for your subscription
   - Choose the region closest to you or your target audience

6. **Capacity Mode**: **"Serverless"** (Recommended for demo)
   - Cost-effective for small scale
   - Pay per request
   - Free tier eligible

7. **Apply**: Click **"Review + create"** → **"Create"**

Wait ~3-5 minutes for deployment.

---

## Step 2: Create Database & Containers

Once created, go to your Cosmos DB account:

### Create Database:
1. Click **"Data Explorer"** (left sidebar)
2. Click **"New Container"**
3. **Database**: Select **"Create new database"**
   - Database name: `jainai`
   - Throughput: **"Autoscale"** (400 RU/s) or **"Manual"** (400 RU/s)
4. Click **"OK"**

### Create Container 1: `quotes`
1. In **"Data Explorer"**, click **"New Container"**
2. **Database**: `jainai`
3. **Container**: `quotes`
4. **Partition key**: `/id`
5. Click **"OK"**

### Create Container 2: `articles`
1. Click **"New Container"**
2. **Database**: `jainai`
3. **Container**: `articles`
4. **Partition key**: `/id`
5. Click **"OK"**

### Create Container 3: `practices` (for user practices)
1. Click **"New Container"**
2. **Database**: `jainai`
3. **Container**: `practices`
4. **Partition key**: `/userId`
5. Click **"OK"**

### Create Container 4: `quizResults` (for quiz results)
1. Click **"New Container"**
2. **Database**: `jainai`
3. **Container**: `quizResults`
4. **Partition key**: `/userId`
5. Click **"OK"**

---

## Step 3: Get Connection String

1. Go to **"Keys"** (left sidebar in Cosmos DB account)
2. Copy these values:
   - **URI**: `https://jainai-cosmos.documents.azure.com:443/`
   - **Primary Key**: (long string)
   - Save both securely!

---

## Step 4: Add to Environment Variables

Add to `.env.local`:

```env
AZURE_COSMOS_ENDPOINT=https://jainai-cosmos.documents.azure.com:443/
AZURE_COSMOS_KEY=your_primary_key_here
AZURE_COSMOS_DATABASE=jainai
```

---

## Step 5: Install Azure Cosmos DB SDK

```bash
cd jainverse
npm install @azure/cosmos
```

---

## Step 6: Import Scraped Data

Once containers are created, you can:
1. Import JSON files manually via Data Explorer
2. Or use the import script I'll create

---

**Next**: I'll create the import script and update API routes to use Cosmos DB! 🚀

