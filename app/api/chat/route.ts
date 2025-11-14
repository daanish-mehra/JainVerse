import { NextRequest, NextResponse } from 'next/server';

const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureOpenAIAPIVersion =
  process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

const isAzureConfigured =
  Boolean(azureOpenAIKey) &&
  Boolean(azureOpenAIEndpoint) &&
  Boolean(azureOpenAIDeployment);

export async function POST(req: NextRequest) {
  try {
    const { message, language = "EN", mode = "beginner" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!isAzureConfigured) {
      return NextResponse.json(
        {
          error: "Azure OpenAI is not configured",
          text: "Chat is temporarily unavailable because Azure OpenAI credentials are missing.",
        },
        { status: 503 }
      );
    }

    const systemPrompt = `You are JainAI, a knowledgeable and compassionate guide to Jain philosophy.
- Provide accurate, scripture-aligned answers rooted in Jain teachings.
- Adapt tone and depth to the user's skill level (beginner, intermediate, scholar).
- When possible, ground your explanations in core principles such as Ahimsa, Anekantvad, Aparigraha, Karma, the Tirthankaras, rituals, and daily practices.
- Prefer the requested language code when feasible; otherwise answer in warm, clear English.`;

    const response = await fetch(
      `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIDeployment}/chat/completions?api-version=${azureOpenAIAPIVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureOpenAIKey as string,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Language code: ${language}\nUser level: ${mode}\n\nQuestion: ${message}`,
            },
          ],
          temperature: mode === "scholar" ? 0.3 : mode === "intermediate" ? 0.5 : 0.7,
          max_tokens: 800,
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Azure OpenAI error:", details);
      return NextResponse.json(
        {
          error: "Azure OpenAI request failed",
          text: "I’m having trouble connecting to Azure OpenAI right now. Please try again shortly.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I’m sorry, I couldn’t generate a detailed answer right now.";

    return NextResponse.json({
      text: content,
      sources: [],
      confidence: 90,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        text: "I apologize, but I’m having trouble processing your request right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
