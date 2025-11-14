import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI | null {
  if (geminiClient) {
    return geminiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables');
    return null;
  }

  try {
    geminiClient = new GoogleGenerativeAI(apiKey);
    return geminiClient;
  } catch (error) {
    console.error('Failed to initialize Gemini client:', error);
    return null;
  }
}

export async function generateStoryFromArticle(article: {
  title: string;
  content: string;
  age?: string;
}): Promise<{
  title: string;
  content: string;
  moral: string;
  age: string;
} | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({ model: 'gemini-pro' });
  const age = article.age || '8-12 years';
  
  const prompt = `Based on the following Jain article, create an engaging story suitable for ${age} year olds.

Article Title: ${article.title}
Article Content: ${article.content.substring(0, 3000)}

Create a story that:
- Is age-appropriate and engaging
- Incorporates the key teachings from the article
- Has a clear narrative with Jain values (Ahimsa, truth, compassion, etc.)
- Includes a moral lesson at the end
- Is 800-1200 words long
- Suitable for children learning about Jainism

Return your response in JSON format:
{
  "title": "Story title",
  "content": "Full story text (800-1200 words)",
  "moral": "The moral lesson of the story",
  "age": "${age}"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: parse the whole response
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating story from article:', error);
    return null;
  }
}

export async function generateMoralDilemmaFromArticle(article: {
  title: string;
  content: string;
}): Promise<{
  title: string;
  scenario: string;
  options: string[];
  analysis: string;
  jainPerspective: string;
} | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Based on the following Jain article, create a moral dilemma suitable for ages 10+.

Article Title: ${article.title}
Article Content: ${article.content.substring(0, 3000)}

Create a moral dilemma that:
- Presents a realistic ethical situation related to the article's content
- Has multiple plausible options (at least 3-4)
- Challenges readers to think about Jain principles
- Provides analysis from a Jain perspective
- Is thought-provoking but age-appropriate

Return your response in JSON format:
{
  "title": "Dilemma title",
  "scenario": "The ethical situation or dilemma",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "analysis": "Analysis of each option",
  "jainPerspective": "What Jain teachings say about this dilemma"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating moral dilemma:', error);
    return null;
  }
}

