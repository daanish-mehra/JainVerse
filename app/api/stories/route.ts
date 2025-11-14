import { NextRequest, NextResponse } from "next/server";
import { generateStory } from "@/lib/azure-openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ageGroup, theme, style, character } = body;

    if (!ageGroup || !theme) {
      return NextResponse.json(
        { error: "Age group and theme are required" },
        { status: 400 }
      );
    }

    try {
      const story = await generateStory({
        age: ageGroup,
        topic: theme,
        character,
      });

      return NextResponse.json({
        success: true,
        title: story.title,
        content: story.content,
        moral: story.moral,
        ageGroup,
        theme,
        style: style || "friendly",
      });
    } catch (error) {
      console.error("Story generation error:", error);
      return NextResponse.json(
        {
          error: "Azure OpenAI not configured or story generation failed",
          message: error instanceof Error ? error.message : "Please configure Azure OpenAI API keys.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Stories API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

