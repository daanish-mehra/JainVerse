# 🚀 Backend Setup & Training Guide

## Current Status
✅ **UI Complete** - All pages built
⏳ **Backend** - Needs API integration
⏳ **Training** - Needs data ingestion and model training

---

## 📋 Step-by-Step Implementation Plan

### Phase 1: Chat Functionality (Priority 1)

#### Step 1: Set Up Azure OpenAI
```bash
# 1. Get Azure OpenAI credentials from Azure Portal
# 2. Create .env.local file:
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

#### Step 2: Create Chat API Route
**File**: `app/api/chat/route.ts` (already exists, needs implementation)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { message, language, mode } = await req.json();
    
    // Initialize Azure OpenAI
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
    });

    // Create system prompt based on mode
    const systemPrompts = {
      beginner: "You are a friendly Jain teacher explaining concepts simply...",
      intermediate: "You are a knowledgeable Jain scholar...",
      scholar: "You are an expert in Jain philosophy and scriptures..."
    };

    // Call Azure OpenAI
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        { role: "system", content: systemPrompts[mode] },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      text: response.choices[0].message.content,
      sources: [], // Will add RAG later
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
```

#### Step 3: Update Chat Page
**File**: `app/chat/page.tsx` - Update `handleSend` function to call API

```typescript
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: messages.length + 1,
    type: "user",
    text: input,
    timestamp: new Date(),
  };

  setMessages([...messages, userMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        language,
        mode,
      }),
    });

    const data = await response.json();
    
    const botMessage: Message = {
      id: messages.length + 2,
      type: "bot",
      text: data.text,
      timestamp: new Date(),
      sources: data.sources,
    };
    
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    // Handle error
  } finally {
    setIsTyping(false);
  }
};
```

---

### Phase 2: RAG System (For Accurate Responses)

#### Step 1: Install Dependencies
```bash
npm install @langchain/openai chromadb
```

#### Step 2: Data Ingestion from Jainworld.com
**File**: `scripts/ingest_jainworld.ts`

```typescript
// Scrape and process Jainworld.com content
// Convert to embeddings
// Store in ChromaDB
```

#### Step 3: RAG Integration
**File**: `lib/rag.ts`

```typescript
import { ChromaClient } from 'chromadb';

export async function retrieveRelevantContext(query: string) {
  // Search ChromaDB for relevant Jain texts
  // Return top 3-5 relevant passages
}
```

#### Step 4: Update Chat API with RAG
```typescript
// In chat route:
const context = await retrieveRelevantContext(message);
const enhancedPrompt = `Context: ${context}\n\nQuestion: ${message}`;
```

---

### Phase 3: Practice Tab

#### Step 1: Create Practice API
**File**: `app/api/practice/route.ts`

```typescript
// GET: Fetch today's practices
// POST: Mark practice as complete
// GET: Get vrata schedule
```

#### Step 2: Connect to Database
```bash
npm install @supabase/supabase-js
# OR
npm install mysql2
```

#### Step 3: Update Practice Page
- Fetch practices from API
- Store completion status
- Track streaks

---

### Phase 4: Learn Tab

#### Step 1: Create Learning API
**File**: `app/api/learn/route.ts`

```typescript
// GET: Fetch learning paths
// GET: Get quiz questions
// POST: Submit quiz answers
// GET: Get stories
```

#### Step 2: Implement Quiz Logic
- Generate questions from Jain texts
- Track progress
- Award badges

---

## 🎯 Quick Start (For Your Presentation)

### Option 1: Mock Data (Fastest - 30 minutes)
For demo purposes, use mock responses:

```typescript
// app/api/chat/route.ts
const mockResponses = {
  "what is ahimsa": "Ahimsa is the principle of non-violence...",
  "tell me about mahavira": "Mahavira was the 24th Tirthankara...",
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword matching for demo
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key)) {
      return NextResponse.json({ text: response });
    }
  }
  
  return NextResponse.json({ 
    text: "I'm still learning! Can you ask about Ahimsa, Mahavira, or Jain principles?" 
  });
}
```

### Option 2: Azure OpenAI (1-2 hours)
1. Get Azure OpenAI API key
2. Implement chat route (code above)
3. Test with real AI responses

### Option 3: Full RAG System (4-6 hours)
1. Set up ChromaDB
2. Ingest Jainworld.com data
3. Implement RAG retrieval
4. Connect to chat API

---

## 📦 Required Packages

```bash
# For Azure OpenAI
npm install openai

# For RAG (optional)
npm install @langchain/openai chromadb

# For Database (optional)
npm install @supabase/supabase-js
# OR
npm install mysql2
```

---

## 🔧 Environment Variables

Create `.env.local`:

```env
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Database (optional)
DATABASE_URL=your_database_url

# ChromaDB (optional)
CHROMA_URL=http://localhost:8000
```

---

## 🎯 Priority Order for Implementation

1. **Chat with Mock Data** (30 min) - For demo
2. **Chat with Azure OpenAI** (1-2 hours) - Real AI
3. **Practice Tab** (2-3 hours) - Basic CRUD
4. **Learn Tab** (2-3 hours) - Quizzes and progress
5. **RAG System** (4-6 hours) - Accurate responses
6. **Other Tabs** (as needed)

---

## 📱 Xcode/Android Studio Answer

**Short Answer**: You DON'T need Xcode/Android Studio right now!

**Why**: 
- Your app is a **Next.js web app** (not native)
- It runs in a browser
- For demo: Use your phone browser or PWA install
- For production: Use Capacitor later (wraps web app as native)

**For Your Presentation**:
1. **Desktop**: Show in browser (http://localhost:4000)
2. **Phone**: Install as PWA (Add to Home Screen)
3. **Mention**: "Can be wrapped with Capacitor for App Store later"

**If you want native apps later**:
- Use Capacitor (wraps your Next.js app)
- Then you can open in Xcode/Android Studio
- But NOT needed for Microsoft presentation!

---

## 🚀 Next Steps

1. ✅ Fix text formatting (DONE)
2. ⏳ Set up mock chat API (30 min)
3. ⏳ Connect chat page to API
4. ⏳ Test on phone
5. ⏳ Ready for presentation!

