# Azure AI Foundry Setup Guide

## ✅ What You Already Have

- ✅ Code ready (`lib/azure-openai.ts`)
- ✅ Azure Cosmos DB configured
- ✅ Next.js app structure

## 🎯 What You Need to Set Up

### Step 1: Azure Portal Setup (5-10 minutes)

1. **Create Azure AI Foundry Resource**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Azure AI Foundry"
   - Click "Create"

2. **Configure Basics Tab**
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Use existing (same as Cosmos DB) or create new
   - **Name**: `jainai-foundry` (or your preferred name)
   - **Region**: Same region as Cosmos DB (recommended)
   - **Pricing Tier**: Choose based on your needs
     - Standard (S0) for development
     - Premium for production

3. **Configure Network Tab**
   - **Networking**: Choose "All networks" for development
     - Or "Selected networks" for production security

4. **Tags Tab**
   - Leave as default (empty)

5. **Review + Create**
   - Review settings
   - Click "Create"
   - Wait 2-3 minutes for deployment

### Step 2: Deploy a Model (5 minutes)

1. **Navigate to Your AI Foundry Resource**
   - Go to your newly created resource
   - Click on "Model Catalog" or "Deployments"

2. **Deploy a Model**
   - Click "Deploy model" or "Create deployment"
   - Select model:
     - **Recommended**: `gpt-4o-mini` (fast, cost-effective)
     - **Alternative**: `gpt-4o` (more capable, slower)
     - **Alternative**: `gpt-35-turbo` (similar to ChatGPT)
   - **Deployment Name**: `jainai-gpt4` (must match your code)
   - Click "Deploy"
   - Wait 1-2 minutes

### Step 3: Get Your Credentials (2 minutes)

1. **Get Endpoint**
   - Go to your AI Foundry resource
   - Click "Keys and Endpoint" or "Connection strings"
   - Copy the **Endpoint** URL
     - Format: `https://your-foundry-name.openai.azure.com/`

2. **Get API Key**
   - Same page, find "Keys" section
   - Copy **Key 1** (or Key 2)
   - ⚠️ Save this securely - you won't see it again!

3. **Get Deployment Name**
   - The name you used when deploying (e.g., `jainai-gpt4`)

4. **Note API Version**
   - Usually: `2024-02-15-preview` or `2024-06-01`
   - Check in deployment details

### Step 4: Update Your Local Environment (1 minute)

1. **Create/Update `.env.local`**
   ```bash
   cd jainverse
   # Create file if it doesn't exist
   touch .env.local
   ```

2. **Add Azure AI Foundry Credentials**
   ```env
   # Azure AI Foundry / Azure OpenAI
   AZURE_OPENAI_API_KEY=your_key_1_here
   AZURE_OPENAI_ENDPOINT=https://your-foundry-name.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
   AZURE_OPENAI_API_VERSION=2024-02-15-preview

   # Azure Cosmos DB (already configured)
   AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
   AZURE_COSMOS_KEY=your_cosmos_key_here
   AZURE_COSMOS_DATABASE=jainai

   # Optional
   ELEVENLABS_API_KEY=your_key_here
   ```

3. **Replace Placeholders**
   - Replace `your_key_1_here` with actual API key
   - Replace `your-foundry-name` with your resource name
   - Replace `jainai-gpt4` if you used different deployment name
   - Replace API version if different

### Step 5: Test Connection (2 minutes)

1. **Restart Dev Server**
   ```bash
   cd jainverse
   npm run dev
   ```

2. **Test Chat**
   - Go to http://localhost:3001/chat
   - Send a test message
   - Should get AI response (not error message)

3. **Test Quotes**
   - Go to http://localhost:3001
   - Daily Reflection should load

4. **Check Console**
   - No "Azure OpenAI credentials not configured" warnings
   - No connection errors

## ✅ Checklist

- [ ] Azure AI Foundry resource created
- [ ] Model deployed (gpt-4o-mini recommended)
- [ ] Endpoint URL copied
- [ ] API Key copied and saved
- [ ] Deployment name noted
- [ ] `.env.local` file created/updated
- [ ] All environment variables set
- [ ] Dev server restarted
- [ ] Chat tested and working
- [ ] Quotes loading properly

## 🐛 Troubleshooting

### Error: "Azure OpenAI credentials not configured"
- Check `.env.local` file exists
- Verify all variables are set correctly
- Restart dev server after changing `.env.local`

### Error: "Deployment not found"
- Check deployment name matches exactly (case-sensitive)
- Verify deployment is complete (check Azure Portal)

### Error: "Invalid API key"
- Verify you copied the full key (no spaces)
- Try Key 2 if Key 1 doesn't work
- Check if key expired (regenerate in Azure Portal)

### Error: "Rate limit exceeded"
- You're making too many requests too quickly
- Wait a few seconds and try again
- Consider upgrading pricing tier

### Models not showing in catalog
- Wait a few minutes for catalog to refresh
- Check your subscription has access to models
- Try refreshing Azure Portal

## 📝 Quick Reference

**Endpoint Format:**
```
https://[your-foundry-name].openai.azure.com/
```

**Deployment URL Format:**
```
https://[your-foundry-name].openai.azure.com/openai/deployments/[deployment-name]
```

**Required Environment Variables:**
- `AZURE_OPENAI_API_KEY` - Your API key
- `AZURE_OPENAI_ENDPOINT` - Your endpoint URL
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Your deployment name
- `AZURE_OPENAI_API_VERSION` - API version (usually 2024-02-15-preview)

## 🎯 For Your Presentation

**What to Say:**
> "We're using Azure AI Foundry with GPT-4 models to power our Jain knowledge chatbot. The models are deployed via Azure AI Foundry, giving us enterprise-grade reliability and security for our knowledge democratization platform."

**Show:**
- Chat functionality working
- AI generating accurate Jain responses
- Integration with Cosmos DB for RAG

## 🚀 Next Steps After Setup

1. Test chat functionality
2. Test quiz generation
3. Test story generation
4. Verify RAG system working with Cosmos DB
5. Deploy to Vercel with environment variables

## 💰 Cost Notes

- **gpt-4o-mini**: Very affordable (~$0.15 per 1M input tokens)
- **gpt-4o**: More expensive but more capable
- **Free tier**: Usually includes $200 credit for new accounts
- **Monitor usage**: Check Azure Portal regularly

