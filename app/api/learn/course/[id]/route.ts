import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";

import fs from "fs";
import path from "path";
import { getArticles } from "@/lib/cosmos";

async function getLearningPathsFromData() {
  try {
    let articles: any[] = [];
    
    try {
      articles = await getArticles(100);
    } catch (error) {
      const articlesPath = path.join(process.cwd(), "data", "articles.json");
      if (fs.existsSync(articlesPath)) {
        const fileContent = fs.readFileSync(articlesPath, "utf-8");
        articles = JSON.parse(fileContent);
      }
    }

    const paths: any[] = [];
    const pathCategories: { [key: string]: any[] } = {
      "Philosophy": [],
      "History": [],
      "Principles": [],
      "Practices": [],
      "Scriptures": [],
      "Mantras": [],
    };

    articles.forEach((article) => {
      const title = article.title?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      const url = article.url?.toLowerCase() || "";

      if (title.includes("philosophy") || content.includes("philosophy") || url.includes("philosophy")) {
        pathCategories["Philosophy"].push(article);
      } else if (title.includes("history") || url.includes("history")) {
        pathCategories["History"].push(article);
      } else if (title.includes("principle") || url.includes("principle")) {
        pathCategories["Principles"].push(article);
      } else if (title.includes("practice") || title.includes("meditation") || title.includes("yoga") ||
                 content.includes("meditation") || content.includes("dhyan") || content.includes("samayik") ||
                 content.includes("pratikraman") || content.includes("fasting") || content.includes("tapa")) {
        pathCategories["Practices"].push(article);
      } else if (title.includes("scripture") || title.includes("tattvarth") || title.includes("samayasar") ||
                 content.includes("acharya kundkund") || content.includes("sutra")) {
        pathCategories["Scriptures"].push(article);
      } else if (title.includes("mantra") || title.includes("namokar") || title.includes("prayer") ||
                 content.includes("namokar") || content.includes("mantra")) {
        pathCategories["Mantras"].push(article);
      }
    });

    let pathId = 1;
    
    if (pathCategories["Principles"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Principles & Fundamentals",
        progress: 80,
        badges: 3,
        totalBadges: 5,
        level: "Beginner",
        description: "Learn the core principles of Jainism including Ahimsa, Anekantvad, and Aparigraha",
        articles: pathCategories["Principles"].slice(0, 10),
        modules: [
          "Introduction to Jain Principles",
          "Who was Lord Mahavira",
          "Main Principles of Jainism",
          "Living with Others",
          "The Soul and Liberation"
        ],
      });
    }

    if (pathCategories["Philosophy"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Jain Philosophy & Conduct",
        progress: 60,
        badges: 2,
        totalBadges: 6,
        level: "Intermediate",
        description: "Deep dive into Jain philosophy, conduct (Charitra), and ethical principles",
        articles: pathCategories["Philosophy"].slice(0, 15),
        modules: [
          "Conduct (Charitra)",
          "Householder's Conduct (Shrawak Dharma)",
          "Monkshood (Sadhu Dharma)",
          "Spiritual Progress",
          "God (Tirthankars)",
          "Death and Life after Death"
        ]
      });
    }

    if (pathCategories["Practices"].length > 0) {
      paths.push({
        id: pathId++,
        title: "Meditation & Daily Practices",
        progress: 50,
        badges: 2,
        totalBadges: 7,
        level: "Intermediate",
        description: "Learn meditation techniques, daily rituals, and spiritual practices",
        articles: pathCategories["Practices"].slice(0, 12),
        modules: [
          "Introduction to Meditation (Dhyan)",
          "Fasting (Tapa)",
          "Worship/Prayer (Pooja/Prarthna)",
          "Pratikraman",
          "Spiritual Death (Sanlekhana)",
          "Yoga Practices",
          "Daily Routines"
        ]
      });
    }

    return paths.length > 0 ? paths : [];
  } catch (error) {
    console.error("Error creating learning paths:", error);
    return [];
  }
}

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

    const totalArticles = course.articles?.length || 0;
    const articlesPerModule = Math.max(2, Math.ceil(totalArticles / (course.modules?.length || 1)));
    
    const modulesWithProgress = (course.modules || []).map((moduleTitle: string, index: number) => {
      const moduleArticles = course.articles?.slice(index * articlesPerModule, (index + 1) * articlesPerModule) || [];
      const moduleCompletedArticles = moduleArticles.filter((article: any) =>
        courseProgress.completedArticles?.includes(article.id || article.title)
      );
      
      return {
        id: index,
        title: moduleTitle,
        articles: moduleArticles.map((article: any) => ({
          ...article,
          id: article.id || article.title || `article-${index}-${article.url}`,
          completed: courseProgress.completedArticles?.includes(article.id || article.title) || false,
        })),
        completed: courseProgress.completedModules?.includes(index) || false,
        progress: moduleCompletedArticles.length,
        totalArticles: moduleArticles.length,
      };
    });

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
        
        const paths = await getLearningPathsFromData();
        const course = paths.find((p) => p.id === courseId);
        if (course) {
          const totalModules = course.modules?.length || 0;
          const articlesPerModule = Math.max(2, Math.ceil((course.articles?.length || 0) / totalModules));
          
          if (moduleId !== undefined) {
            const moduleArticles = course.articles?.slice(
              moduleId * articlesPerModule,
              (moduleId + 1) * articlesPerModule
            ) || [];
            
            const moduleCompletedCount = moduleArticles.filter((a: any) =>
              courseProgress.completedArticles?.includes(a.id || a.title)
            ).length;
            
            if (moduleCompletedCount >= moduleArticles.length && !courseProgress.completedModules?.includes(moduleId)) {
              courseProgress.completedModules.push(moduleId);
              progress.punyaPoints = (progress.punyaPoints || 0) + 15;
            }
          }
        }
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

