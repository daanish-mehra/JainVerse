import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const vratas = [
    {
      id: 1,
      name: "Ekasan Vrata",
      day: 0,
      totalDays: 30,
      progress: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return NextResponse.json(vratas);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, totalDays, startDate } = body;

    if (!name || !totalDays) {
      return NextResponse.json(
        { error: "Name and total days are required" },
        { status: 400 }
      );
    }

    const vrata = {
      id: Date.now(),
      name,
      day: 1,
      totalDays,
      progress: 0,
      startDate: startDate || new Date().toISOString(),
      endDate: new Date(
        Date.now() + totalDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    return NextResponse.json({
      success: true,
      vrata,
    });
  } catch (error) {
    console.error("Vrata API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

