import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getArticles } from '@/lib/cosmos';
import { detectActionFromMessage } from '@/lib/action-detector';

const languageMap: Record<string, string> = {
  EN: 'English',
  HI: 'Hindi',
  GU: 'Gujarati',
  SA: 'Sanskrit',
  PA: 'Punjabi',
};

function getSystemPrompt(level: string, language: string, context?: string): string {
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
- Keep responses concise (1-2 sentences when action button is available, 2-3 paragraphs otherwise)
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

${context ? `\nRelevant context from Jain scriptures and teachings:\n${context}\n` : ""}

RESPONSE GUIDELINES:
- Be warm, respectful, and encouraging
- Be very concise and to the point - especially when an action button will guide users to more details
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
  let message: string | undefined;
  let language = "EN";
  let mode = "beginner";
  
  try {
    const body = await req.json();
    message = body.message;
    language = body.language || "EN";
    mode = body.mode || "beginner";
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let context = "";
    
    // Simple RAG: Search for relevant articles based on keywords
    try {
      const articles = await getArticles(20);
      const lowerMessage = message.toLowerCase();
      
      const relevantArticles = articles.filter(article => {
        const title = article.title?.toLowerCase() || "";
        const content = article.content?.toLowerCase() || "";
        const keywords = lowerMessage.split(/\s+/);
        
        return keywords.some(keyword => 
          keyword.length > 3 && (title.includes(keyword) || content.includes(keyword))
        );
      });

      if (relevantArticles.length > 0) {
        context = relevantArticles
          .slice(0, 3)
          .map(article => `Title: ${article.title}\nContent: ${article.content.substring(0, 500)}...`)
          .join("\n\n---\n\n");
      }
    } catch (error) {
      console.warn("Failed to fetch context from articles:", error);
    }

    // Detect if we should show an action button (before generating response)
    let action;
    try {
      action = detectActionFromMessage(message);
    } catch (error) {
      console.warn('Failed to detect action:', error);
      action = undefined;
    }
    
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      const fallbackResponse = mode === "beginner" 
        ? "I'm here to help you learn about Jain philosophy! Try asking about:\n\n• What is Ahimsa?\n• Tell me about Mahavira\n• What is Jainism?\n• Explain Tirthankaras"
        : "I apologize, but the chatbot service is not properly configured. Please check your Gemini API key configuration.";
      
      return NextResponse.json({
        text: fallbackResponse,
        sources: ["Jainworld.com"],
        confidence: 60,
        action: action || undefined,
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Get system prompt based on level and language
    const systemPrompt = getSystemPrompt(mode, language, context);

    // Create the full prompt
    const fullPrompt = `${systemPrompt}

User's question: ${message}

Please provide a helpful, accurate response that matches the user's level of understanding and is entirely in ${languageMap[language] || 'English'} language.${action ? ' Keep your response concise (1-2 sentences) as the user will be directed to more detailed content via an action button.' : ''}`;

    // Generate response
    let responseText: string;
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      responseText = response.text();
      
      // Validate response
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return a user-friendly error instead of throwing
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', {
        message: errorMessage,
        error: error,
      });
      
      // Check for specific Gemini errors
      if (errorMessage.includes('API_KEY') || errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        return NextResponse.json({
          text: "I apologize, but there's an authentication issue with the chatbot service. Please check your Gemini API key configuration.",
          sources: ["Jainworld.com"],
          confidence: 60,
          action: action || undefined,
        }, { status: 401 });
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return NextResponse.json({
          text: "I'm currently experiencing high demand. Please try again in a moment.",
          sources: ["Jainworld.com"],
          confidence: 60,
          action: action || undefined,
        }, { status: 429 });
      }
      
      // For other errors, throw to be caught by outer catch
      throw error;
    }

    // Make response more concise if action button is available
    if (action && responseText.length > 150) {
      const firstSentence = responseText.split(/[.!?]/)[0];
      if (firstSentence.length > 50 && firstSentence.length < 200) {
        responseText = firstSentence.trim() + '.';
      } else {
        responseText = responseText.substring(0, 150).trim() + '...';
      }
    }

    // Extract sources from response text
    const sources: string[] = [];
    const sourcePatterns = [
      /Tattvarth\s+Sutra/gi,
      /Jainworld\.com/gi,
      /Acharanga\s+Sutra/gi,
      /Acharya\s+Kundkund/gi,
      /Samayasar/gi,
    ];
    sourcePatterns.forEach((pattern) => {
      const matches = responseText.match(pattern);
      if (matches) {
        sources.push(...matches);
      }
    });

    const confidence = sources.length > 0 || context ? 95 : 80;
    
    return NextResponse.json({
      text: responseText,
      sources: sources.length > 0 ? Array.from(new Set(sources)) : (context ? ["Jainworld.com"] : []),
      confidence,
      action: action || undefined,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Detect action even on error (message might not be defined if error happened early)
    let action;
    try {
      action = message ? detectActionFromMessage(message) : undefined;
    } catch {
      action = undefined;
    }
    
    // Get error details safely
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = errorMessage.toLowerCase();
    
    console.error('Full error details:', {
      errorMessage,
      error,
      message: message || 'undefined',
      mode,
      language,
    });
    
    // Handle specific Gemini API errors
    if (errorString.includes('api_key') || errorString.includes('api key') || errorString.includes('401') || errorString.includes('403') || errorString.includes('unauthorized') || errorString.includes('forbidden')) {
      const fallbackResponse = mode === "beginner" 
        ? "I'm here to help you learn about Jain philosophy! Try asking about:\n\n• What is Ahimsa?\n• Tell me about Mahavira\n• What is Jainism?\n• Explain Tirthankaras"
        : "I apologize, but there's an authentication issue with the chatbot service. Please check your Gemini API key configuration.";
      
      return NextResponse.json({
        text: fallbackResponse,
        sources: ["Jainworld.com"],
        confidence: 60,
        action: action || undefined,
      });
    }
    
    if (errorString.includes('quota') || errorString.includes('rate limit') || errorString.includes('429') || errorString.includes('too many requests')) {
      return NextResponse.json({
        text: "I'm currently experiencing high demand. Please try again in a moment.",
        sources: ["Jainworld.com"],
        confidence: 60,
        action: action || undefined,
      }, { status: 429 });
    }
    
    // Always return 200 with fallback response - don't return 500
    // This ensures the frontend doesn't break even if there's an error
    const fallbackResponse = mode === "beginner" 
      ? "I'm here to help you learn about Jain philosophy! Try asking about:\n\n• What is Ahimsa?\n• Tell me about Mahavira\n• What is Jainism?\n• Explain Tirthankaras\n• What is Karma in Jainism?\n• How to achieve Moksha?\n• What are Vratas?\n• Jain meditation practices"
      : `I apologize, but I'm having trouble processing your request right now. ${errorMessage ? `Error: ${errorMessage.substring(0, 100)}` : 'Please try again later.'}`;
    
    return NextResponse.json({
      text: fallbackResponse,
      sources: ["Jainworld.com"],
      confidence: 60,
      action: action || undefined,
    });
  }
}

