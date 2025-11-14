import { NextRequest, NextResponse } from "next/server";

const mockPractices = [
  {
    id: 1,
    icon: "🌅",
    title: "Morning Prayer",
    titleJain: "प्रातःकाल प्रार्थना",
    time: "6:30 AM",
    status: "completed",
    description: "Recite the Navkar Mantra and other daily prayers.",
  },
  {
    id: 2,
    icon: "🧘",
    title: "Meditation",
    titleJain: "ध्यान",
    time: "7:00 AM - Reminder in 10 min",
    status: "pending",
    description: "Practice 15 minutes of mindful meditation.",
  },
  {
    id: 3,
    icon: "📖",
    title: "Scripture Reading",
    titleJain: "शास्त्र पठन",
    time: "8:00 AM",
    status: "scheduled",
    description: "Read a chapter from Tattvarth Sutra.",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Fasting: Ekasan",
    titleJain: "एकासन",
    time: "Next meal: 6:00 PM",
    status: "active",
    description: "Observe Ekasan (one meal a day) today.",
  },
];

const mockVratas = [
  {
    id: 1,
    name: "Ekasan Vrata",
    day: 0,
    totalDays: 30,
    progress: 0,
    description: "A vow to eat only one meal a day.",
  },
  {
    id: 2,
    name: "Chauvihar Vrata",
    day: 15,
    totalDays: 30,
    progress: 0,
    description: "A vow to abstain from food and water after sunset.",
  },
];

const mockFastingSchedule = [
  { day: "Mon", type: "Ekasan" },
  { day: "Tue", type: "Biasan" },
  { day: "Wed", type: "Chauvihar" },
  { day: "Thu", type: "Ekasan" },
  { day: "Fri", type: "Biasan" },
  { day: "Sat", type: "Chauvihar" },
  { day: "Sun", type: "Ekasan" },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  if (type === "practices") {
    return NextResponse.json({
      date,
      practices: mockPractices,
    });
  }

  if (type === "vratas") {
    return NextResponse.json({
      vratas: mockVratas,
    });
  }

  if (type === "fasting") {
    return NextResponse.json({
      schedule: mockFastingSchedule,
    });
  }

  if (type === "progress") {
    return NextResponse.json({
      streak: 0,
      totalPractices: 0,
      vratasCompleted: 0,
      thisMonth: 0,
    });
  }

  return NextResponse.json({
    practices: mockPractices,
    vratas: mockVratas,
    fastingSchedule: mockFastingSchedule,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, practiceId, vrataId, reflection, completed } = body;

    if (action === "complete-practice") {
      if (!practiceId) {
        return NextResponse.json(
          { error: "Practice ID is required" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Practice marked as completed",
        practiceId,
        completed: completed !== false,
      });
    }

    if (action === "update-vrata") {
      if (!vrataId) {
        return NextResponse.json(
          { error: "Vrata ID is required" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Vrata updated successfully",
        vrataId,
      });
    }

    if (action === "add-reflection") {
      if (!reflection) {
        return NextResponse.json(
          { error: "Reflection text is required" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Reflection saved successfully",
        reflection: {
          id: Date.now(),
          text: reflection,
          date: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
