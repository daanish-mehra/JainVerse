import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const practices = [
    {
      id: 1,
      type: "prayer",
      title: "Morning Prayer",
      time: "06:30",
      completed: true,
    },
    {
      id: 2,
      type: "meditation",
      title: "Meditation",
      time: "07:00",
      completed: false,
    },
    {
      id: 3,
      type: "scripture",
      title: "Scripture Reading",
      time: "08:00",
      completed: false,
    },
  ];

  return NextResponse.json({ date, practices });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { practiceId, completed, reflection } = body;

    if (!practiceId) {
      return NextResponse.json(
        { error: "Practice ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Practice updated successfully",
      practiceId,
      completed,
      reflection,
    });
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

