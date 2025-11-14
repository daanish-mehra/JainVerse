import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/cosmos";
import { getLearningPathsFromData } from "../../route";

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guideId = parseInt(id);
    const paths = await getLearningPathsFromData();
    const guide = paths.find((p: any) => p.id === guideId);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error("Error fetching guide:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
