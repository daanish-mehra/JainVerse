import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ageGroup, theme, style } = body;

    if (!ageGroup || !theme) {
      return NextResponse.json(
        { error: "Age group and theme are required" },
        { status: 400 }
      );
    }

    const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY;
    const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainverse-gpt4";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (!azureOpenAIKey || !azureOpenAIEndpoint) {
      return NextResponse.json(
        {
          error: "Azure OpenAI not configured",
          message: "API keys not set. Please configure Azure OpenAI.",
        },
        { status: 503 }
      );
    }

    const prompt = `Create a Jain story for children aged ${ageGroup} about ${theme}. 
Style: ${style || "friendly"}. 
The story should be educational, engaging, and teach Jain values. 
Make it age-appropriate and include moral lessons.`;

    const response = await fetch(
      `${azureOpenAIEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureOpenAIKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a creative storyteller who creates engaging Jain stories for children.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Story generation failed", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const story = data.choices[0]?.message?.content || "Unable to generate story.";

    return NextResponse.json({
      success: true,
      story,
      ageGroup,
      theme,
      style,
    });
  } catch (error) {
    console.error("Stories API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

