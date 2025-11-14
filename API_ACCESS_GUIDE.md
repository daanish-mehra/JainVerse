# JainVerse API Access Guide

## Required API Keys & Permissions

### 1. ElevenLabs API (Text-to-Speech)
**Status**: ⚠️ Needs API Key
**Required**: Text-to-Speech API access
**Free Tier**: 10,000 characters/month
**Setup**:
1. Go to https://elevenlabs.io
2. Sign up / Login
3. Navigate to Profile → API Keys
4. Create new API key
5. Copy and add to `.env.local`:
   ```
   ELEVENLABS_API_KEY=your_key_here
   ```
**Endpoint Access**: 
- `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}` (POST)

### 2. Google Gemini API
**Status**: ✅ Configured
**Required**: Generate Content API access
**Setup**: Already configured with `GEMINI_API_KEY`
**Endpoints**:
- `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`

### 3. Azure Cosmos DB
**Status**: ✅ Configured
**Required**: Read/Write access to containers
**Containers**:
- `articles` - Scraped content from jainworld.com
- `quizzes` - Quiz questions and answers
- `stories` - Generated stories
- `practices` - Practice tracking
- `userProgress` - User progress and Punya points
- `reflections` - Daily reflections
- `vratas` - Vrata tracking
- `fastingSchedule` - Fasting schedules

### 4. Azure OpenAI (Optional - Not Currently Used)
**Status**: ⚠️ Configured but not used
**Note**: Switched to Gemini for all AI features

## Environment Variables Checklist

Ensure these are set in `.env.local`:

```env
# Required - Gemini API
GEMINI_API_KEY=your_gemini_key

# Required - Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=your_cosmos_endpoint
AZURE_COSMOS_KEY=your_cosmos_key
AZURE_COSMOS_DATABASE=jainai

# Optional - ElevenLabs (for story narration)
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional - Azure OpenAI (backup, not used)
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## Network Access

No special network/firewall rules needed. The app makes outbound HTTPS requests to:
- `api.elevenlabs.io` (ElevenLabs)
- `generativelanguage.googleapis.com` (Gemini)
- `*.documents.azure.com` (Cosmos DB)
