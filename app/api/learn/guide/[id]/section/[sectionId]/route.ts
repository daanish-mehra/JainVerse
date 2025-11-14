import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmos";
import { summarizeArticle, generateQuizFromArticle } from "@/lib/azure-openai";
import { cleanArticleContent } from "@/lib/content-cleaner";

async function getLearningPathsFromData() {
  try {
    const { getArticles } = await import("@/lib/cosmos");
    let articles: any[] = [];
    
    try {
      articles = await getArticles(100);
    } catch (error) {
      const fs = await import("fs");
      const path = await import("path");
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
        articles: pathCategories["Principles"].slice(0, 10),
        sections: [
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
        articles: pathCategories["Philosophy"].slice(0, 15),
        sections: [
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
        articles: pathCategories["Practices"].slice(0, 12),
        sections: [
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

    return paths;
  } catch (error) {
    console.error("Error creating learning paths:", error);
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { id, sectionId } = await params;
    const guideId = parseInt(id);
    const sectionIndex = parseInt(sectionId);

    const paths = await getLearningPathsFromData();
    const guide = paths.find((p) => p.id === guideId);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const sectionTitle = guide.sections?.[sectionIndex];
    if (!sectionTitle) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const totalArticles = guide.articles?.length || 0;
    const articlesPerSection = Math.max(2, Math.ceil(totalArticles / (guide.sections?.length || 1)));
    const sectionArticles = guide.articles?.slice(
      sectionIndex * articlesPerSection,
      (sectionIndex + 1) * articlesPerSection
    ) || [];

    const combinedContent = sectionArticles
      .map((article: any) => {
        let cleaned = cleanArticleContent(article.content || "");
        if (!cleaned || cleaned.length < 50) {
          cleaned = article.content || "";
        }
        return cleaned;
      })
      .filter((content: string) => content.length > 50)
      .join("\n\n");

    let summary = "";
    let quiz = null;

    try {
      summary = await summarizeArticle({
        title: sectionTitle,
        content: combinedContent.substring(0, 3000),
      });

      quiz = await generateQuizFromArticle({
        title: sectionTitle,
        content: combinedContent.substring(0, 3000),
      });
    } catch (error) {
      console.warn("Failed to generate summary/quiz with AI, using fallback:", error);
      summary = combinedContent.substring(0, 500) + "...";
    }

    const userId = "default-user";
    const container = await getContainer("userProgress");
    let completed = false;

    if (container) {
      try {
        const { resource: progress } = await container.item(userId, userId).read().catch(() => ({
          resource: null,
        }));

        if (progress?.pathProgress?.[guideId]?.completedSections?.includes(sectionIndex)) {
          completed = true;
        }
      } catch (error) {
        console.warn("Failed to check section completion:", error);
      }
    }

    return NextResponse.json({
      id: sectionIndex,
      title: sectionTitle,
      summary,
      quiz,
      completed,
      articles: sectionArticles.map((a: any) => ({
        id: a.id || a.title,
        title: a.title,
        url: a.url,
      })),
    });
  } catch (error) {
    console.error("Section API error:", error);
    return NextResponse.json({ error: "Failed to fetch section" }, { status: 500 });
  }
}

