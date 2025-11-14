import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getArticles } from '@/lib/cosmos';
import { detectActionFromMessage } from '@/lib/action-detector';
import { cleanArticleContent } from '@/lib/content-cleaner';

const languageMap: Record<string, string> = {
  EN: 'English',
  HI: 'Hindi',
  GU: 'Gujarati',
  SA: 'Sanskrit',
  PA: 'Punjabi',
};

// Get system prompt based on level and language
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
- Jain dietary principles and food (VERY IMPORTANT - see below)
- Comparison with other philosophies (when appropriate)
- Modern applications of Jain principles

JAIN DIETARY PRINCIPLES (CRITICAL FOR FOOD QUESTIONS):
- Strict vegetarianism (no meat, fish, eggs, or animal products)
- Root vegetables are avoided (onion, garlic, potato, carrot, radish, beetroot) as they contain many microorganisms
- Underground vegetables are prohibited: onions, garlic, potatoes, carrots, radishes, beetroots, sweet potatoes
- Fruits and vegetables that grow above ground are generally acceptable
- Grains, lentils, beans, nuts, and seeds are encouraged
- Dairy products are acceptable
- Avoid fermentation (alcohol, vinegar, pickles with vinegar)
- Fresh foods are preferred
- Respect for all life forms - even microscopic
- Some Jains avoid certain fruits with many seeds (figs) or that ripen after picking
- Water is filtered to remove microorganisms
- After sunset eating is avoided by many practitioners
- Cooking and preparation should minimize harm to microorganisms
- Honey is avoided by many as it harms bees

When answering food-related questions, ALWAYS:
1. Consider Jain dietary restrictions and principles
2. Suggest Jain-friendly alternatives
3. Explain the reasoning behind restrictions (Ahimsa/non-violence)
4. Provide practical, helpful guidance
5. Respect different levels of practice (some may be stricter than others)

Remember to respond in a way that matches the user's level of understanding (${level}) and always in ${langName} language.

${context ? `\nRelevant context from Jain scriptures and teachings:\n${context}\n` : ""}`;
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
              // Reduced from 20 to 5 for faster loading
              const articles = await getArticles(5);
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
          .map(article => {
            const cleanText = cleanArticleContent(article.content?.substring(0, 800) || "");
            return `Title: ${article.title}\nContent: ${cleanText}...`;
          })
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
    // Use gemini-2.5-flash-preview (available for this API key)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

    // Get system prompt based on level and language
    const systemPrompt = getSystemPrompt(mode, language, context);

    // Detect if this is a food-related question
    const isFoodQuestion = /food|recipe|ingredient|cooking|eat|diet|vegetable|meal|dish|cuisine|restaurant|menu/i.test(message);
    
    // Add Jain food context if food-related
    const foodContext = isFoodQuestion ? `

SPECIAL INSTRUCTION FOR FOOD QUESTION:
The user is asking about food. You MUST provide Jain-compliant guidance:
- Suggest Jain-friendly alternatives if they mention non-Jain foods
- Explain why certain foods are avoided (Ahimsa principle)
- Offer practical Jain cooking tips and substitutions
- Be helpful and constructive, not judgmental
- Remember: Root vegetables (onion, garlic, potato, carrot, radish, beetroot) are avoided
- Suggest alternatives like asafoetida (hing) instead of onion/garlic
- Recommend above-ground vegetables, grains, lentils, dairy products
- Provide specific Jain-friendly recipe suggestions when appropriate
` : '';

    // Create the full prompt
    const fullPrompt = `${systemPrompt}${foodContext}

User's question: ${message}

Please provide a helpful, accurate response that matches the user's level of understanding and is entirely in ${languageMap[language] || 'English'} language.${action ? ' Keep your response concise (1-2 sentences) as the user will be directed to more detailed content via an action button.' : ''}`;

    // Generate response with retry logic for 503 errors
    let responseText: string = "";
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        // Try with gemini-2.5-flash-preview (available for this API key)
        const modelName = 'gemini-2.5-flash-preview-05-20';
        const currentModel = genAI.getGenerativeModel({ model: modelName });
        
        const result = await currentModel.generateContent(fullPrompt);
        const response = await result.response;
        const rawText = response.text();
              
              // Validate response
              if (!rawText || rawText.trim().length === 0) {
                throw new Error('Empty response from Gemini API');
              }
              
        // Clean the generated text to remove unwanted content
        responseText = cleanArticleContent(rawText);
        
        // Ensure we still have content after cleaning
        if (!responseText || responseText.trim().length === 0) {
          // If cleaning removed everything, use the raw text
          responseText = rawText.substring(0, 500).trim();
        }
        
        // Success - break out of retry loop
        break;
      } catch (error) {
        lastError = error as Error;
        const errorMessage = lastError.message.toLowerCase();
        
        // If it's a 503 error and we haven't exceeded retries, wait and retry
        if ((errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('service unavailable')) && retryCount < maxRetries) {
          retryCount++;
          console.log(`Gemini API 503 error, retrying (${retryCount}/${maxRetries}) with different model...`);
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue; // Retry with next model
        }
        
        // If it's not a retryable error or we've exceeded retries, throw
        throw error;
      }
    }
    
    // If we get here after retries and still no responseText, handle the error
    if (!responseText || responseText.trim().length === 0) {
      // All retries failed, throw error to be caught by outer catch
      throw lastError || new Error('Failed to generate response after retries');
    }

    // Ensure responseText is always defined and has content
    if (!responseText || responseText.trim().length === 0) {
      responseText = "I apologize, but I couldn't generate a complete response. Please try again.";
    }

    // Make response more concise if action button is available (but only for chat, not for section text generation)
    // Skip this truncation if the message indicates it's for a section (contains "comprehensive" or "detailed explanation")
    const isSectionGeneration = message && (
      message.includes('comprehensive') || 
      message.includes('detailed explanation') ||
      message.includes('educational and engaging')
    );
    
    if (action && !isSectionGeneration && responseText && responseText.length > 150) {
      const firstSentence = responseText.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 50 && firstSentence.length < 200) {
        responseText = firstSentence.trim() + '.';
      } else if (responseText.length > 150) {
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
    
    // Detect action even on error
    let action;
    try {
      action = message ? detectActionFromMessage(message) : undefined;
    } catch {
      action = undefined;
    }
    
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
      // Provide a helpful fallback response instead of just an error message
      const fallbackResponse = mode === "beginner" 
        ? "I'm here to help you learn about Jain philosophy! Based on your question about \"" + (message?.substring(0, 50) || "Jainism") + "\", here's some helpful information:\n\nJainism is one of the oldest religions in the world, emphasizing non-violence (Ahimsa), truth, non-stealing, celibacy, and non-attachment. The principles of Jainism teach us to live with compassion for all living beings.\n\nI'm currently experiencing high demand. For more detailed answers, please try again in a moment, or explore the Learn section of the app for comprehensive guides on Jain philosophy and practices."
        : "I'm currently experiencing high demand on the AI service. Please try again in a moment, or explore the Learn section for detailed information about Jain philosophy and practices.";
      
      return NextResponse.json({
        text: fallbackResponse,
        sources: ["Jainworld.com"],
        confidence: 60,
        action: action || undefined,
      }, { status: 200 }); // Return 200 so frontend doesn't treat it as an error
    }
    
    // Handle 503 Service Unavailable / Overloaded errors in outer catch
    if (errorString.includes('503') || errorString.includes('overloaded') || errorString.includes('service unavailable') || errorString.includes('try again later')) {
      return NextResponse.json({
        text: "I'm currently experiencing high traffic. The service is temporarily unavailable. Please try again in a moment.",
        sources: ["Jainworld.com"],
        confidence: 60,
        action: action || undefined,
      }, { status: 503 });
    }
    
    // Always return 200 with fallback response - don't return 500
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
