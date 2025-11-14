import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/azure-openai';
import { getArticles } from '@/lib/cosmos';

export async function POST(req: NextRequest) {
  try {
    const { message, language = "EN", mode = "beginner" } = await req.json();
    
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

    // Generate AI response with context
    const { text, sources } = await generateChatResponse(
      [{ role: "user", content: message }],
      context
    );

    const confidence = sources && sources.length > 0 ? 95 : 80;
    
    return NextResponse.json({
      text,
      sources: sources.length > 0 ? sources : ["Jainworld.com"],
      confidence,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    const fallbackResponse = mode === "beginner" 
      ? "I'm here to help you learn about Jain philosophy! Try asking about:\n\n• What is Ahimsa?\n• Tell me about Mahavira\n• What is Jainism?\n• Explain Tirthankaras\n• What is Karma in Jainism?\n• How to achieve Moksha?\n• What are Vratas?\n• Jain meditation practices"
      : "I apologize, but I'm having trouble connecting to the AI service right now. Please check your Azure OpenAI configuration and try again.";
    
    return NextResponse.json({
      text: fallbackResponse,
      sources: [],
      confidence: 60,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
