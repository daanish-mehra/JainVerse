import { NextRequest, NextResponse } from "next/server";
import { getLearningPathsFromData } from "../../route";
import { getContainer } from "@/lib/cosmos";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id);
    const paths = await getLearningPathsFromData();
    const course = paths.find((p) => p.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const userId = "default-user";
    const container = await getContainer("userProgress");
    
    let courseProgress = {
      currentModule: 0,
      completedModules: [],
      completedArticles: [],
      progress: 0,
    };

    if (container) {
      try {
        const { resource: progress } = await container.item(userId, userId).read().catch(() => ({
          resource: null,
        }));

        if (progress && progress.pathProgress && progress.pathProgress[courseId]) {
          courseProgress = progress.pathProgress[courseId];
        }
      } catch (error) {
        console.warn("Failed to fetch course progress:", error);
      }
    }

    const modulesWithProgress = (course.modules || []).map((moduleTitle: string, index: number) => ({
      id: index,
      title: moduleTitle,
      articles: course.articles?.slice(index * 2, (index + 1) * 2) || [],
      completed: courseProgress.completedModules?.includes(index) || false,
      progress: courseProgress.completedArticles?.filter((aid: string) => 
        course.articles?.find((a: any) => a.id === aid)
      ).length || 0,
      totalArticles: (course.articles?.slice(index * 2, (index + 1) * 2) || []).length,
    }));

    const overallProgress = courseProgress.completedModules?.length || 0;
    const totalModules = modulesWithProgress.length;
    const progressPercent = totalModules > 0 ? Math.round((overallProgress / totalModules) * 100) : 0;

    return NextResponse.json({
      ...course,
      modules: modulesWithProgress,
      progress: progressPercent,
      currentModule: courseProgress.currentModule || 0,
      completedModules: courseProgress.completedModules || [],
    });
  } catch (error) {
    console.error("Course API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id);
    const body = await request.json();
    const { action, moduleId, articleId } = body;

    const userId = "default-user";
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
        achievementsUnlocked: 0,
        quizHistory: [],
        pathProgress: {},
        achievements: [],
      };
    }

    if (!progress.pathProgress) progress.pathProgress = {};
    if (!progress.pathProgress[courseId]) {
      progress.pathProgress[courseId] = {
        currentModule: 0,
        completedModules: [],
        completedArticles: [],
        progress: 0,
      };
    }

    const courseProgress = progress.pathProgress[courseId];

    if (action === "complete-article" && articleId) {
      if (!courseProgress.completedArticles) {
        courseProgress.completedArticles = [];
      }
      if (!courseProgress.completedArticles.includes(articleId)) {
        courseProgress.completedArticles.push(articleId);
        progress.punyaPoints = (progress.punyaPoints || 0) + 5;
      }
    }

    if (action === "complete-module" && moduleId !== undefined) {
      if (!courseProgress.completedModules) {
        courseProgress.completedModules = [];
      }
      if (!courseProgress.completedModules.includes(moduleId)) {
        courseProgress.completedModules.push(moduleId);
        progress.punyaPoints = (progress.punyaPoints || 0) + 20;
        
        const paths = await getLearningPathsFromData();
        const course = paths.find((p) => p.id === courseId);
        if (course) {
          const totalModules = course.modules?.length || 0;
          if (courseProgress.completedModules.length >= totalModules) {
            progress.learningPathsCompleted = (progress.learningPathsCompleted || 0) + 1;
            progress.punyaPoints = (progress.punyaPoints || 0) + 100;
          }
        }
      }
      courseProgress.currentModule = Math.max(courseProgress.currentModule || 0, moduleId + 1);
    }

    progress.level = Math.floor((progress.punyaPoints || 0) / 100) + 1;
    await container.items.upsert(progress);

    return NextResponse.json({ success: true, progress: courseProgress });
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

