import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/cosmos";
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
        progress: 80,
        badges: 3,
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
        ]
      });
    }

    if (pathCategories["Philosophy"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Philosophy & Conduct",
        progress: 60,
        badges: 2,
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
        progress: 40,
        badges: 1,
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
        progress: 50,
        badges: 2,
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
        progress: 30,
        badges: 1,
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
        progress: 20,
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
      progress: 80,
      badges: 3,
      totalBadges: 5,
      level: "Beginner",
      description: "Learn the fundamental principles of Jainism",
    },
    {
      id: 2,
      title: "Meditation & Practices",
      progress: 60,
      badges: 2,
      totalBadges: 5,
      level: "Intermediate",
      description: "Discover meditation techniques and daily practices",
    },
    {
      id: 3,
      title: "Mantras & Prayers",
      progress: 40,
      badges: 1,
      totalBadges: 5,
      level: "Beginner",
      description: "Master Jain mantras and prayers",
    },
    {
      id: 4,
      title: "Jain Ethics in Daily Life",
      progress: 20,
      badges: 0,
      totalBadges: 5,
      level: "Beginner",
      description: "Apply Jain ethical principles to modern living",
    },
  ];
}

const mockQuizzes = [
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
];

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
  { id: 1, title: "Philosophy Master", icon: "🥇", earned: true, description: "Completed all philosophy modules." },
  { id: 2, title: "Practice Champion", icon: "🥈", earned: true, description: "Maintained a 30-day practice streak." },
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
    if (quizId) {
      const quiz = mockQuizzes.find((q) => q.id === parseInt(quizId));
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }
      return NextResponse.json(quiz);
    }
    return NextResponse.json({ quizzes: mockQuizzes });
  }

  if (type === "stories") {
    return NextResponse.json({
      stories: mockStories,
    });
  }

  if (type === "achievements") {
    return NextResponse.json({
      achievements: mockAchievements,
    });
  }

  if (type === "progress") {
    return NextResponse.json({
      punyaPoints: 250,
      level: 5,
      totalQuizzesCompleted: 12,
      totalStoriesRead: 8,
    });
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

      const quiz = mockQuizzes.find((q) => q.id === quizId);
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      const isCorrect = quiz.correct === answer;
      const points = isCorrect ? 10 : 0;

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

