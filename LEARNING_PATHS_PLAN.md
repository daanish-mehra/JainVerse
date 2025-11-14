# Learning Paths Course System - Implementation Plan

## Architecture Overview

### 1. **Course Detail Page** (`/learn/course/[id]`)
- Shows course overview with modules
- Displays current progress per module
- Module list with completion status
- "Continue" button to next incomplete module

### 2. **Module Viewer** (`/learn/course/[id]/module/[moduleId]`)
- Shows articles for that module
- Article reader with navigation
- Mark as complete button
- Next/Previous module navigation
- Progress tracking

### 3. **Article Reader Component**
- Full article content display
- Clean reading interface
- Summary generation (AI-powered)
- Related articles suggestions
- Quiz button if available

### 4. **Database Structure**
```typescript
// userProgress container
{
  id: "default-user",
  pathProgress: {
    "1": {
      currentModule: 2,
      completedModules: [0, 1],
      completedArticles: ["article-id-1", "article-id-2"],
      progress: 45
    }
  }
}

// Module structure in learning path
{
  id: 1,
  title: "Jain Principles & Fundamentals",
  modules: [
    {
      id: 0,
      title: "Introduction to Jain Principles",
      articles: [article1, article2, article3],
      completed: false
    },
    {
      id: 1,
      title: "Who was Lord Mahavira",
      articles: [article4, article5],
      completed: true
    }
  ]
}
```

### 5. **API Endpoints**
- `GET /api/learn/course/[id]` - Get full course with modules
- `GET /api/learn/course/[id]/module/[moduleId]` - Get module details
- `POST /api/learn/course/complete-module` - Mark module complete
- `POST /api/learn/course/complete-article` - Mark article read
- `GET /api/learn/course/[id]/progress` - Get user progress for course

### 6. **User Flow**
1. Click "Continue Learning" on a learning path
2. Navigate to `/learn/course/[id]`
3. See module list with progress
4. Click module → See articles
5. Read articles → Mark complete
6. Complete module → Get badge, unlock next module
7. Complete all modules → Course complete!

### 7. **Features**
- ✅ Module-by-module progression
- ✅ Article reading interface
- ✅ Progress tracking per module
- ✅ Badge unlocking system
- ✅ AI-generated summaries
- ✅ Related content suggestions
- ✅ Quiz integration per module

