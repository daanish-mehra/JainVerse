# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already done):
   ```bash
   git add -A
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. **Go to Vercel**:
   - Visit: https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository: `daanish-mehra/JainVerse`

3. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: `jainverse` (if needed)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables** (in Vercel Dashboard):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   AZURE_OPENAI_API_KEY=your_key_here (optional)
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/ (optional)
   AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4 (optional)
   AZURE_OPENAI_API_VERSION=2024-02-15-preview (optional)
   
   ELEVENLABS_API_KEY=your_key_here (optional)
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://jainverse.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd jainverse
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project? No
   - Project name: `jainai` or `jainverse`
   - Directory: `.`
   - Override settings? No

5. **Add Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   # ... add all variables
   ```

6. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 🔧 Vercel Configuration

The `vercel.json` file is already configured with:
- Framework: Next.js
- Build settings
- Environment variables mapping

---

## 📊 Database Setup (Supabase - Recommended)

### Step 1: Create Supabase Project

1. Go to: https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Name: `jainai` or `jainverse`
5. Choose region (closest to users)
6. Set password (save it!)
7. Wait for project to be created (~2 minutes)

### Step 2: Get Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Create Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Quotes table
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  source TEXT DEFAULT 'Jainworld.com',
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT UNIQUE,
  category TEXT,
  scraped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User practices table
CREATE TABLE user_practices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT,
  practice_type TEXT NOT NULL,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz results table
CREATE TABLE quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT,
  quiz_id INTEGER,
  score INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_quotes_category ON quotes(category);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_user_practices_user_id ON user_practices(user_id);
```

### Step 4: Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Public read access for quotes and articles
CREATE POLICY "Public quotes are viewable by everyone" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Public articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

-- Users can manage their own practices
CREATE POLICY "Users can manage own practices" ON user_practices
  FOR ALL USING (true);
```

---

## 🕷️ Scraping Jainworld.com

### Step 1: Run Scraper Locally

```bash
cd jainverse
npm run scrape
```

This will:
- Scrape jainworld.com for quotes and articles
- Save to `data/quotes.json` and `data/articles.json`
- Take ~5-10 minutes (respects rate limits)

### Step 2: Import to Database

```bash
npm run setup-db
```

Or manually:
```bash
# In Supabase Dashboard → Table Editor
# Import from data/quotes.json and data/articles.json
```

---

## 🎯 After Deployment

1. **Test Your App**:
   - Visit your Vercel URL
   - Test chat, practice, learn tabs
   - Check random quotes on reload

2. **Monitor**:
   - Vercel Dashboard → Analytics
   - Check logs for errors
   - Monitor API usage

3. **Custom Domain** (Optional):
   - Vercel Dashboard → Settings → Domains
   - Add your domain (e.g., jainverse.com)
   - Update DNS records

---

## 🔐 Environment Variables Reference

### Required for Database:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Optional (for AI features):
```
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_DEPLOYMENT_NAME=...
AZURE_OPENAI_API_VERSION=...

ELEVENLABS_API_KEY=...
```

---

## 🚨 Troubleshooting

### Build Fails
- Check Vercel logs for errors
- Ensure all dependencies are in `package.json`
- Check Node.js version (should be 18+)

### Database Connection Fails
- Verify Supabase credentials
- Check RLS policies
- Ensure tables are created

### Scraper Issues
- Check internet connection
- Respect rate limits (1 second delay between requests)
- May need to update selectors if site structure changes

---

## ✅ Success Checklist

- [ ] Pushed code to GitHub
- [ ] Created Vercel account
- [ ] Imported GitHub repo to Vercel
- [ ] Added environment variables
- [ ] Created Supabase project
- [ ] Created database tables
- [ ] Ran scraper (optional)
- [ ] Deployed to Vercel
- [ ] Tested live app
- [ ] Added custom domain (optional)

---

**Your app should be live at: `https://jainverse.vercel.app` 🎉**

