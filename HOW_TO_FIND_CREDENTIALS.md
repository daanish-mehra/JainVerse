# How to Find Azure AI Foundry Credentials

## 🔍 Finding Your Deployment Name

### Step 1: Go to Azure AI Foundry
1. Open [Azure Portal](https://portal.azure.com)
2. Search for your resource: **jainai-gpt** (or "JainAI")
3. Click on it

### Step 2: Navigate to Deployments
**Option A: Through Deployments Tab**
- In the left sidebar, look for **"Deployments"** or **"Model deployments"**
- Click on it
- You'll see a list of deployed models
- **The name shown is your deployment name**

**Option B: Through AI Studio**
- In your resource, look for **"AI Studio"** or **"Azure AI Studio"**
- Click to open it (may open in a new tab)
- In the left sidebar, click **"Deployments"**
- You'll see your deployed models
- **The name shown is your deployment name**

### Step 3: Check Deployment Details
- Click on a deployment to see details
- Common deployment names:
  - `gpt-4o-mini`
  - `gpt-4o`
  - `gpt-35-turbo`
  - `jainai-gpt4` (if you named it)
  - Or the model name itself

**📝 Note:** If you haven't deployed a model yet:
1. Go to **"Model catalog"** or **"Browse models"**
2. Select a model (recommend `gpt-4o-mini`)
3. Click **"Deploy"**
4. Name it: `jainai-gpt4` (or any name)
5. Wait 1-2 minutes for deployment

---

## 📋 Finding API Version

### Method 1: From API Documentation (Most Common)
**Use: `2024-06-01`** (latest GA version)
- This is the standard version for Azure AI Foundry
- Works with all recent features

### Method 2: From Deployment Details
1. Go to your deployment (as above)
2. Click on the deployment name
3. Look for **"API Version"** or **"Endpoint details"**
4. It might show: `2024-06-01` or `2024-02-15-preview`

### Method 3: From Endpoint URL
1. In your deployment details
2. Look for **"Endpoint"** or **"Connection string"**
3. Check the URL parameters for `api-version=`
4. This shows the API version being used

### Method 4: Azure AI Studio
1. Open **AI Studio** (from your resource)
2. Go to **"Deployments"**
3. Click on your deployment
4. Check the **"API information"** section
5. Look for **"API Version"**

---

## 🎯 Quick Reference

### Common API Versions:
- **`2024-06-01`** ← **RECOMMENDED** (Latest GA)
- `2024-02-15-preview` (Still works, older)
- `2023-12-01-preview` (Older, avoid)

### Common Deployment Names:
- `gpt-4o-mini` (if you deployed gpt-4o-mini)
- `gpt-4o` (if you deployed gpt-4o)
- `gpt-35-turbo` (if you deployed gpt-3.5-turbo)
- Custom name you gave it

---

## ✅ After You Find Them

Update your `.env.local`:

```env
AZURE_OPENAI_API_KEY=FVp69JnhMBoaVu6Y0Uoz5xttOfH4UkIQ9AHkVzZIjR3F7PXhn7U6JQQJ99BKACYeBjFXJ3w3AAAAACOG7hcs
AZURE_OPENAI_ENDPOINT=https://jainai-gpt.services.ai.azure.com/api/projects/JainAI
AZURE_OPENAI_DEPLOYMENT_NAME=YOUR_FOUND_DEPLOYMENT_NAME
AZURE_OPENAI_API_VERSION=2024-06-01
```

---

## 🆘 If You Can't Find Deployments

### You Need to Deploy a Model First:

1. **Go to Model Catalog**
   - In Azure AI Foundry → **"Models"** or **"Model catalog"**

2. **Choose a Model**
   - Click on **"gpt-4o-mini"** (recommended)
   - Or **"gpt-4o"** for better quality

3. **Deploy**
   - Click **"Deploy"** button
   - Enter deployment name: `jainai-gpt4`
   - Click **"Deploy"**
   - Wait 1-2 minutes

4. **Use the Name**
   - The name you gave it = `AZURE_OPENAI_DEPLOYMENT_NAME`
   - API version = `2024-06-01`

---

## 📸 Where to Look (Visual Guide)

```
Azure Portal
└── Your Resource (jainai-gpt)
    ├── [Left Sidebar]
    │   ├── Overview
    │   ├── Deployments ← LOOK HERE FIRST
    │   ├── Models
    │   ├── Keys and Endpoint
    │   └── AI Studio ← OR HERE
    │
    └── [AI Studio Tab]
        └── Deployments ← DEPLOYMENT NAME HERE
```

---

## 🎯 TL;DR (Too Long; Didn't Read)

1. **Deployment Name**: 
   - Azure Portal → Your resource → **Deployments** → See the model name
   - Or deploy one: Model Catalog → Choose model → Deploy → Name it

2. **API Version**: 
   - Just use **`2024-06-01`** (it works)
   - Or check in deployment details if curious

3. **Update `.env.local`** with both values
4. **Restart dev server**

