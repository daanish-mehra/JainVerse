"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, FileText, Upload, TrendingUp, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const lessons = [
  {
    id: 1,
    title: "Lesson 1: Jain Philosophy",
    progress: 0,
    level: "Beginner",
  },
  {
    id: 2,
    title: "Lesson 2: Meditation",
    progress: 0,
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Lesson 3: Practices",
    progress: 0,
    level: "Intermediate",
  },
];

const languages = ["EN", "HI", "GU", "SA", "PA"];

export default function TeachingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [transcript, setTranscript] = useState("");

  const handleSummarize = () => {
    // TODO: Implement lecture summarization with Azure OpenAI
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">📚 Teaching Companion</h1>
          <Button variant="ghost" size="sm" className="text-saffron-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            Tutor
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📖 Structured Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover border-saffron-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">📚 {lesson.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded-full">
                            🎯 Level: {lesson.level}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lesson.progress}%` }}
                              transition={{ delay: index * 0.2, duration: 1 }}
                              className="bg-gradient-saffron h-2 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">{lesson.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
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
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-jainGreen-50 to-teal-50 border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-lg">🌐 Language-Localized Content</CardTitle>
              <CardDescription>Content available in multiple languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedLanguage === lang
                        ? "bg-gradient-saffron text-white shadow-md"
                        : "bg-white border border-saffron-200 text-saffron-600 hover:bg-saffron-50"
                    }`}
                  >
                    🌐 {lang}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Content available in {languages.length} languages
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                📝 Lecture Summarizer
              </CardTitle>
              <CardDescription>Upload audio/video or paste transcript to summarize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  🎤 Upload Audio/Video
                </Button>
                <div className="text-center text-sm text-muted-foreground">or</div>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste transcript here..."
                  className="min-h-[120px]"
                />
              </div>
              <Button
                onClick={handleSummarize}
                className="w-full bg-gradient-saffron hover:shadow-spiritual"
                disabled={!transcript.trim()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Summarize
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-gold-50 to-saffron-50 border-gold-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                🎯 Adaptive Tutoring
              </CardTitle>
              <CardDescription>AI-powered personalized learning paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-saffron-600" />
                    <span className="font-semibold">Your Progress:</span>
                  </div>
                  <span className="text-saffron-600 font-bold text-lg">75%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-jainGreen-600" />
                    <span className="font-semibold">Recommended:</span>
                  </div>
                  <span className="text-jainGreen-600 font-bold">Lesson 3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Focus Areas:</span>
                  </div>
                  <span className="text-purple-600 font-bold">Meditation</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-saffron hover:shadow-spiritual">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Progress Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-saffron-600" />
                  <span className="font-semibold">Completion:</span>
                </div>
                <span className="text-saffron-600 font-bold text-lg">60%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-jainGreen-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-jainGreen-600" />
                  <span className="font-semibold">Badges:</span>
                </div>
                <span className="text-jainGreen-600 font-bold">5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Lessons:</span>
                </div>
                <span className="text-blue-600 font-bold">12/20</span>
              </div>
              <Button variant="outline" className="w-full">
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

