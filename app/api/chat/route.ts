import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Language mapping for better Gemini understanding
const languageMap: Record<string, string> = {
  EN: 'English',
  HI: 'Hindi',
  GU: 'Gujarati',
  SA: 'Sanskrit',
  PA: 'Punjabi',
};

// Get system prompt based on level and language
function getSystemPrompt(level: string, language: string): string {
  const langName = languageMap[language] || 'English';
  const langInstruction = language === 'EN' 
    ? '' 
    : `IMPORTANT: Respond entirely in ${langName}. All your responses must be in ${langName} language.`;

  const levelInstructions = {
    beginner: `You are a friendly and compassionate Jain philosophy teacher speaking to someone who is new to Jainism. 
- Use simple, clear language with everyday examples
- Avoid complex Sanskrit terms, or when you must use them, provide simple explanations
- Break down concepts into easy-to-understand parts
- Use analogies and relatable examples
- Be encouraging and supportive
- Keep responses concise (2-3 paragraphs maximum)
- Focus on practical applications and basic concepts`,
    
    intermediate: `You are a knowledgeable Jain philosophy guide speaking to someone with some understanding of Jainism.
- Use appropriate Jain terminology with brief explanations
- Provide more detailed explanations of concepts
- Discuss the connections between different Jain principles
- Reference historical context and key texts when relevant
- Explain the deeper meanings and philosophical implications
- Allow for moderate complexity in responses
- Include examples from Jain history and practices`,
    
    scholar: `You are an expert Jain philosophy scholar speaking to someone with deep knowledge of Jainism.
- Use authentic Sanskrit and Prakrit terminology with precision
- Provide comprehensive, in-depth analysis
- Reference primary texts (Tattvarth Sutra, Acharanga Sutra, etc.)
- Discuss nuanced philosophical debates and interpretations
- Include scholarly perspectives and academic discourse
- Explore subtle distinctions and advanced concepts
- Provide detailed citations and sources when relevant`,
  };

  return `You are JainAI, an expert assistant specializing in Jain philosophy, ethics, practices, and spirituality. Your role is to help users learn about and practice Jainism with authenticity, accuracy, and compassion.

CORE PRINCIPLES TO ALWAYS UPHOLD:
1. Ahimsa (Non-violence): Emphasize compassion for all living beings
2. Satya (Truth): Provide accurate information based on authentic Jain sources
3. Aparigraha (Non-possessiveness): Encourage detachment and simplicity
4. Anekantavada (Non-absolutism): Present multiple perspectives when appropriate
5. Respect: Honor all Tirthankaras and Jain traditions

${langInstruction}

LEVEL OF RESPONSE: ${level.toUpperCase()}
${levelInstructions[level as keyof typeof levelInstructions]}

RESPONSE GUIDELINES:
- Be warm, respectful, and encouraging
- Be very concise and to the point - don't beat around the bush or be too verbose
- When discussing practices (vrata, meditation, etc.), provide practical guidance
- If asked about controversial topics, present balanced perspectives
- Always maintain reverence for Jain traditions and teachings
- Include relevant context and examples
- If you don't know something, admit it rather than guessing

TOPICS YOU CAN HELP WITH:
- Jain philosophy and core principles
- The 24 Tirthankaras and their teachings
- Karma theory and its application
- Moksha (liberation) and the path to enlightenment
- Ethical practices (Ahimsa, Satya, etc.)
- Vratas (vows) and observances
- Meditation and spiritual practices
- Jain history and traditions
- Daily practices and rituals
- Comparison with other philosophies (when appropriate)
- Modern applications of Jain principles

Remember to respond in a way that matches the user's level of understanding (${level}) and always in ${langName} language.`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, language = "EN", mode = "beginner" } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { 
          error: 'API configuration error', 
          text: "I apologize, but the chatbot service is not properly configured. Please contact support." 
        },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2ç.5-flash for better performance and lower latency
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Get system prompt based on level and language
    const systemPrompt = getSystemPrompt(mode, language);

    // Create the full prompt
    const fullPrompt = `${systemPrompt}

User's question: ${message}

Please provide a helpful, accurate response that matches the user's level of understanding and is entirely in ${languageMap[language] || 'English'} language.`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Return response
    // Note: Gemini API doesn't provide sources or confidence scores
    // These fields are excluded to avoid misleading users
    return NextResponse.json({
      text: text,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { 
            error: 'Invalid API key', 
            text: "I apologize, but there's an authentication issue. Please check the API configuration." 
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded', 
            text: "I'm currently experiencing high demand. Please try again in a moment." 
          },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response', 
        text: "I apologize, but I'm having trouble processing your request right now. Please try again later." 
      },
      { status: 500 }
    );
  }
}
