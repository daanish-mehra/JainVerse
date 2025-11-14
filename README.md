# 🕉️ JainAI - Mobile App for JainVerse

## 🎯 Overview

**JainAI** is a mobile app that integrates with **JainVerse** - an AI-powered, interactive, and visually stunning companion for the Jain Hackathon 2025. It democratizes Jain knowledge by making it accessible, engaging, and authentic for all age groups.

**JainAI** is the mobile application, while **JainVerse** is the comprehensive platform website.

## 🚀 Features

### Core Features
1. **💬 Conversational Jain Chatbot** - Multi-language AI chatbot with scripture-backed responses
2. **📚 Gamified AI Learning Modules** - Interactive quizzes, stories, and moral dilemmas
3. **🗣️ AI-Based Pronunciation & Language Tutor** - Real-time pronunciation feedback
4. **🧘 Personalized Jain Practice Companion** - Vrata tracking, fasting schedules, reminders
5. **📖 Jain Stories Creator** - AI-generated stories for different age groups
6. **📱 Automatic Social Media Content Creation** - Generate TikTok reels, YouTube shorts
7. **👨‍🏫 Teaching/Learning Companion** - Structured lessons with lecture summarizer

### Additional Features
- **🏛️ Temple Finder** - Find nearby Jain temples
- **🕐 Prayer Times** - Accurate prayer time calculator
- **📿 Mantra Library** - Complete mantra collection with audio
- **📖 Ritual Guides** - Step-by-step ritual instructions
- **👥 Community Features** - Jain community connections
- **🍽️ Nutrition Tracker** - Jain dietary restrictions database
- **🧘 Meditation Timer** - Customizable meditation timer
- **📝 Reflection Journal** - Daily reflection prompts

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.4+ with custom components
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Fonts**: Inter, Manrope (Google Fonts)

### Backend
- **Next.js Server Routes**
- **Azure OpenAI** (GPT-4o-mini / GPT-4-turbo) - for AI chat
- **Azure Cosmos DB** - Microsoft's flagship NoSQL database
- **Azure Cognitive Services** - Speech-to-Text, TTS
- **Vector DB**: Azure AI Search or ChromaDB (for RAG)

## 🎨 Design

### Color Palette
- **Saffron**: #F5B041 (Primary)
- **Gold**: #FFD700 (Accent)
- **Ivory**: #FFF8E7 (Background)
- **Jain Green**: #4E944F (Secondary)
- **Deep Blue**: #1E3A8A (Wisdom)
- **Purple**: #7C3AED (Spirituality)

### Design Principles
- Modern, minimal, spiritual theme
- Mobile-first responsive design
- Rounded corners (2xl), glassmorphism cards
- Smooth motion transitions (Framer Motion)
- Scroll-triggered animations and typewriter effects
- Fullscreen layout with bottom navigation
- Light/dark mode support (coming soon)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd jainverse
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=jainai-gpt4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# ElevenLabs (Optional)
ELEVENLABS_API_KEY=your_key_here

# Database (Optional)
DATABASE_URL=your_database_url
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000 (or the port shown in terminal)

## 📁 Project Structure

```
jainverse/
├── app/
│   ├── page.tsx              # Home page
│   ├── chat/
│   │   └── page.tsx          # Chatbot page
│   ├── learn/
│   │   └── page.tsx          # Learning page
│   ├── practice/
│   │   └── page.tsx          # Practice page
│   ├── pronounce/
│   │   └── page.tsx          # Pronunciation tutor
│   ├── stories/
│   │   └── page.tsx          # Stories page
│   ├── social/
│   │   └── page.tsx          # Social media page
│   ├── teaching/
│   │   └── page.tsx          # Teaching companion
│   ├── profile/
│   │   └── page.tsx          # Profile page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── layout/
│   │   └── BottomNav.tsx     # Bottom navigation
│   └── animations/
│       ├── ScrollReveal.tsx  # Scroll animations
│       ├── Typewriter.tsx    # Typewriter effect
│       └── FadeIn.tsx        # Fade-in animations
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🎯 Pages

### 1. Home Page (/)
- Hero section with animated JainAI branding
- Daily Jain reflection
- Quick navigation tiles
- Today's practices
- Progress summary
- Floating "Ask AI" button

### 2. Chatbot Page (/chat)
- Conversational JainAI Chat
- Multi-language support
- Beginner/Intermediate/Scholar modes
- Citation tracking
- Voice input/output

### 3. Learning Page (/learn)
- Gamified learning paths
- Interactive quizzes
- Stories & moral dilemmas
- Achievements & badges
- Punya points system

### 4. Practice Page (/practice)
- Today's practices
- Vrata tracker
- Fasting schedule
- Reflections
- Progress tracking

### 5. Pronunciation Tutor (/pronounce)
- Pronunciation practice
- Speech recognition
- Translation & transliteration
- Structured lessons
- Progress tracking

### 6. Stories Page (/stories)
- Story library
- AI story generation
- Character creation
- Age-appropriate content
- Audio narration

### 7. Social Media Page (/social)
- Content generation
- Content library
- Analytics
- Scheduled posts
- Multi-platform support

### 8. Teaching Companion (/teaching)
- Structured lessons
- Language-localized content
- Lecture summarizer
- Adaptive tutoring
- Progress reports

### 9. Profile Page (/profile)
- User profile
- Statistics
- Settings
- Progress overview
- Achievements

## 🎨 Components

### UI Components
- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Glassmorphism cards with hover effects
- **Input** - Styled input fields
- **Textarea** - Styled textarea
- **BottomNav** - Mobile-style bottom navigation

### Animation Components
- **ScrollReveal** - Elements appear on scroll
- **Typewriter** - Text typing animation
- **FadeIn** - Smooth fade-in effects

### Layout Components
- **BottomNav** - Bottom navigation bar

## 📱 Mobile Optimization

All text sizes are optimized for mobile devices with responsive breakpoints:
- Small screens: Base mobile sizes
- Medium screens: `sm:` breakpoint (640px+)
- Large screens: `md:` breakpoint (768px+)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Azure Web App
```bash
npm run build
az webapp deploy
```

## 📝 Next Steps

1. **Connect Backend**: Integrate with Azure OpenAI and ElevenLabs
2. **Add RAG System**: Implement vector database for Jainworld data
3. **Add Authentication**: User authentication and profiles
4. **Add Database**: Store user data, progress, settings
5. **Add PWA**: Make it installable
6. **Add Dark Mode**: Implement dark mode toggle
7. **Enhance Animations**: Add more scroll animations
8. **Add Testing**: Unit and integration tests
9. **Add CI/CD**: Automated deployment
10. **Add Analytics**: Track user engagement

## 🎯 Hackathon Goals

1. **Problem Identification** ✅ - Democratizing Jain knowledge
2. **Solution / Innovation** ✅ - Advanced AI techniques
3. **Jain Values / Philosophy** ✅ - Scripture-backed responses
4. **Impact** ✅ - Global reach (24+ languages)
5. **Project Path / Sustainability** ✅ - Modular architecture

## 📞 Support

- **Email**: support@jainverse.com
- **GitHub**: https://github.com/daanish-mehra/JainVerse
- **Website**: https://jainverse.app (Coming Soon)

## 📊 Contribution

### Project Statistics
**Total Lines of Code**: ~5,022 lines

**Breakdown:**
- Frontend Pages: ~2,500 lines
- API Routes: ~800 lines
- Components: ~1,200 lines
- Utilities & Config: ~522 lines

### Contributors

**Daanish Mehra** - Project Lead & Full-Stack Developer
- Primary maintainer of `main` branch
- Core architecture & design
- Feature implementation & deployment

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 🙏 Acknowledgments

- **Jainworld.com** for providing comprehensive Jain knowledge resources
- **JITO Atlanta** for organizing this hackathon
- **Microsoft** for providing Azure services
- **Jain community** for preserving and sharing knowledge

---

**Built with ❤️ for the Jain Hackathon 2025 - Microsoft Partnership**

**JainAI** - Mobile App | **JainVerse** - Platform Website
