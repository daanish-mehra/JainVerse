import { NextRequest, NextResponse } from "next/server";
import { getArticles, getContainer } from "@/lib/cosmos";
import { generateQuizFromArticle } from "@/lib/azure-openai";
import fs from "fs";
import path from "path";

async function getLearningPathsFromData() {
  try {
    let articles: any[] = [];
    
    // Try to get from Cosmos DB first
    try {
      articles = await getArticles(100);
    } catch (error) {
      // Fallback to local file
      const articlesPath = path.join(process.cwd(), "data", "articles.json");
      if (fs.existsSync(articlesPath)) {
        const fileContent = fs.readFileSync(articlesPath, "utf-8");
        articles = JSON.parse(fileContent);
      }
    }

    // Organize articles into learning paths based on titles and content
    const paths: any[] = [];
    const pathCategories: { [key: string]: any[] } = {
      "Philosophy": [],
      "History": [],
      "Principles": [],
      "Practices": [],
      "Scriptures": [],
      "Mantras": [],
    };

    articles.forEach((article) => {
      const title = article.title?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      const url = article.url?.toLowerCase() || "";

      if (title.includes("philosophy") || content.includes("philosophy") || url.includes("philosophy")) {
        pathCategories["Philosophy"].push(article);
      } else if (title.includes("history") || url.includes("history")) {
        pathCategories["History"].push(article);
      } else if (title.includes("principle") || url.includes("principle")) {
        pathCategories["Principles"].push(article);
      } else if (title.includes("practice") || title.includes("meditation") || title.includes("yoga") || 
                 content.includes("meditation") || content.includes("dhyan") || content.includes("samayik") ||
                 content.includes("pratikraman") || content.includes("fasting") || content.includes("tapa")) {
        pathCategories["Practices"].push(article);
      } else if (title.includes("scripture") || title.includes("tattvarth") || title.includes("samayasar") ||
                 content.includes("acharya kundkund") || content.includes("sutra")) {
        pathCategories["Scriptures"].push(article);
      } else if (title.includes("mantra") || title.includes("namokar") || title.includes("prayer") ||
                 content.includes("namokar") || content.includes("mantra")) {
        pathCategories["Mantras"].push(article);
      }
    });

    // Create learning paths from categorized articles
    let pathId = 1;
    
    if (pathCategories["Principles"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Principles & Fundamentals",
        progress: 0,
        badges: 0,
        totalBadges: 5,
        level: "Beginner",
        description: "Learn the core principles of Jainism including Ahimsa, Anekantvad, and Aparigraha",
        articles: pathCategories["Principles"].slice(0, 10),
        modules: [
          "Introduction to Jain Principles",
          "Who was Lord Mahavira",
          "Main Principles of Jainism",
          "Living with Others",
          "The Soul and Liberation"
        ],
        summary: pathCategories["Principles"][0]?.content?.substring(0, 200) + "..." || "Core Jain principles and fundamentals"
      });
    }

    if (pathCategories["Philosophy"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Philosophy & Conduct",
        progress: 0,
        badges: 0,
        totalBadges: 6,
        level: "Intermediate",
        description: "Deep dive into Jain philosophy, conduct (Charitra), and ethical principles",
        articles: pathCategories["Philosophy"].slice(0, 15),
        modules: [
          "Conduct (Charitra)",
          "Householder's Conduct (Shrawak Dharma)",
          "Monkshood (Sadhu Dharma)",
          "Spiritual Progress",
          "God (Tirthankars)",
          "Death and Life after Death"
        ]
      });
    }

    if (pathCategories["History"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain History & Tradition",
        progress: 0,
        badges: 0,
        totalBadges: 4,
        level: "Beginner",
        description: "Explore the rich history and traditions of Jainism",
        articles: pathCategories["History"].slice(0, 10),
        modules: [
          "Ancient Jain History",
          "Tirthankaras and Their Times",
          "Jain Traditions",
          "Modern Jain Community"
        ]
      });
    }

    if (pathCategories["Practices"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Meditation & Daily Practices",
        progress: 0,
        badges: 0,
        totalBadges: 7,
        level: "Intermediate",
        description: "Learn meditation techniques, daily rituals, and spiritual practices",
        articles: pathCategories["Practices"].slice(0, 12),
        modules: [
          "Introduction to Meditation (Dhyan)",
          "Fasting (Tapa)",
          "Worship/Prayer (Pooja/Prarthna)",
          "Pratikraman",
          "Spiritual Death (Sanlekhana)",
          "Yoga Practices",
          "Daily Routines"
        ]
      });
    }

    if (pathCategories["Mantras"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Mantras & Prayers",
        progress: 0,
        badges: 0,
        totalBadges: 4,
        level: "Beginner",
        description: "Master Jain mantras, prayers, and their meanings",
        articles: pathCategories["Mantras"].slice(0, 8),
        modules: [
          "Namokar Mantra",
          "Basic Prayers",
          "Mantra Meanings",
          "Prayer Practices"
        ]
      });
    }

    if (pathCategories["Scriptures"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Scriptures & Sacred Texts",
        progress: 0,
        badges: 0,
        totalBadges: 5,
        level: "Advanced",
        description: "Study Jain scriptures including Tattvarth Sutra and works of Acharya Kundkund",
        articles: pathCategories["Scriptures"].slice(0, 10),
        modules: [
          "Tattvarth Sutra",
          "Samayasar by Acharya Kundkund",
          "Scripture Reading Techniques",
          "Understanding Sacred Texts",
          "Applying Scripture Teachings"
        ]
      });
    }

    // If no paths created, return defaults
    if (paths.length === 0) {
      return getDefaultLearningPaths();
    }

    return paths;
  } catch (error) {
    console.error("Error creating learning paths from data:", error);
    return getDefaultLearningPaths();
  }
}

function getDefaultLearningPaths() {
  return [
    {
      id: 1,
      title: "Jain Philosophy Basics",
      progress: 0,
      badges: 0,
      totalBadges: 5,
      level: "Beginner",
      description: "Learn the fundamental principles of Jainism",
    },
    {
      id: 2,
      title: "Meditation & Practices",
      progress: 0,
      badges: 0,
      totalBadges: 5,
      level: "Intermediate",
      description: "Discover meditation techniques and daily practices",
    },
    {
      id: 3,
      title: "Mantras & Prayers",
      progress: 0,
      badges: 0,
      totalBadges: 5,
      level: "Beginner",
      description: "Master Jain mantras and prayers",
    },
    {
      id: 4,
      title: "Jain Ethics in Daily Life",
      progress: 0,
      badges: 0,
      totalBadges: 5,
      level: "Beginner",
      description: "Apply Jain ethical principles to modern living",
    },
  ];
}

async function generateQuizzesFromArticles(): Promise<any[]> {
  try {
    const container = await getContainer("quizzes");
    if (container) {
      try {
        const { resources } = await container.items.query({
          query: "SELECT TOP 10 * FROM c ORDER BY c.createdAt DESC",
        }).fetchAll();
        
        if (resources.length >= 5) {
          return resources.map((q, idx) => ({ ...q, id: q.id || idx + 1 }));
        }
      } catch (error) {
        console.warn("Failed to query quizzes from Cosmos DB:", error);
      }
    }
    
    return getDefaultQuizzes();
  } catch (error) {
    console.error("Error generating quizzes:", error);
    return getDefaultQuizzes();
  }
}

function getDefaultQuizzes() {
  return [
    {
      id: 1,
      question: "What is Ahimsa?",
      options: ["Non-violence", "Truth", "Non-stealing", "Celibacy"],
      correct: 0,
      explanation: "Ahimsa is the principle of non-violence, which is the foundation of Jain philosophy.",
      source: "Tattvarth Sutra",
      topic: "Jain Philosophy Basics",
    },
    {
      id: 2,
      question: "What are the main principles of Jainism?",
      options: ["Ahimsa, Satya, Asteya", "Ahimsa, Anekantvad, Aparigraha", "Ahimsa, Karma, Moksha", "All of the above"],
      correct: 1,
      explanation: "The main principles are Ahimsa (non-violence), Anekantvad (multi-sidedness), and Aparigraha (non-attachment).",
      source: "Jainworld.com",
      topic: "Jain Philosophy Basics",
    },
    {
      id: 3,
      question: "What is Anekantvad?",
      options: ["Non-attachment", "Multi-sidedness", "Non-violence", "Truth"],
      correct: 1,
      explanation: "Anekantvad is the principle of multi-sidedness, acknowledging that reality has multiple aspects.",
      source: "Tattvarth Sutra",
      topic: "Jain Philosophy Basics",
    },
    {
      id: 4,
      question: "What is the purpose of Samayik?",
      options: ["To earn money", "To practice equanimity and self-contemplation", "To socialize with others", "To eat food"],
      correct: 1,
      explanation: "Samayik is a practice of equanimity and self-contemplation for spiritual purification.",
      source: "Jainworld.com",
      topic: "Meditation & Practices",
    },
    {
      id: 5,
      question: "Who was the 24th Tirthankara?",
      options: ["Parshvanath", "Mahavira", "Rishabhanatha", "Neminath"],
      correct: 1,
      explanation: "Mahavira was the 24th and last Tirthankara of the current era in Jainism.",
      source: "Jainworld.com",
      topic: "History",
    },
    {
      id: 6,
      question: "What is Aparigraha?",
      options: ["Non-violence", "Non-attachment", "Truth", "Non-stealing"],
      correct: 1,
      explanation: "Aparigraha means non-attachment or non-possessiveness, one of the five main vows in Jainism.",
      source: "Tattvarth Sutra",
      topic: "Jain Philosophy Basics",
    },
    {
      id: 7,
      question: "What is Karma in Jainism?",
      options: ["Destiny", "Subtle matter that binds to the soul", "Actions only", "Punishment"],
      correct: 1,
      explanation: "In Jainism, karma is subtle matter that attaches to the soul based on thoughts, words, and actions.",
      source: "Tattvarth Sutra",
      topic: "Philosophy",
    },
    {
      id: 8,
      question: "What is Moksha?",
      options: ["Heaven", "Liberation from cycle of rebirth", "Enlightenment only", "Death"],
      correct: 1,
      explanation: "Moksha is the ultimate liberation from the cycle of birth and death (samsara) in Jainism.",
      source: "Tattvarth Sutra",
      topic: "Philosophy",
    },
    {
      id: 9,
      question: "What are the three jewels of Jainism?",
      options: ["Right faith, right knowledge, right conduct", "Gold, silver, diamond", "Ahimsa, Satya, Asteya", "Meditation, prayer, fasting"],
      correct: 0,
      explanation: "The three jewels (Ratnatraya) are right faith (Samyak Darshan), right knowledge (Samyak Jnana), and right conduct (Samyak Charitra).",
      source: "Tattvarth Sutra",
      topic: "Philosophy",
    },
    {
      id: 10,
      question: "What is Pratikraman?",
      options: ["Meditation", "Forgiveness ritual and self-reflection", "Prayer", "Fasting"],
      correct: 1,
      explanation: "Pratikraman is a ritual of repentance and self-reflection where Jains seek forgiveness for their mistakes.",
      source: "Jainworld.com",
      topic: "Practices",
    },
  ];
}

const mockStories = [
  {
    id: 1,
    title: "The Story of Mahavira",
    age: "5-10 years",
    rating: 4.8,
    pages: 10,
    description: "Learn about the life and teachings of the 24th Tirthankara",
  },
  {
    id: 2,
    title: "The Value of Ahimsa",
    age: "2-5 years",
    rating: 4.9,
    pages: 8,
    description: "A simple story teaching the importance of non-violence",
  },
  {
    id: 3,
    title: "The Elephant and the King",
    age: "5-10 years",
    rating: 4.7,
    pages: 12,
    description: "A moral story about compassion and forgiveness",
  },
];

const mockAchievements = [
  { id: 1, title: "Philosophy Master", icon: "🥇", earned: false, description: "Completed all philosophy modules." },
  { id: 2, title: "Practice Champion", icon: "🥈", earned: false, description: "Maintained a 30-day practice streak." },
  { id: 3, title: "Quiz Expert", icon: "🥉", earned: false, description: "Scored 100% on 10 quizzes." },
  { id: 4, title: "Mantra Maestro", icon: "🌟", earned: false, description: "Recited 108 mantras daily for a week." },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type === "paths") {
    const paths = await getLearningPathsFromData();
    return NextResponse.json({
      paths,
    });
  }

  if (type === "quizzes") {
    const quizId = searchParams.get("id");
    const quizzes = await generateQuizzesFromArticles();
    
    if (quizId) {
      const quiz = quizzes.find((q) => q.id === parseInt(quizId));
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }
      return NextResponse.json(quiz);
    }
    return NextResponse.json({ quizzes });
  }

  if (type === "stories") {
    return NextResponse.json({
      stories: mockStories,
    });
  }

  if (type === "achievements") {
    try {
      const container = await getContainer("userProgress");
      let progressData = {
        totalQuizzesCompleted: 0,
        totalStoriesRead: 0,
        learningPathsCompleted: 0,
        punyaPoints: 0,
        level: 1,
      };
      
      if (container) {
        try {
          const userId = "default-user";
          const { resource: progress } = await container.item(userId, userId).read().catch(() => ({
            resource: null,
          }));
          
          if (progress) {
            progressData = progress;
          }
        } catch (error) {
          console.warn("Failed to fetch progress for achievements:", error);
        }
      }
      
      const allAchievements = [
        { id: 1, title: "First Steps", icon: "🌱", description: "Complete your first quiz", earned: false },
        { id: 2, title: "Quiz Master", icon: "🥇", description: "Complete 10 quizzes", earned: (progressData.totalQuizzesCompleted || 0) >= 10 },
        { id: 3, title: "Story Lover", icon: "📚", description: "Read 5 stories", earned: (progressData.totalStoriesRead || 0) >= 5 },
        { id: 4, title: "Path Finder", icon: "🛤️", description: "Complete a learning path", earned: (progressData.learningPathsCompleted || 0) > 0 },
        { id: 5, title: "Punya Collector", icon: "✨", description: "Earn 100 Punya points", earned: (progressData.punyaPoints || 0) >= 100 },
        { id: 6, title: "Level Up", icon: "⬆️", description: "Reach level 5", earned: (progressData.level || 0) >= 5 },
        { id: 7, title: "Perfect Score", icon: "💯", description: "Get 5 perfect quiz scores", earned: false },
        { id: 8, title: "Daily Learner", icon: "📅", description: "Learn for 7 days straight", earned: false },
      ];
      
      return NextResponse.json({ achievements: allAchievements });
    } catch (error) {
      console.error("Achievements API error:", error);
      return NextResponse.json({ achievements: mockAchievements });
    }
  }

  if (type === "progress") {
    try {
      const container = await getContainer("userProgress");
      if (!container) {
        return NextResponse.json({
          punyaPoints: 0,
          level: 1,
          totalQuizzesCompleted: 0,
          totalStoriesRead: 0,
        });
      }
      
      const userId = "default-user";
      const { resource: progress } = await container.item(userId, userId).read().catch(() => ({
        resource: null,
      }));
      
      if (!progress) {
        return NextResponse.json({
          punyaPoints: 0,
          level: 1,
          totalQuizzesCompleted: 0,
          totalStoriesRead: 0,
        });
      }
      
      return NextResponse.json(progress);
    } catch (error) {
      console.error("Progress fetch error:", error);
      return NextResponse.json({
        punyaPoints: 0,
        level: 1,
        totalQuizzesCompleted: 0,
        totalStoriesRead: 0,
      });
    }
  }

  return NextResponse.json({
    paths: mockLearningPaths,
    quizzes: mockQuizzes,
    stories: mockStories,
    achievements: mockAchievements,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, quizId, answer, pathId, storyId } = body;

    if (action === "submit-quiz") {
      if (!quizId || answer === undefined) {
        return NextResponse.json(
          { error: "Quiz ID and answer are required" },
          { status: 400 }
        );
      }

      const quizzes = await generateQuizzesFromArticles();
      const quiz = quizzes.find((q) => q.id === quizId);
      
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      const isCorrect = quiz.correct === answer;
      const points = isCorrect ? 10 : 0;
      
      if (isCorrect) {
        try {
          const container = await getContainer("userProgress");
          if (container) {
            const userId = "default-user";
            let { resource: progress } = await container.item(userId, userId).read().catch(() => ({
              resource: null,
            }));
            
            if (!progress) {
              progress = {
                id: userId,
                punyaPoints: 0,
                level: 1,
                totalQuizzesCompleted: 0,
                totalStoriesRead: 0,
                learningPathsCompleted: 0,
                achievementsUnlocked: 0,
                quizHistory: [],
                pathProgress: {},
                achievements: [],
              };
            }
            
            progress.totalQuizzesCompleted = (progress.totalQuizzesCompleted || 0) + 1;
            progress.punyaPoints = (progress.punyaPoints || 0) + points;
            if (!progress.quizHistory) progress.quizHistory = [];
            progress.quizHistory.push({ quizId, points, completedAt: new Date().toISOString() });
            progress.level = Math.floor((progress.punyaPoints || 0) / 100) + 1;
            
            await container.items.upsert(progress);
          }
        } catch (error) {
          console.error("Failed to update progress:", error);
        }
      }

      return NextResponse.json({
        correct: isCorrect,
        points,
        explanation: quiz.explanation,
        source: quiz.source,
      });
    }

    if (action === "update-path-progress") {
      if (!pathId) {
        return NextResponse.json(
          { error: "Path ID is required" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Learning path progress updated",
        pathId,
      });
    }

    if (action === "unlock-achievement") {
      return NextResponse.json({
        success: true,
        message: "Achievement unlocked!",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Learn API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

