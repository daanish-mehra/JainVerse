import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";
import { generateSummaryFromArticle, generateQuizFromArticle } from "@/lib/gemini";
import { getLearningPathsFromData } from "../../../../route";
import { cleanArticleContent } from "@/lib/content-cleaner";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const revalidate = 3600;

let sectionCache: { [key: string]: { data: any; time: number } } = {};
const CACHE_DURATION = 3600000; // 1 hour

async function getSectionData(guideId: number, sectionId: number) {
  const cacheKey = `${guideId}-${sectionId}`;
  const now = Date.now();
  
  if (sectionCache[cacheKey] && (now - sectionCache[cacheKey].time) < CACHE_DURATION) {
    return sectionCache[cacheKey].data;
  }

  try {
    const paths = await getLearningPathsFromData();
    const guide = paths.find((p: any) => p.id === guideId);

    if (!guide || !guide.modules || sectionId < 1 || sectionId > guide.modules.length) {
      return null;
    }

    const moduleTitle = guide.modules[sectionId - 1];
    const articles = guide.articles || [];

    // Extract important keywords from module title (remove common words)
    const moduleLower = moduleTitle.toLowerCase();
    const commonWords = ['who', 'was', 'what', 'is', 'the', 'a', 'an', 'to', 'and', 'or', 'but', 'for', 'of', 'with', 'about'];
    const moduleKeywords = moduleLower
      .split(/\s+/)
      .filter((w: string) => w.length > 2 && !commonWords.includes(w))
      .map((w: string) => w.replace(/[^\w]/g, '')); // Remove punctuation
    
    // Find the most relevant article for this module
    let relevantArticle = articles.find((a: any) => {
      const title = (a.title || "").toLowerCase();
      const content = (a.content || "").toLowerCase().substring(0, 2000); // Check first 2000 chars for speed
      
      // Exact match first
      if (title.includes(moduleLower) || moduleLower.includes(title.substring(0, 30))) {
        return true;
      }
      
      // Keyword matching - check if any important keyword appears
      return moduleKeywords.some((keyword: string) => 
        keyword.length > 3 && (
          title.includes(keyword) || 
          content.includes(keyword)
        )
      );
    });

    // If no match in guide articles, search ALL articles from Cosmos DB
    if (!relevantArticle || !relevantArticle.content || relevantArticle.content.length < 500) {
      try {
        const { getArticles } = await import("@/lib/cosmos");
        const allArticles = await getArticles(50); // Get more articles to search
        
        // Search all articles with better scoring
        const scoredArticles = allArticles
          .filter((a: any) => a.content && a.content.length > 500)
          .map((a: any) => {
            const title = (a.title || "").toLowerCase();
            const content = (a.content || "").toLowerCase().substring(0, 3000);
            let score = 0;
            
            // Exact title match gets highest score
            if (title.includes(moduleLower) || moduleLower.includes(title.substring(0, 30))) {
              score += 100;
            }
            
            // Keyword matching in title (higher weight)
            moduleKeywords.forEach((keyword: string) => {
              if (keyword.length > 3) {
                if (title.includes(keyword)) score += 20;
                if (content.includes(keyword)) score += 5;
              }
            });
            
            // Special handling for "Lord Mahavira" or "Mahavira" - boost score significantly
            if (moduleTitle.toLowerCase().includes('mahavira')) {
              if (title.includes('mahavira') || title.includes('tirthankara')) {
                score += 100; // Very high priority
              }
              if (content.includes('mahavira') || content.includes('vardhamana') || content.includes('24th')) {
                score += 50;
              }
            }
            
            // Length bonus (more content = better)
            if (a.content.length > 1000) score += 5;
            
            return { article: a, score };
          })
          .filter((item: any) => item.score > 0)
          .sort((a: any, b: any) => b.score - a.score);
        
        if (scoredArticles.length > 0 && scoredArticles[0].score > 10) {
          relevantArticle = scoredArticles[0].article;
        }
      } catch (error) {
        console.warn("Failed to search all articles:", error);
      }
    }
    
    // If still no match for Mahavira, do a direct search with more articles
    if ((!relevantArticle || !relevantArticle.content || relevantArticle.content.length < 500) && 
        moduleTitle.toLowerCase().includes('mahavira')) {
      try {
        const { getArticles } = await import("@/lib/cosmos");
        const allArticles = await getArticles(100); // Get even more articles
        
        // Direct search for Mahavira articles
        const mahaviraArticles = allArticles
          .filter((a: any) => {
            const title = (a.title || "").toLowerCase();
            const content = (a.content || "").toLowerCase().substring(0, 5000);
            return (title.includes('mahavira') || 
                   title.includes('tirthankara') ||
                   title.includes('vardhamana') ||
                   content.includes('mahavira') ||
                   content.includes('24th tirthankara')) && 
                   a.content && a.content.length > 800;
          })
          .sort((a: any, b: any) => {
            // Prefer articles with Mahavira in title
            const aTitle = (a.title || "").toLowerCase();
            const bTitle = (b.title || "").toLowerCase();
            if (aTitle.includes('mahavira') && !bTitle.includes('mahavira')) return -1;
            if (!aTitle.includes('mahavira') && bTitle.includes('mahavira')) return 1;
            // Then by content length (more content = better)
            return b.content.length - a.content.length;
          });
        
        if (mahaviraArticles.length > 0) {
          relevantArticle = mahaviraArticles[0];
        }
      } catch (error) {
        console.warn("Failed to search for Mahavira articles:", error);
      }
    }

    // If still no match, try to find articles with substantial content from guide
    if ((!relevantArticle || !relevantArticle.content || relevantArticle.content.length < 500) && articles.length > 0) {
      const articlesWithContent = articles
        .filter((a: any) => a.content && a.content.length > 500)
        .map((a: any) => ({
          article: a,
          score: (a.title?.toLowerCase().includes(moduleTitle.toLowerCase().substring(0, 10)) ? 2 : 0) +
                 (a.content?.toLowerCase().includes(moduleTitle.toLowerCase().substring(0, 10)) ? 1 : 0)
        }))
        .sort((a: any, b: any) => b.score - a.score);
      
      if (articlesWithContent.length > 0) {
        relevantArticle = articlesWithContent[0].article;
      } else {
        relevantArticle = articles[sectionId - 1] || articles[0];
      }
    }

    // Skip cache check for now - always generate fresh content with Gemini
    // TODO: Re-enable cache after ensuring all cached content is high-quality
    const container = await getContainer("sections");

    // Always use Gemini to generate content about the topic
    let summary = "";
    let quiz: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
      source: string;
    } | null = null;

    // Use Gemini to generate content about the section topic
    let geminiAttempts = 0;
    const maxAttempts = 2;
    
    while (geminiAttempts < maxAttempts && (!summary || summary.length < 100)) {
      try {
        geminiAttempts++;
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          
          const prompt = `You are writing a detailed, engaging explanation about "${moduleTitle}" in Jainism. This must be UNIQUE and SPECIFIC to this exact topic - do NOT use generic phrases like "is an important aspect" or "explores fundamental concepts."

REQUIREMENTS:
- Write 300-400 words of UNIQUE content specifically about "${moduleTitle}"
- Start with a specific fact, example, or interesting detail about "${moduleTitle}" - NOT a generic introduction
- Explain what "${moduleTitle}" actually means in Jain philosophy, with specific teachings and principles
- Include concrete examples, historical context, or practical applications unique to this topic
- Write in clear, engaging paragraphs that feel authentic and informative
- Do NOT use template phrases like "This section explores..." or "is an important aspect of Jain philosophy"
- Do NOT include questions, quizzes, numbered lists, contact info, addresses, emails, or URLs
- Do NOT mention "Jainworld is a non-profit organization" or organizational information

WRITE SPECIFIC CONTENT ABOUT: "${moduleTitle}"

Begin your response directly with content about "${moduleTitle}" - no generic introductions.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let generatedText = response.text();
        
        // Clean the generated text
        generatedText = cleanArticleContent(generatedText);
        
        if (generatedText && generatedText.trim().length > 50) {
          // Check if it contains generic template phrases - if so, regenerate
          const hasGenericPhrases = /is an important aspect|This section explores|fundamental concepts, teachings, and practices|helping you gain a deeper understanding|is a fundamental aspect|This section provides comprehensive information/i.test(generatedText);
          
          if (hasGenericPhrases && geminiAttempts < maxAttempts) {
            console.log(`Detected generic phrases in "${moduleTitle}", retrying (attempt ${geminiAttempts}/${maxAttempts})...`);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue; // Try again with a more specific prompt
          }
          
          // Use more of the generated text (250-350 words for longer descriptions)
          const words = generatedText.trim().split(/\s+/);
          // Target 250-350 words (comprehensive reading)
          const targetWords = Math.min(350, Math.max(250, words.length));
          const limitedWords = words.slice(0, targetWords);
          summary = limitedWords.join(' ').trim();
          
          // Ensure we end on a complete sentence
          if (!summary.match(/[.!?]$/)) {
            // Find the last complete sentence
            const sentences = summary.split(/[.!?]/).filter(s => s.trim());
            if (sentences.length > 0) {
              // Take all sentences except the incomplete last one
              summary = sentences.slice(0, -1).join('. ').trim();
              if (summary.length > 0 && !summary.endsWith('.')) {
                summary += '.';
              }
            }
          }
          
          // Final check: ensure we have at least 250 words if available
          const finalWordCount = summary.split(/\s+/).length;
          if (finalWordCount < 250 && words.length > 250) {
            // If we cut too much, add back more (up to 350 words)
            const additionalWords = words.slice(limitedWords.length, 350 - limitedWords.length);
            summary = summary + ' ' + additionalWords.join(' ').trim();
            // Re-trim to ensure sentence ending
            if (!summary.match(/[.!?]$/)) {
              const allSentences = summary.split(/[.!?]/).filter(s => s.trim());
              if (allSentences.length > 0) {
                summary = allSentences.slice(0, -1).join('. ').trim();
                if (summary.length > 0 && !summary.endsWith('.')) {
                  summary += '.';
                }
              }
            }
          }
          
          // Generate 2 quizzes from the generated content
          try {
            // Use the full generated text for quiz generation (not just the summary)
            const quizPromises = [
              generateQuizFromArticle({
                title: moduleTitle,
                content: generatedText, // Use full generated text for better quiz quality
              }),
              generateQuizFromArticle({
                title: moduleTitle,
                content: generatedText, // Generate second quiz
              }),
            ];
            
            // Wait max 10 seconds for quiz generation (give it more time for 2 quizzes)
            const quizTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Quiz generation timeout')), 10000)
            );
            
            const quizResults = await Promise.allSettled(
              quizPromises.map(quizPromise => Promise.race([quizPromise, quizTimeout]))
            );
            
            const validQuizzes: any[] = [];
            for (const result of quizResults) {
              if (result.status === 'fulfilled' && result.value) {
                const generatedQuiz = result.value as any;
                if (generatedQuiz && generatedQuiz.question && generatedQuiz.options && generatedQuiz.options.length === 4) {
                  validQuizzes.push(generatedQuiz);
                }
              }
            }
            
            // If we got at least one valid quiz, use them (prefer 2, but accept 1)
            if (validQuizzes.length > 0) {
              // Store quizzes as array - we'll handle this in the response
              quiz = (validQuizzes.length === 2 ? validQuizzes : [validQuizzes[0]]) as any;
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            // Don't log timeout errors as warnings (they're expected sometimes)
            if (!errorMsg.includes('timeout') && !errorMsg.includes('503')) {
              console.warn("Quiz generation from Gemini content failed:", errorMsg);
            }
            // Will continue with fallback quiz below
          }
          } else {
            // If generated text is too short, try again or use fallback
            if (geminiAttempts < maxAttempts) {
              continue; // Try again
            } else {
              // Final fallback if all attempts failed
              summary = `${moduleTitle} is an important aspect of Jain philosophy. This section explores the fundamental concepts, teachings, and practices related to ${moduleTitle}, helping you gain a deeper understanding of this essential topic in the Jain tradition.`;
            }
          }
        } else {
          // No API key - use fallback
          if (geminiAttempts >= maxAttempts) {
            summary = `${moduleTitle} is an important aspect of Jain philosophy. This section explores the fundamental concepts, teachings, and practices related to ${moduleTitle}, helping you gain a deeper understanding of this essential topic in the Jain tradition.`;
            break;
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // Don't log 503 errors as warnings if we'll retry
        if (geminiAttempts >= maxAttempts || !errorMsg.includes('503') && !errorMsg.includes('overloaded')) {
          console.warn(`Failed to generate content with Gemini (attempt ${geminiAttempts}):`, errorMsg);
        }
        
        // If it's a 503 error and we haven't maxed out attempts, wait a bit and retry
        if (errorMsg.includes('503') || errorMsg.includes('overloaded')) {
          if (geminiAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }
        }
        
        // Final fallback on error after all attempts
        if (geminiAttempts >= maxAttempts) {
          summary = `${moduleTitle} is an important aspect of Jain philosophy. This section explores the fundamental concepts, teachings, and practices related to ${moduleTitle}, helping you gain a deeper understanding of this essential topic in the Jain tradition.`;
        }
      }
    }

    // Keep article-based approach as backup (but we'll prioritize Gemini above)
    if (false && relevantArticle && relevantArticle.content) {
      // Clean article content - remove unwanted elements
      let cleanedContent = cleanArticleContent(relevantArticle.content);
      
      // Ensure we have substantial content (at least 500 chars) before using it
      if (cleanedContent && cleanedContent.trim().length > 500) {
        // Use cleaned article content for faster loading - increased snippet size for better initial display
        // Take a larger chunk (first 2500 chars) to ensure meaningful content
        const contentSnippet = cleanedContent.substring(0, 2500);
        // Only add ellipsis if there's significantly more content
        summary = cleanedContent.length > 2500 ? contentSnippet + "..." : cleanedContent;
        
        // Ensure summary is meaningful (at least 200 chars)
        if (summary.length < 200 && cleanedContent.length > 200) {
          summary = cleanedContent.substring(0, Math.min(2500, cleanedContent.length));
        }
      } else {
        // If content is too short, use a better fallback
        summary = `${moduleTitle} is an important topic in Jain philosophy. This section explores the key concepts, principles, and teachings related to ${moduleTitle}, providing a comprehensive understanding of its significance in Jain tradition.`;
      }
      
      // Generate quiz immediately if we have content (but with timeout)
      try {
        const quizPromise = generateQuizFromArticle({
          title: relevantArticle.title || moduleTitle,
          content: cleanedContent.substring(0, 2000), // Reduced from 3000 for speed
        });
        
        // Wait max 3 seconds for quiz generation
        const quizTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Quiz generation timeout')), 3000)
        );
        
        const generatedQuiz = await Promise.race([quizPromise, quizTimeout]) as any;
        if (generatedQuiz) {
          quiz = generatedQuiz;
        }
      } catch (error) {
        console.warn("Quiz generation failed or timed out:", error);
        // Continue with fallback quiz
      }
      
      // Generate enhanced summary in background (non-blocking) for next time
      generateSummaryFromArticle({
        title: relevantArticle.title || moduleTitle,
        content: cleanedContent,
      }).then(generatedSummary => {
        if (generatedSummary && generatedSummary.length > 100) {
          // Update cache for future requests
          if (container) {
            const sectionKey = `guide-${guideId}-section-${sectionId}`;
            container.items.upsert({
              id: sectionKey,
              guideId,
              sectionId,
              title: moduleTitle,
              summary: generatedSummary,
              quiz: quiz,
              updatedAt: new Date().toISOString(),
            }).catch(() => {});
          }
        }
      }).catch(() => {}); // Silent fail

      // Update quiz in background if we generated one
      if (quiz) {
        generateQuizFromArticle({
          title: relevantArticle.title || moduleTitle,
          content: cleanedContent.substring(0, 2000),
        }).then(generatedQuiz => {
          if (generatedQuiz && container) {
            const sectionKey = `guide-${guideId}-section-${sectionId}`;
            container.items.upsert({
              id: sectionKey,
              guideId,
              sectionId,
              title: moduleTitle,
              summary: summary,
              quiz: generatedQuiz,
              updatedAt: new Date().toISOString(),
            }).catch(() => {});
          }
        }).catch(() => {}); // Silent fail
      }
      
    } else {
      // No article found - use Gemini to generate content about the topic
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          
          const prompt = `Provide a clear, concise explanation about "${moduleTitle}" in Jainism (200-300 words).

IMPORTANT GUIDELINES:
- Write only educational content about the topic
- Do NOT include questions, quizzes, or numbered lists
- Do NOT include contact information, addresses, emails, or URLs
- Do NOT include "Jainworld is a non-profit organization" or similar organizational information
- Write in clear, flowing paragraphs
- Focus on explaining the concepts, teachings, and significance
- Be accurate and respectful of Jain traditions

Topic: ${moduleTitle}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let generatedText = response.text();
          
          // Clean the generated text
          generatedText = cleanArticleContent(generatedText);
          
          if (generatedText && generatedText.trim().length > 100) {
            summary = generatedText.trim().substring(0, 2500); // Limit length
            
            // Try to generate quiz from the generated content
            try {
              const quizPromise = generateQuizFromArticle({
                title: moduleTitle,
                content: generatedText,
              });
              
              // Wait max 3 seconds for quiz generation
              const quizTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Quiz generation timeout')), 3000)
              );
              
              const generatedQuiz = await Promise.race([quizPromise, quizTimeout]) as any;
              if (generatedQuiz) {
                quiz = generatedQuiz;
              }
            } catch (error) {
              console.warn("Quiz generation from Gemini content failed:", error);
              // Continue with fallback quiz
            }
          } else {
            // If generated text is too short and we've exhausted retries, use article content if available
            if (relevantArticle && relevantArticle.content && relevantArticle.content.length > 500) {
              const cleanedContent = cleanArticleContent(relevantArticle.content);
              const words = cleanedContent.trim().split(/\s+/);
              if (words.length >= 200) {
                const articleText = words.slice(0, 300).join(' ').trim();
                const sentences = articleText.split(/[.!?]/).filter(s => s.trim());
                if (sentences.length > 0) {
                  summary = sentences.slice(0, -1).join('. ').trim() + '.';
                  if (summary.length < 100) {
                    summary = articleText.substring(0, 1000).trim();
                  }
                } else {
                  summary = articleText.substring(0, 1000).trim();
                }
              }
            }
            // Only use generic fallback if no article content available
            if (!summary || summary.length < 100) {
              summary = `Discover the teachings and significance of ${moduleTitle} in Jain philosophy.`;
            }
          }
        } else {
        // No API key - use minimal fallback (shouldn't happen in production)
        summary = `Content generation is currently unavailable. Please try again later.`;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // Don't use generic fallback - try to use article content or indicate error
        if (!errorMsg.includes('503') && !errorMsg.includes('overloaded')) {
          console.warn("Failed to generate content with Gemini:", errorMsg);
        }
        // Try to use relevant article content if available instead of generic fallback
        if (relevantArticle && relevantArticle.content && relevantArticle.content.length > 500) {
          const cleanedContent = cleanArticleContent(relevantArticle.content);
          const words = cleanedContent.trim().split(/\s+/);
          if (words.length >= 200) {
            // Use first 250-300 words from article
            const articleText = words.slice(0, 300).join(' ').trim();
            // Ensure sentence ending
            const sentences = articleText.split(/[.!?]/).filter(s => s.trim());
            if (sentences.length > 0) {
              summary = sentences.slice(0, -1).join('. ').trim() + '.';
              if (summary.length < 100) {
                summary = articleText.substring(0, 1000).replace(/\s+$/, '') + '...';
              }
            } else {
              summary = articleText.substring(0, 1000);
            }
          }
        }
        // Only use generic fallback as absolute last resort
        if (!summary || summary.length < 100) {
          summary = `Learn about ${moduleTitle} in Jain philosophy. This topic covers important teachings and practices that are central to understanding Jainism.`;
        }
      }
    }

    // Handle quiz format - normalize to array if needed
    let quizzesArray: any[] = [];
    if (Array.isArray(quiz)) {
      quizzesArray = quiz;
    } else if (quiz && typeof quiz === 'object' && quiz.question) {
      quizzesArray = [quiz];
    }
    
    // Fallback: Generate 2 quizzes if we don't have enough
    if (quizzesArray.length < 2) {
      // Try to generate more quizzes
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && summary && summary.length > 100) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          
          const remainingQuizzes = 2 - quizzesArray.length;
          const quizPromises = [];
          
          for (let i = 0; i < remainingQuizzes; i++) {
            const quizPrompt = `Create a quiz question about "${moduleTitle}" in Jainism with exactly 4 multiple choice options and one correct answer.

Topic: ${moduleTitle}
Content: ${summary.substring(0, 2000)}

IMPORTANT: Make this question DIFFERENT from any previous questions. Focus on a different aspect of the topic.

Return ONLY valid JSON, no markdown, no code blocks:
{
  "question": "A different quiz question about ${moduleTitle}",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0,
  "explanation": "Brief explanation of the correct answer",
  "source": "${moduleTitle}"
}`;

            quizPromises.push(
              model.generateContent(quizPrompt).then(result => {
                const response = result.response;
                const text = response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const generatedQuiz = JSON.parse(jsonMatch[0]);
                  if (generatedQuiz.question && Array.isArray(generatedQuiz.options) && 
                      generatedQuiz.options.length === 4 && 
                      typeof generatedQuiz.correct === 'number' && 
                      generatedQuiz.correct >= 0 && generatedQuiz.correct < 4) {
                    return generatedQuiz;
                  }
                }
                return null;
              }).catch(() => null)
            );
          }
          
          const additionalQuizzes = await Promise.all(quizPromises);
          const validQuizzes = additionalQuizzes.filter(q => q !== null);
          quizzesArray = [...quizzesArray, ...validQuizzes];
        }
      } catch (error) {
        console.warn("Additional quiz generation failed:", error);
      }
    }
    
    // Final fallback: Ensure we have at least 2 quizzes
    while (quizzesArray.length < 2) {
      quizzesArray.push({
        question: `What is a key aspect of "${moduleTitle}" in Jainism?`,
        options: [
          "A fundamental Jain principle",
          "A historical event or figure",
          "A meditation or practice technique",
          "A prayer, mantra, or ritual",
        ],
        correct: quizzesArray.length % 2, // Alternate correct answer
        explanation: `This section covers important concepts related to ${moduleTitle} in Jain philosophy.`,
        source: moduleTitle,
      });
    }
    
    // Limit to 2 quizzes and ensure proper format
    quiz = quizzesArray.slice(0, 2) as any;

    // Clean summary one more time before returning (safety measure)
    // But preserve fallback summaries that don't come from articles
    const isFallbackSummary = summary.includes("is an important") || summary.includes("This section explores");
    if (!isFallbackSummary) {
      summary = cleanArticleContent(summary);
    }
    
    // CRITICAL: Ensure summary is never empty - always have content
    // But avoid generic fallbacks if possible
    if (!summary || summary.trim().length < 50) {
      // Try to extract from article if available
      if (relevantArticle && relevantArticle.content && relevantArticle.content.length > 200) {
        const cleaned = cleanArticleContent(relevantArticle.content);
        const excerpt = cleaned.substring(0, 500).trim();
        if (excerpt.length >= 100) {
          summary = excerpt;
        } else {
          summary = `Discover the teachings and significance of ${moduleTitle} in Jain philosophy.`;
        }
      } else {
        summary = `Discover the teachings and significance of ${moduleTitle} in Jain philosophy.`;
      }
    }
    
    // Remove any remaining generic template phrases
    summary = summary.replace(/This section explores the fundamental concepts, teachings, and practices related to/g, '');
    summary = summary.replace(/is an important aspect of Jain philosophy\.?/gi, '');
    summary = summary.replace(/helping you gain a deeper understanding of this essential topic in the Jain tradition\.?/gi, '');
    summary = summary.replace(/is a fundamental aspect of Jain philosophy\.?/gi, '');
    summary = summary.trim();
    
    // quizzesArray is already defined above, just ensure it has the final quiz value
    // quiz is already set to quizzesArray.slice(0, 2) above, so use that
    const finalQuizzesArray = Array.isArray(quiz) ? quiz : [quiz];
    
    const sectionData = {
      id: sectionId,
      title: moduleTitle,
      summary: summary.trim(),
      quiz: finalQuizzesArray.length === 1 ? finalQuizzesArray[0] : finalQuizzesArray, // Return array if multiple quizzes
      quizzes: finalQuizzesArray, // Also include as quizzes array for easier access
      completed: false,
    };

    // Cache in Cosmos DB
    if (container) {
      try {
        const sectionKey = `guide-${guideId}-section-${sectionId}`;
        await container.items.upsert({
          id: sectionKey,
          guideId,
          sectionId,
          title: moduleTitle,
          summary: cleanArticleContent(summary), // Clean before caching
          quiz,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      } catch (error) {
        console.warn("Failed to cache section:", error);
      }
    }

    sectionCache[cacheKey] = { data: sectionData, time: now };
    return sectionData;
  } catch (error) {
    console.error("Error generating section data:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { id, sectionId: sectionIdParam } = await params;
    const guideId = parseInt(id);
    const sectionId = parseInt(sectionIdParam);

    if (isNaN(guideId) || isNaN(sectionId)) {
      return NextResponse.json(
        { error: "Invalid guide or section ID" },
        { status: 400 }
      );
    }

    const section = await getSectionData(guideId, sectionId);

    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(section, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
