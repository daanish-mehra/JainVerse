"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, BookOpen, Brain, Target, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FadeIn } from "@/components/animations/FadeIn";

const learningPaths = [
  {
    id: 1,
    title: "Jain Philosophy Basics",
    progress: 80,
    badges: 3,
    totalBadges: 5,
    level: "Beginner",
    description: "Learn the fundamental principles of Jainism",
  },
  {
    id: 2,
    title: "Meditation & Practices",
    progress: 60,
    badges: 2,
    totalBadges: 5,
    level: "Intermediate",
    description: "Discover meditation techniques and daily practices",
  },
  {
    id: 3,
    title: "Mantras & Prayers",
    progress: 40,
    badges: 1,
    totalBadges: 5,
    level: "Beginner",
    description: "Master Jain mantras and prayers",
  },
];

const quizzes = [
  {
    id: 1,
    question: "What is Ahimsa?",
    options: ["Non-violence", "Truth", "Non-stealing", "Celibacy"],
    correct: 0,
  },
  {
    id: 2,
    question: "What are the main principles of Jainism?",
    options: ["Ahimsa, Satya, Asteya", "Ahimsa, Anekantvad, Aparigraha", "Ahimsa, Karma, Moksha", "All of the above"],
    correct: 1,
  },
];

const stories = [
  {
    id: 1,
    title: "The Story of Mahavira",
    age: "5-10 years",
    rating: 4.8,
    pages: 10,
  },
  {
    id: 2,
    title: "The Value of Ahimsa",
    age: "2-5 years",
    rating: 4.9,
    pages: 8,
  },
];

const achievements = [
  { id: 1, title: "Philosophy Master", icon: "🥇", earned: true },
  { id: 2, title: "Practice Champion", icon: "🥈", earned: true },
  { id: 3, title: "Quiz Expert", icon: "🥉", earned: false },
];

export default function LearnPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [punyaPoints, setPunyaPoints] = useState(250);

  const handleQuizAnswer = (quizId: number, answerIndex: number) => {
    setSelectedQuiz(quizId);
    setSelectedAnswer(answerIndex);
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz && answerIndex === quiz.correct) {
      setQuizResult(true);
      setPunyaPoints((prev) => prev + 10);
    } else {
      setQuizResult(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-saffron-600 to-gold-500 bg-clip-text text-transparent"
          >
            📚 Learn
          </motion.h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold text-base sm:text-lg">{punyaPoints}</span>
            <span className="text-xs sm:text-sm opacity-90">Punya</span>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm"
        >
          Level 5 Learner • Continue your journey
        </motion.p>
      </motion.div>

      <div className="px-6 py-12 space-y-16 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Learning Paths
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Structured courses from beginner to advanced
            </p>
            <div className="space-y-6">
              {learningPaths.map((path, index) => (
                <ScrollReveal key={path.id} direction="left" delay={index * 0.15}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-saffron-50/50 via-transparent to-gold-50/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="relative border-2 border-gray-100 hover:border-saffron-200 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {path.title}
                          </CardTitle>
                          <span className="text-xs bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full font-medium">
                            {path.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{path.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">{path.progress}% Complete</span>
                            <span className="font-semibold text-saffron-600">🏅 {path.badges}/{path.totalBadges} Badges</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${path.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                              className="bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500 h-3 rounded-full"
                            />
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-saffron-500 to-gold-500 hover:shadow-xl hover:scale-105 transition-all">
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-jainGreen-100/50 via-transparent to-teal-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jainGreen-400 via-teal-400 to-jainGreen-500" />
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center text-gray-900">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-jainGreen-600" />
                  Daily Quiz
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Test your knowledge with today's quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizzes.slice(0, 1).map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <p className="font-bold text-lg sm:text-xl text-gray-900">❓ {quiz.question}</p>
                    <div className="space-y-3">
                      {quiz.options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuizAnswer(quiz.id, index)}
                          disabled={selectedQuiz === quiz.id}
                          whileHover={{ scale: selectedQuiz !== quiz.id ? 1.02 : 1 }}
                          whileTap={{ scale: selectedQuiz !== quiz.id ? 0.98 : 1 }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium",
                            selectedQuiz === quiz.id && selectedAnswer === index
                              ? quizResult
                                ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                                : "bg-red-100 border-red-500 text-red-700 shadow-lg"
                              : selectedQuiz === quiz.id && index === quiz.correct
                              ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                              : "bg-white border-gray-200 hover:border-jainGreen-400 hover:bg-jainGreen-50 text-gray-800"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedQuiz === quiz.id && selectedAnswer === index && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {quizResult ? "✅" : "❌"}
                              </motion.span>
                            )}
                            {selectedQuiz === quiz.id && index === quiz.correct && selectedAnswer !== index && (
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
                    {selectedQuiz === quiz.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-4 rounded-xl",
                          quizResult ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
                        )}
                      >
                        <p className="font-semibold text-lg">
                          {quizResult ? "🎉 Correct! Great job!" : "💡 That's not quite right. The correct answer is highlighted."}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Stories & Moral Dilemmas
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Engaging stories for different age groups
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story, index) => (
                <ScrollReveal key={story.id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -6 }}
                    className="h-full"
                  >
                    <Card className="h-full border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 bg-white hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-3">📖 {story.title}</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              <span>🎯 Age: {story.age}</span>
                              <span>⭐ {story.rating}/5</span>
                              <span>📚 {story.pages} pages</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-purple-50 hover:border-purple-300">
                            Read
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-purple-50 hover:border-purple-300">
                            Listen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
              <ScrollReveal direction="up" delay={0.2}>
                <motion.div whileHover={{ scale: 1.03, y: -6 }}>
                  <Card className="h-full border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">🤔 Ethical Dilemma</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                        <span>🎯 Age: 10+ years</span>
                        <span>⭐ 4.9/5</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full hover:bg-purple-100 hover:border-purple-400">
                        Explore Dilemma
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Achievements
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Your accomplishments on your spiritual journey
            </p>
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => (
                <ScrollReveal key={achievement.id} direction="right" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={cn(
                      "transition-all duration-300",
                      achievement.earned
                        ? "bg-gradient-to-r from-saffron-50 via-gold-50 to-saffron-50 border-2 border-saffron-200 shadow-lg"
                        : "bg-gray-50 border-2 border-gray-200 opacity-60"
                    )}
                  >
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                            className="text-3xl sm:text-4xl"
                          >
                            {achievement.icon}
                          </motion.span>
                          <span className={cn("font-bold text-base sm:text-lg", achievement.earned ? "text-gray-900" : "text-gray-500")}>
                            {achievement.title}
                          </span>
                        </div>
                        {achievement.earned ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="w-7 h-7 text-green-500" />
                          </motion.div>
                        ) : (
                          <XCircle className="w-7 h-7 text-gray-400" />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
