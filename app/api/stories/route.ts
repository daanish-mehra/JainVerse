import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          {
            error: "Gemini API key not configured",
            message: "Please configure GEMINI_API_KEY in environment variables.",
          },
          { status: 500 }
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const modelNames = ['gemini-2.5-flash-preview-05-20', 'gemini-2.5-pro-preview-03-25'];

      const prompt = `Create an engaging Jain story for ${ageGroup} year olds about "${theme}".

${character ? `Main character: ${character}` : ""}

Requirements:
- Age-appropriate language and concepts for ${ageGroup} year olds
- Incorporate Jain values (Ahimsa/non-violence, truth, compassion, etc.)
- Engaging narrative with a clear moral lesson
- 500-800 words long
- Suitable for children learning about Jainism
${style ? `- Writing style: ${style}` : ""}

Return your response in JSON format:
{
  "title": "Story title",
  "content": "Full story text (500-800 words)",
  "moral": "The moral lesson of the story"
}

Make sure the story is engaging, age-appropriate, and teaches important Jain principles through the narrative.`;

      // Try multiple models with retry logic
      let lastError: Error | null = null;
      let success = false;
      let text = '';

      for (let attempt = 0; attempt < modelNames.length; attempt++) {
        try {
          const currentModel = genAI.getGenerativeModel({ model: modelNames[attempt] });
          console.log(`Story generation: Trying model ${modelNames[attempt]} (attempt ${attempt + 1}/${modelNames.length})`);
          
          const result = await currentModel.generateContent(prompt);
          const response = await result.response;
          text = response.text() || '';

          if (text && text.trim().length > 0) {
            success = true;
            break; // Success - exit retry loop
          }
        } catch (error: any) {
          lastError = error;
          const errorMsg = error instanceof Error ? error.message : String(error);
          const errorString = errorMsg.toLowerCase();
          
          // If it's a 404 and we have more models to try, continue
          if (errorString.includes('404') && attempt < modelNames.length - 1) {
            console.log(`Model ${modelNames[attempt]} not available, trying next model...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          
          // If it's a 503/overload, retry with same model
          if ((errorString.includes('503') || errorString.includes('overloaded') || errorString.includes('service unavailable')) && attempt < modelNames.length - 1) {
            console.log(`Model ${modelNames[attempt]} overloaded, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            attempt--; // Retry same model
            continue;
          }
          
          // For other errors or last attempt, continue to next iteration or throw
          if (attempt === modelNames.length - 1) {
            // Last attempt failed, will throw after loop
            break;
          }
        }
      }

      if (!success || !text) {
        throw lastError || new Error('All Gemini models failed');
      }

      // Try to extract JSON from response
      let storyData;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          storyData = JSON.parse(jsonMatch[0]);
        } catch (e) {
          // If JSON parsing fails, create a simple structure
          storyData = {
            title: `${theme} - A Jain Story`,
            content: text,
            moral: `This story teaches us about ${theme} through Jain principles.`,
          };
        }
      } else {
        // Fallback if no JSON found
        storyData = {
          title: `${theme} - A Jain Story`,
          content: text,
          moral: `This story teaches us about ${theme} through Jain principles.`,
        };
      }

      return NextResponse.json({
        success: true,
        title: storyData.title || `${theme} - A Jain Story`,
        content: storyData.content || text,
        moral: storyData.moral || `This story teaches us about ${theme} through Jain principles.`,
        ageGroup,
        theme,
        style: style || "friendly",
      });
    } catch (error) {
      console.error("Story generation error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorString = errorMsg.toLowerCase();

      // Handle specific Gemini errors
      if (errorString.includes('503') || errorString.includes('overloaded') || errorString.includes('service unavailable')) {
        return NextResponse.json(
          {
            error: "Story service is temporarily unavailable",
            message: "The story generation service is currently busy. Please try again in a moment.",
          },
          { status: 503 }
        );
      }

      if (errorString.includes('429') || errorString.includes('quota') || errorString.includes('rate limit')) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Too many requests. Please try again in a moment.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "Story generation failed",
          message: errorMsg || "Please check your Gemini API key configuration.",
        },
        { status: 500 }
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

