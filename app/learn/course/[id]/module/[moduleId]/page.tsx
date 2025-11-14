"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Check, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  url?: string;
  completed?: boolean;
}

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = parseInt(params.moduleId as string);
  const [articles, setArticles] = useState<Article[]>([]);
  const [module, setModule] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchModule();
  }, [courseId, moduleId]);

  const fetchModule = async () => {
    try {
      const courseResponse = await fetch(`/api/learn/course/${courseId}`);
      if (!courseResponse.ok) throw new Error("Failed to fetch course");
      const courseData = await courseResponse.json();
      setCourse(courseData);

      const moduleData = courseData.modules.find((m: any) => m.id === moduleId);
      if (moduleData) {
        setModule(moduleData);
        setArticles(moduleData.articles || []);
      }
    } catch (error) {
      console.error("Error fetching module:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleComplete = async (articleId: string) => {
    try {
      const response = await fetch(`/api/learn/course/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-article",
          articleId,
        }),
      });

      if (response.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === articleId ? { ...a, completed: true } : a))
        );
        await fetchModule();
      }
    } catch (error) {
      console.error("Error completing article:", error);
    }
  };

  const handleModuleComplete = async () => {
    try {
      const response = await fetch(`/api/learn/course/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-module",
          moduleId,
        }),
      });

      if (response.ok) {
        router.push(`/learn/course/${courseId}`);
      }
    } catch (error) {
      console.error("Error completing module:", error);
    }
  };

  const allArticlesCompleted = articles.length > 0 && articles.every((a) => a.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Module not found</p>
          <Link href={`/learn/course/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href={`/learn/course/${courseId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{module.title}</h1>
            <p className="text-xs text-gray-600">
              {module.progress} of {module.totalArticles} articles completed
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-jainGreen-600" />
                {module.title}
              </CardTitle>
              <CardDescription className="text-base text-gray-700">
                Read through all articles to complete this module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Module Progress</span>
                    <span className="font-bold text-jainGreen-600">
                      {module.progress}/{module.totalArticles}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(module.progress / module.totalArticles) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-jainGreen-400 to-teal-500 h-3 rounded-full"
                    />
                  </div>
                </div>
                {allArticlesCompleted && (
                  <Button
                    onClick={handleModuleComplete}
                    className="bg-gradient-to-r from-saffron-500 to-gold-500"
                  >
                    Complete Module
                    <Trophy className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Articles</h2>
            {articles.map((article, index) => (
              <ScrollReveal key={article.id || index} direction="up" delay={index * 0.1}>
                <Card
                  className={`border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    article.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-saffron-200"
                  }`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            article.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {article.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {article.title || `Article ${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.content?.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            key={selectedArticle.id}
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onComplete={() => {
              handleArticleComplete(selectedArticle.id);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ArticleModal({
  article,
  onClose,
  onComplete,
}: {
  article: Article;
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!article.completed && (
            <Button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="bg-gradient-to-r from-saffron-500 to-gold-500"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          {article.completed && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Completed
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

