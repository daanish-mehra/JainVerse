"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, BookOpen, Brain, Target, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const learningPaths = [
  {
    id: 1,
    title: "Jain Philosophy Basics",
    progress: 80,
    badges: 3,
    totalBadges: 5,
    level: "Beginner",
  },
  {
    id: 2,
    title: "Meditation & Practices",
    progress: 60,
    badges: 2,
    totalBadges: 5,
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Mantras & Prayers",
    progress: 40,
    badges: 1,
    totalBadges: 5,
    level: "Beginner",
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
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">📚 Learn</h1>
          <div className="flex items-center space-x-2 bg-gradient-saffron text-white px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{punyaPoints}</span>
            <span className="text-xs">Punya</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Level 5 Learner</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">🎯 Learning Paths</h2>
          <div className="space-y-4">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover border-saffron-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded-full">
                        {path.level}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{path.progress}% Complete</span>
                        <span>🏅 {path.badges}/{path.totalBadges} Badges</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${path.progress}%` }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                          className="bg-gradient-saffron h-2.5 rounded-full"
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-saffron hover:shadow-spiritual">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-jainGreen-50 to-jainGreen-100 border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Daily Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quizzes.slice(0, 1).map((quiz) => (
                <div key={quiz.id} className="space-y-4">
                  <p className="font-semibold text-lg">❓ {quiz.question}</p>
                  <div className="space-y-2">
                    {quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(quiz.id, index)}
                        disabled={selectedQuiz === quiz.id}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 transition-all duration-300",
                          selectedQuiz === quiz.id && selectedAnswer === index
                            ? quizResult
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-red-100 border-red-500 text-red-700"
                            : selectedQuiz === quiz.id && index === quiz.correct
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-white border-saffron-200 hover:border-saffron-400 hover:bg-saffron-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedQuiz === quiz.id && selectedAnswer === index && (
                            <span>{quizResult ? "✅" : "❌"}</span>
                          )}
                          {selectedQuiz === quiz.id && index === quiz.correct && selectedAnswer !== index && (
                            <span>✅</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedQuiz === quiz.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-lg",
                        quizResult ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      )}
                    >
                      <p className="font-semibold">
                        {quizResult
                          ? "🎉 Correct! Great job!"
                          : "💡 That's not quite right. The correct answer is highlighted."}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📖 Stories & Moral Dilemmas</h2>
          <div className="space-y-3">
            {stories.map((story) => (
              <Card key={story.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">📖 {story.title}</h3>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                        <span>🎯 Age: {story.age}</span>
                        <span>⭐ {story.rating}/5</span>
                        <span>📚 {story.pages} pages</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Read</Button>
                      <Button variant="outline" size="sm">Listen</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="card-hover bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h3 className="font-semibold">🤔 Ethical Dilemma: Should I...</h3>
                <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                  <span>🎯 Age: 10+ years</span>
                  <span>⭐ 4.9/5</span>
                </div>
                <Button variant="outline" size="sm" className="mt-3">Explore</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  "card-hover",
                  achievement.earned
                    ? "bg-gradient-saffron border-saffron-300"
                    : "bg-gray-50 border-gray-200 opacity-60"
                )}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <span className={cn("font-semibold", achievement.earned ? "text-white" : "text-gray-500")}>
                      {achievement.title}
                    </span>
                  </div>
                  {achievement.earned ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

