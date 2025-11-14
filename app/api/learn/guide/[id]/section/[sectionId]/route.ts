import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";
import { generateSummaryFromArticle, generateQuizFromArticle } from "@/lib/gemini";
import { getLearningPathsFromData } from "../../../../route";
import { cleanArticleContent } from "@/lib/content-cleaner";

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

    // Find the most relevant article for this module
    let relevantArticle = articles.find((a: any) => {
      const title = (a.title || "").toLowerCase();
      const moduleLower = moduleTitle.toLowerCase();
      return title.includes(moduleLower) || moduleLower.includes(title.substring(0, 20));
    });

    // If no direct match, use the first article or one that seems related
    if (!relevantArticle && articles.length > 0) {
      relevantArticle = articles[sectionId - 1] || articles[0];
    }

    // Try to get from Cosmos DB cache first
    const container = await getContainer("sections");
    if (container) {
      try {
        const sectionKey = `guide-${guideId}-section-${sectionId}`;
        const { resource: cachedSection } = await container.item(sectionKey, sectionKey).read().catch(() => ({
          resource: null,
        }));

        if (cachedSection && cachedSection.summary && cachedSection.quiz) {
          // Clean cached summary to ensure no unwanted content
          const cleanedSummary = cleanArticleContent(cachedSection.summary || "");
          const sectionData = {
            id: sectionId,
            title: moduleTitle,
            summary: cleanedSummary,
            quiz: cachedSection.quiz,
            completed: false,
          };
          sectionCache[cacheKey] = { data: sectionData, time: now };
          return sectionData;
        }
      } catch (error) {
        console.warn("Failed to fetch cached section:", error);
      }
    }

    // Generate summary and quiz from article - use faster fallbacks
    let summary = "";
    let quiz = null;

    if (relevantArticle && relevantArticle.content) {
      // Clean article content - remove unwanted elements
      let cleanedContent = cleanArticleContent(relevantArticle.content);
      
      // Use cleaned article content for faster loading, enhance later if needed
      const contentSnippet = cleanedContent.substring(0, 1000);
      summary = contentSnippet + (cleanedContent.length > 1000 ? "..." : "");
      
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

      // Generate enhanced quiz in background (non-blocking) for next time
      generateQuizFromArticle({
        title: relevantArticle.title || moduleTitle,
        content: cleanedContent.substring(0, 3000), // Limit for speed
      }).then(generatedQuiz => {
        if (generatedQuiz) {
          // Update cache for future requests
          if (container) {
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
        }
      }).catch(() => {}); // Silent fail
      
    } else {
      // Fallback summary
      summary = `This section covers ${moduleTitle}. Learn about the key concepts and principles related to this topic in Jain philosophy.`;
    }

    // Fallback quiz if generation failed - always provide one
    if (!quiz) {
      quiz = {
        question: `What is the main concept covered in "${moduleTitle}"?`,
        options: [
          "A key Jain principle",
          "A historical event",
          "A meditation technique",
          "A prayer or mantra",
        ],
        correct: 0,
        explanation: `This section covers important concepts related to ${moduleTitle} in Jain philosophy.`,
        source: moduleTitle,
      };
    }

    // Clean summary one more time before returning (safety measure)
    summary = cleanArticleContent(summary);
    
    const sectionData = {
      id: sectionId,
      title: moduleTitle,
      summary,
      quiz,
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
