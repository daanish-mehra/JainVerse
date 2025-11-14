import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";

export async function GET(request: NextRequest) {
  try {
    const userId = "default-user";
    const container = await getContainer("userProgress");
    
    if (!container) {
      return NextResponse.json({
        punyaPoints: 0,
        level: 1,
        totalQuizzesCompleted: 0,
        totalStoriesRead: 0,
        learningPathsCompleted: 0,
        achievementsUnlocked: 0,
      });
    }
    
    const { resource: progress } = await container.item(userId, userId).read().catch(() => ({
      resource: null,
    }));
    
    if (!progress) {
      return NextResponse.json({
        punyaPoints: 0,
        level: 1,
        totalQuizzesCompleted: 0,
        totalStoriesRead: 0,
        learningPathsCompleted: 0,
        achievementsUnlocked: 0,
      });
    }
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json({
      punyaPoints: 0,
      level: 1,
      totalQuizzesCompleted: 0,
      totalStoriesRead: 0,
      learningPathsCompleted: 0,
      achievementsUnlocked: 0,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, quizId, pathId, storyId, points, achievementId } = body;
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
    
    if (action === "quiz-completed") {
      progress.totalQuizzesCompleted = (progress.totalQuizzesCompleted || 0) + 1;
      progress.punyaPoints = (progress.punyaPoints || 0) + (points || 10);
      if (!progress.quizHistory) progress.quizHistory = [];
      progress.quizHistory.push({ quizId, points, completedAt: new Date().toISOString() });
    }
    
    if (action === "path-progress" || action === "update-path-progress") {
      if (!progress.pathProgress) progress.pathProgress = {};
      progress.pathProgress[pathId] = Math.min((progress.pathProgress[pathId] || 0) + 10, 100);
      if (progress.pathProgress[pathId] >= 100) {
        progress.learningPathsCompleted = (progress.learningPathsCompleted || 0) + 1;
        progress.punyaPoints = (progress.punyaPoints || 0) + 50;
      }
    }
    
    if (action === "story-read") {
      progress.totalStoriesRead = (progress.totalStoriesRead || 0) + 1;
      progress.punyaPoints = (progress.punyaPoints || 0) + 5;
    }
    
    if (action === "achievement-unlocked") {
      progress.achievementsUnlocked = (progress.achievementsUnlocked || 0) + 1;
      if (!progress.achievements) progress.achievements = [];
      if (!progress.achievements.includes(achievementId)) {
        progress.achievements.push(achievementId);
      }
    }
    
    progress.level = Math.floor((progress.punyaPoints || 0) / 100) + 1;
    
    await container.items.upsert(progress);
    
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}

