import { NextRequest, NextResponse } from "next/server";

const mockLearningPaths = [
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
    return NextResponse.json({
      paths: mockLearningPaths,
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

