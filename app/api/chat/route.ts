import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language = "EN", mode = "beginner" } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
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

    const systemPrompt = getSystemPrompt(mode);
    const userMessage = translateMessage(message, language);

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Azure OpenAI error", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    const result = {
      message: assistantMessage,
      sources: extractSources(assistantMessage),
      confidence: calculateConfidence(data),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function getSystemPrompt(mode: string): string {
  const basePrompt = "You are a knowledgeable Jain philosophy assistant. Provide accurate, scripture-backed information about Jainism, including principles like Ahimsa (non-violence), Anekantvad (multi-sidedness), Aparigraha (non-attachment), and other Jain teachings. Always cite sources when possible.";
  
  const modePrompts: Record<string, string> = {
    beginner: "Explain concepts in simple, easy-to-understand language suitable for beginners. Use examples and analogies.",
    intermediate: "Provide detailed explanations suitable for those with some knowledge of Jainism.",
    scholar: "Provide scholarly, in-depth explanations with references to Agamas and Jain texts. Use Sanskrit/Prakrit terms where appropriate.",
  };

  return `${basePrompt} ${modePrompts[mode] || modePrompts.beginner}`;
}

function translateMessage(message: string, language: string): string {
  if (language === "EN") return message;
  
  return message;
}

function extractSources(message: string): string[] {
  const sources: string[] = [];
  const sourcePatterns = [
    /Tattvarth\s+Sutra/i,
    /Jainworld\.com/i,
    /Acharanga\s+Sutra/i,
    /Sthananga\s+Sutra/i,
  ];

  sourcePatterns.forEach((pattern) => {
    if (pattern.test(message)) {
      sources.push(message.match(pattern)?.[0] || "");
    }
  });

  return sources.length > 0 ? sources : ["General Jain knowledge"];
}

function calculateConfidence(data: any): number {
  if (!data.choices?.[0]) return 80;
  
  const finishReason = data.choices[0].finish_reason;
  if (finishReason === "stop") return 95;
  if (finishReason === "length") return 85;
  
  return 80;
}

