# JainAI

AI-powered mobile application for learning and practicing Jain philosophy, ethics, and rituals. Built for JITO Atlanta Tech for Dharma Hackathon 2025.

## Overview

JainAI is a Next.js 15 mobile-first web application that provides an interactive platform for exploring Jain knowledge through AI-powered chat, gamified learning modules, practice tracking, and personalized content generation.

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS 3.4+
- Framer Motion
- Lucide Icons

### Backend
- Next.js API Routes
- Azure OpenAI (GPT-4o-mini / GPT-4-turbo)
- Azure Cosmos DB (SQL API)
- Azure Cognitive Services

## Features

- Conversational AI chatbot with multi-language support
- Gamified learning paths with quizzes and achievements
- Practice tracking for vratas, fasting, and daily rituals
- AI-generated stories for different age groups
- Social media content creation
- Pronunciation tutor with speech recognition
- Teaching companion with lecture summarization

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your_primary_key
AZURE_COSMOS_DATABASE=jainai

ELEVENLABS_API_KEY=your_key (optional)
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Build

```bash
npm run build
npm start
```

## Project Structure

```
jainverse/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chat/              # Chatbot page
│   ├── learn/             # Learning page
│   ├── practice/          # Practice tracking
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # UI primitives
│   ├── layout/            # Layout components
│   └── animations/        # Animation components
├── lib/                   # Utility functions
│   ├── utils.ts           # General utilities
│   └── cosmos.ts          # Azure Cosmos DB client
└── scripts/               # Utility scripts
    ├── scrape_jainworld.js
    └── import_to_cosmos.js
```

## API Routes

- `/api/quotes` - Random Jain quotes
- `/api/chat` - AI chatbot endpoint
- `/api/learn` - Learning paths and quizzes
- `/api/practice` - Practice tracking and vratas

## Database

Azure Cosmos DB with SQL API:

- `quotes` container - Jain quotes and teachings
- `articles` container - Scraped content from jainworld.com
- `practices` container - User practice data
- `quizResults` container - Quiz results and progress

## Scripts

```bash
npm run scrape           # Scrape jainworld.com
npm run import-cosmos    # Import data to Cosmos DB
npm run test-cosmos      # Test Cosmos DB connection
npm run test-quotes      # Test quotes API
```

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Or Azure Web App:

```bash
az webapp deploy
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Private project for JITO Atlanta Hackathon 2025.
