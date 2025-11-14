import OpenAI from "openai";

let azureOpenAI: OpenAI | null = null;

export function getAzureOpenAIClient(): OpenAI | null {
  if (azureOpenAI) {
    return azureOpenAI;
  }

  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

  if (!apiKey || !endpoint) {
    console.warn("Azure OpenAI credentials not configured");
    return null;
  }

  try {
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4";
    
    // Handle Azure AI Foundry endpoint format (services.ai.azure.com)
    // or standard Azure OpenAI format (openai.azure.com)
    let baseURL: string;
    if (endpoint.includes("services.ai.azure.com")) {
      // Azure AI Foundry format: https://[resource].services.ai.azure.com/api/projects/[project]
      baseURL = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deploymentName}`;
    } else {
      // Standard Azure OpenAI format: https://[resource].openai.azure.com/
      baseURL = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deploymentName}`;
    }
    
    azureOpenAI = new OpenAI({
      apiKey,
      baseURL,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": apiKey },
    });

    return azureOpenAI;
  } catch (error) {
    console.error("Failed to initialize Azure OpenAI:", error);
    return null;
  }
}

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  context?: string
): Promise<{ text: string; sources?: string[] }> {
  const client = getAzureOpenAIClient();
  
  if (!client) {
    return {
      text: "I apologize, but Azure OpenAI is not configured. Please check your environment variables.",
      sources: [],
    };
  }

  const systemPrompt = `You are JainAI, a knowledgeable and compassionate AI assistant specializing in Jain philosophy, ethics, and practices. Your goal is to help people learn about Jainism in an accurate, meaningful, and engaging way.

Key principles to follow:
- Always base your responses on authentic Jain teachings and scriptures
- Explain concepts clearly, especially for beginners
- Be respectful and compassionate
- Cite sources when mentioning specific texts (e.g., Tattvarth Sutra, Acharya Kundkund)
- Encourage ethical living and spiritual practice
- Use simple language but don't oversimplify important concepts

${context ? `\nRelevant context from Jain scriptures and teachings:\n${context}\n` : ""}

Answer the user's question based on your knowledge of Jainism and the context provided above.`;

  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages,
  ];

  try {
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4";
    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    const sources = extractSources(text);

    return { text, sources };
  } catch (error) {
    console.error("Azure OpenAI API error:", error);
    return {
      text: "I apologize, but I'm having trouble processing your request. Please try again later.",
      sources: [],
    };
  }
}

export async function generateQuizFromArticle(article: { title: string; content: string }): Promise<{
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
} | null> {
  const client = getAzureOpenAIClient();
  
  if (!client) {
    return null;
  }

  const prompt = `Based on the following Jain article, create a multiple-choice quiz question with 4 options.

Article Title: ${article.title}
Article Content: ${article.content.substring(0, 2000)}

Create ONE quiz question that tests understanding of the key concepts in this article. Return your response in JSON format:
{
  "question": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0,
  "explanation": "Brief explanation of the correct answer",
  "source": "${article.title}"
}

Make sure:
- The question is clear and tests understanding
- All options are plausible but only one is correct
- The explanation is helpful and educational
- It relates to Jain philosophy, principles, or practices`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const quiz = JSON.parse(content);
    return {
      question: quiz.question,
      options: quiz.options,
      correct: quiz.correct,
      explanation: quiz.explanation,
      source: quiz.source || article.title,
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

export async function generateStory(params: {
  age: string;
  topic: string;
  character?: string;
}): Promise<{
  title: string;
  content: string;
  moral: string;
}> {
  const client = getAzureOpenAIClient();
  
  if (!client) {
    throw new Error("Azure OpenAI not configured");
  }

  const prompt = `Create an engaging Jain story for ${params.age} year olds about "${params.topic}".

${params.character ? `Main character: ${params.character}` : ""}

Requirements:
- Age-appropriate language and concepts
- Incorporate Jain values (Ahimsa, truth, compassion, etc.)
- Engaging narrative with a clear moral lesson
- 500-800 words
- Suitable for children learning about Jainism

Return in JSON format:
{
  "title": "Story title",
  "content": "Full story text",
  "moral": "The moral lesson of the story"
}`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

export async function summarizeArticle(article: { title: string; content: string }): Promise<string> {
  const client = getAzureOpenAIClient();
  
  if (!client) {
    return article.content.substring(0, 300) + "...";
  }

  const prompt = `Summarize the following Jain article in 2-3 concise paragraphs, focusing on key concepts and teachings.

Title: ${article.title}
Content: ${article.content.substring(0, 3000)}

Provide a clear, educational summary that captures the main points.`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || article.content.substring(0, 300) + "...";
  } catch (error) {
    console.error("Error summarizing article:", error);
    return article.content.substring(0, 300) + "...";
  }
}

function extractSources(text: string): string[] {
  const sources: string[] = [];
  const sourcePatterns = [
    /Tattvarth\s+Sutra/gi,
    /Jainworld\.com/gi,
    /Acharanga\s+Sutra/gi,
    /Sthananga\s+Sutra/gi,
    /Uttaradhyayana\s+Sutra/gi,
    /Acharya\s+Kundkund/gi,
    /Samayasar/gi,
  ];

  sourcePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      sources.push(...matches);
    }
  });

  return Array.from(new Set(sources));
}

function getDeploymentName(): string {
  return process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "jainai-gpt4";
}

