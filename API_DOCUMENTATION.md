# 📡 API Documentation - JainAI

## Overview
All APIs return JSON responses. Base URL: `/api`

---

## 🧘 Practice Tab APIs

### GET `/api/practice`
Get all practice-related data.

**Query Parameters:**
- `type` (optional): `practices` | `vratas` | `fasting` | `progress`
- `date` (optional): Date string (YYYY-MM-DD), defaults to today

**Example:**
```
GET /api/practice?type=practices
GET /api/practice?type=vratas
GET /api/practice?type=fasting
GET /api/practice?type=progress
```

**Response:**
```json
{
  "practices": [...],
  "vratas": [...],
  "fastingSchedule": [...],
  "progress": {
    "streak": 7,
    "totalPractices": 120,
    "vratasCompleted": 5
  }
}
```

### POST `/api/practice`
Update practice data.

**Actions:**
1. `complete-practice` - Mark practice as complete
2. `update-vrata` - Update vrata progress
3. `add-reflection` - Add journal reflection

**Request Body:**
```json
{
  "action": "complete-practice",
  "practiceId": 1,
  "completed": true
}
```

```json
{
  "action": "add-reflection",
  "reflection": "Today I practiced Ahimsa by..."
}
```

---

## 📚 Learn Tab APIs

### GET `/api/learn`
Get all learning-related data.

**Query Parameters:**
- `type` (optional): `paths` | `quizzes` | `stories` | `achievements` | `progress`
- `id` (optional): For specific quiz ID

**Example:**
```
GET /api/learn?type=paths
GET /api/learn?type=quizzes
GET /api/learn?type=quizzes&id=1
GET /api/learn?type=stories
GET /api/learn?type=achievements
GET /api/learn?type=progress
```

**Response:**
```json
{
  "paths": [...],
  "quizzes": [...],
  "stories": [...],
  "achievements": [...],
  "progress": {
    "punyaPoints": 250,
    "level": 5
  }
}
```

### POST `/api/learn`
Submit quiz answers or update progress.

**Actions:**
1. `submit-quiz` - Submit quiz answer
2. `update-path-progress` - Update learning path progress
3. `unlock-achievement` - Unlock achievement

**Request Body:**
```json
{
  "action": "submit-quiz",
  "quizId": 1,
  "answer": 0
}
```

**Response:**
```json
{
  "correct": true,
  "points": 10,
  "explanation": "...",
  "source": "Tattvarth Sutra"
}
```

---

## 💬 Chat API

### POST `/api/chat`
Generate AI chat response.

**Request Body:**
```json
{
  "message": "What is Ahimsa?",
  "language": "EN",
  "mode": "beginner"
}
```

**Response:**
```json
{
  "text": "Ahimsa (non-violence) is...",
  "sources": ["Tattvarth Sutra"],
  "confidence": 95
}
```

---

## 📖 Stories API

### POST `/api/stories`
Generate Jain story (requires Azure OpenAI).

**Request Body:**
```json
{
  "ageGroup": "5-10 years",
  "theme": "Ahimsa",
  "style": "friendly"
}
```

---

## 🎯 What Each Tab Does

### Practice Tab
**Purpose**: Track daily spiritual practices and commitments

**Features:**
1. **Today's Practices**
   - Morning Prayer
   - Meditation
   - Scripture Reading
   - Fasting (Ekasan, Biasan, Chauvihar)

2. **Vrata Tracker**
   - Track spiritual vows (Ekasan, Chauvihar, etc.)
   - Show progress (day X of Y)
   - Visual progress bars

3. **Fasting Schedule**
   - Weekly fasting calendar
   - Different fasting types per day

4. **Reflections Journal**
   - Daily reflection entries
   - Track spiritual insights

5. **Progress & Stats**
   - Current streak
   - Total practices completed
   - Vratas completed
   - Monthly statistics

---

### Learn Tab
**Purpose**: Gamified learning with quizzes and achievements

**Features:**
1. **Learning Paths**
   - Structured courses (Jain Philosophy Basics, Meditation, Mantras, etc.)
   - Progress tracking per path
   - Badge system (X/5 badges earned)
   - Difficulty levels (Beginner, Intermediate)

2. **Interactive Quizzes**
   - Multiple choice questions
   - Instant feedback (correct/incorrect)
   - Explanations with sources
   - Points system (10 points per correct answer)

3. **Jain Stories**
   - Age-appropriate stories
   - Ratings and page counts
   - Educational content

4. **Achievements**
   - Badges (Philosophy Master, Practice Champion, etc.)
   - Visual indicators (earned/not earned)
   - Achievement descriptions

5. **Punya Points System**
   - Gamification rewards
   - Points for quizzes, practices, etc.
   - Level progression

---

## 🔧 How to Use APIs in Frontend

### Example: Practice Tab
```typescript
// Fetch today's practices
const response = await fetch('/api/practice?type=practices');
const data = await response.json();
setPractices(data.practices);

// Mark practice as complete
await fetch('/api/practice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'complete-practice',
    practiceId: 1,
    completed: true,
  }),
});
```

### Example: Learn Tab
```typescript
// Fetch quizzes
const response = await fetch('/api/learn?type=quizzes');
const data = await response.json();
setQuizzes(data.quizzes);

// Submit quiz answer
const result = await fetch('/api/learn', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit-quiz',
    quizId: 1,
    answer: 0,
  }),
});
const quizResult = await result.json();
```

---

## 📝 Next Steps

1. ✅ APIs created with mock data
2. ⏳ Connect Practice page to APIs
3. ⏳ Connect Learn page to APIs
4. ⏳ Add real database (optional for demo)
5. ⏳ Integrate Azure OpenAI for stories (optional)

---

## 🎯 For Your Presentation

**Current Status:**
- ✅ APIs work with mock data
- ✅ No database needed for demo
- ✅ All endpoints functional
- ✅ Ready to connect to UI

**Future Enhancements:**
- Connect to Supabase/MySQL for persistence
- Add user authentication
- Real-time progress tracking
- Azure OpenAI for dynamic content

