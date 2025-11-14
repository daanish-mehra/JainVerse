import { NextRequest, NextResponse } from "next/server";
import { getArticles, getContainer } from "@/lib/cosmos";
import { getLearningPathsFromData } from "../../route";

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guideId = parseInt(id);
    const paths = await getLearningPathsFromData();
    const guide = paths.find((p: any) => p.id === guideId);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error("Error fetching guide:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guideId = parseInt(id);
    const body = await request.json();
    const { action, moduleId, sectionId } = body;
    const userId = "default-user"; // Hardcoded for now

    if (action !== "complete-module" && action !== "complete-section") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const moduleIdToUse = moduleId || sectionId;
    if (!moduleIdToUse) {
      return NextResponse.json({ error: "Module ID or Section ID is required" }, { status: 400 });
    }

    // Get or create user progress
    const container = await getContainer("userProgress");
    if (!container) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    let { resource: progress } = await container.item(userId, userId).read().catch(() => ({
      resource: null,
    }));

    if (!progress) {
      progress = {
        id: userId,
        punyaPoints: 0,
        level: 1,
        totalQuizzesCompleted: 0,
        totalStoriesRead: 0,
        learningPathsCompleted: 0,
        completedQuizzes: [],
        completedStories: [],
        completedLearningPaths: [],
        completedSections: {},
      };
    }

    // Initialize completedSections if it doesn't exist
    if (!progress.completedSections) {
      progress.completedSections = {};
    }

    // Create a unique key for this guide-section combination
    const sectionKey = `guide-${guideId}-section-${moduleIdToUse}`;
    
    // Check if this section is already completed
    if (!progress.completedSections[sectionKey]) {
      progress.completedSections[sectionKey] = true;
      
      // Award punya points for completing a section
      progress.punyaPoints = (progress.punyaPoints || 0) + 15;
      
      // Update guide progress
      const guideProgressKey = `guide-${guideId}`;
      if (!progress.completedSections[guideProgressKey]) {
        progress.completedSections[guideProgressKey] = {
          completedSections: [],
          totalSections: 0,
        };
      }
      
      // Get the guide to check total sections
      const paths = await getLearningPathsFromData();
      const guide = paths.find((p: any) => p.id === guideId);
      if (guide && guide.modules) {
        if (!progress.completedSections[guideProgressKey].totalSections) {
          progress.completedSections[guideProgressKey].totalSections = guide.modules.length;
        }
        
        const completedSectionsList = progress.completedSections[guideProgressKey].completedSections || [];
        if (!completedSectionsList.includes(moduleIdToUse)) {
          completedSectionsList.push(moduleIdToUse);
          progress.completedSections[guideProgressKey].completedSections = completedSectionsList;
          
          // Check if all sections are completed
          if (completedSectionsList.length >= guide.modules.length) {
            // Mark entire guide as completed
            if (!progress.completedLearningPaths || !progress.completedLearningPaths.includes(guideId)) {
              if (!progress.completedLearningPaths) {
                progress.completedLearningPaths = [];
              }
              progress.completedLearningPaths.push(guideId);
              progress.learningPathsCompleted = (progress.learningPathsCompleted || 0) + 1;
              progress.punyaPoints = (progress.punyaPoints || 0) + 50; // Bonus for completing entire guide
            }
          }
        }
      }
      
      // Simple level up logic
      if (progress.punyaPoints && progress.punyaPoints % 100 === 0) {
        progress.level = (progress.level || 1) + 1;
      }
    }

    // Save progress
    const { resource: updatedProgress } = await container.items.upsert(progress);
    
    return NextResponse.json({ 
      success: true, 
      progress: updatedProgress,
      message: `Section completed! +15 Punya Points!`,
    });
  } catch (error) {
    console.error("Error completing section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
