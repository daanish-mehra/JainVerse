import { NextRequest, NextResponse } from "next/server";

const quizzes = [
  {
    id: 1,
    question: "What is Ahimsa?",
    options: ["Non-violence", "Truth", "Non-stealing", "Celibacy"],
    correct: 0,
    explanation: "Ahimsa is the principle of non-violence, which is the foundation of Jain philosophy.",
    source: "Tattvarth Sutra",
  },
  {
    id: 2,
    question: "What are the main principles of Jainism?",
    options: ["Ahimsa, Satya, Asteya", "Ahimsa, Anekantvad, Aparigraha", "Ahimsa, Karma, Moksha", "All of the above"],
    correct: 1,
    explanation: "The main principles are Ahimsa (non-violence), Anekantvad (multi-sidedness), and Aparigraha (non-attachment).",
    source: "Jainworld.com",
  },
  {
    id: 3,
    question: "What is Anekantvad?",
    options: ["Non-attachment", "Multi-sidedness", "Non-violence", "Truth"],
    correct: 1,
    explanation: "Anekantvad is the principle of multi-sidedness, acknowledging that reality has multiple aspects.",
    source: "Tattvarth Sutra",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const quizId = searchParams.get("id");

  if (quizId) {
    const quiz = quizzes.find((q) => q.id === parseInt(quizId));
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz);
  }

  return NextResponse.json(quizzes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answer } = body;

    if (!quizId || answer === undefined) {
      return NextResponse.json(
        { error: "Quiz ID and answer are required" },
        { status: 400 }
      );
    }

    const quiz = quizzes.find((q) => q.id === quizId);
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
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

