"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Check, Trophy, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
}

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id as string;
  const sectionId = parseInt(params.sectionId as string);
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchSection();
  }, [guideId, sectionId]);

  const fetchSection = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${guideId}/section/${sectionId}`);
      if (!response.ok) throw new Error("Failed to fetch section");
      const data = await response.json();
      setSection(data);
    } catch (error) {
      console.error("Error fetching section:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!section?.quiz) return;
    setSelectedQuizAnswer(answerIndex);
    setQuizResult(answerIndex === section.quiz.correct);
  };

  const handleSectionComplete = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${guideId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-module",
          moduleId: sectionId,
        }),
      });

      if (response.ok) {
        router.push(`/learn/guide/${guideId}`);
      }
    } catch (error) {
      console.error("Error completing section:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Section not found</p>
          <Link href={`/learn/guide/${guideId}`}>
            <Button>Back to Guide</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href={`/learn/guide/${guideId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{section.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-jainGreen-600" />
                {section.title}
              </CardTitle>
              <CardDescription className="text-base text-gray-700">
                Learn and practice Jain principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                  {section.summary || "Loading content..."}
                </div>
                {section.completed && (
                  <div className="flex items-center text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Section Completed</span>
                  </div>
                )}
                {!section.completed && (
                  <Button
                    onClick={handleSectionComplete}
                    className="bg-gradient-to-r from-saffron-500 to-gold-500 w-full"
                  >
                    Mark as Complete
                    <Trophy className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {section.quiz && (
          <ScrollReveal direction="up" delay={0.1}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Quiz
                </CardTitle>
                <CardDescription className="text-sm text-gray-700">
                  Test your understanding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold text-lg text-gray-900">{section.quiz.question}</p>
                <div className="space-y-3">
                  {section.quiz.options.map((option: string, index: number) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={selectedQuizAnswer !== null}
                      whileHover={{ scale: selectedQuizAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: selectedQuizAnswer === null ? 0.98 : 1 }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedQuizAnswer === index
                          ? quizResult
                            ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                            : "bg-red-100 border-red-500 text-red-700 shadow-lg"
                          : selectedQuizAnswer !== null && index === section.quiz.correct
                          ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                          : "bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedQuizAnswer === index && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {quizResult ? "✅" : "❌"}
                          </motion.span>
                        )}
                        {selectedQuizAnswer !== null && index === section.quiz.correct && selectedQuizAnswer !== index && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            ✅
                          </motion.span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                {selectedQuizAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl space-y-2 ${
                      quizResult ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
                    }`}
                  >
                    <p className="font-semibold text-lg">
                      {quizResult ? "🎉 Correct! Great job!" : "💡 That's not quite right. The correct answer is highlighted."}
                    </p>
                    {section.quiz.explanation && (
                      <p className="text-sm mt-2">{section.quiz.explanation}</p>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

