"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Play, Volume2, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const lessons = [
  {
    id: 1,
    title: "Lesson 1: Basic Sounds",
    progress: 0,
    level: "Beginner",
  },
  {
    id: 2,
    title: "Lesson 2: Common Words",
    progress: 0,
    level: "Beginner",
  },
  {
    id: 3,
    title: "Lesson 3: Sutras",
    progress: 0,
    level: "Intermediate",
  },
];

export default function PronouncePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState("EN");
  const [targetLanguage, setTargetLanguage] = useState("HI");
  const [translation, setTranslation] = useState({
    english: "Non-violence",
    hindi: "अहिंसा",
    sanskrit: "अहिंसा",
    prakrit: "अहिंसा",
  });

  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setAccuracy(95); 
      }, 3000);
    }
  };

  const handleTranslate = () => {
    
    // TODO: Implement translation with Azure Translator
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">🗣️ Language Tutor</h1>
          <div className="flex items-center space-x-2">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="EN">🌐 EN</option>
              <option value="HI">🌐 HI</option>
              <option value="GU">🌐 GU</option>
              <option value="SA">🌐 SA</option>
              <option value="PA">🌐 PA</option>
            </select>
            <span>→</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="EN">🌐 EN</option>
              <option value="HI">🌐 HI</option>
              <option value="GU">🌐 GU</option>
              <option value="SA">🌐 SA</option>
              <option value="PA">🌐 PA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-saffron-200 bg-gradient-to-br from-saffron-50 to-gold-50">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Pronunciation Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold text-saffron-700">अहिंसा</h2>
                <p className="text-lg text-muted-foreground">Ahimsa (Non-violence)</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="rounded-full bg-white hover:bg-saffron-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Audio
                </Button>
                <Button
                  onClick={handleRecord}
                  className={cn(
                    "rounded-full",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-saffron hover:shadow-spiritual"
                  )}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isRecording ? "Stop" : "Record"}
                </Button>
              </div>
              {accuracy !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2 p-4 bg-white rounded-xl border border-green-200"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      ✅ Accuracy: {accuracy}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💡 Tips: Great pronunciation! Keep practicing.
                  </p>
                </motion.div>
              )}
              {isRecording && (
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📚 Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">📖 {lesson.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded-full">
                            {lesson.level}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lesson.progress}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                              className="bg-gradient-saffron h-2 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{lesson.progress}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        Continue
                      </Button>
                    </div>
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
          <Card className="border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-lg">🔄 Translation & Transliteration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">English</label>
                <Input
                  value={translation.english}
                  onChange={(e) => setTranslation({ ...translation, english: e.target.value })}
                  placeholder="Enter text..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Hindi</label>
                <Input
                  value={translation.hindi}
                  readOnly
                  placeholder="Translated text..."
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sanskrit</label>
                <Input
                  value={translation.sanskrit}
                  readOnly
                  placeholder="Translated text..."
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Prakrit</label>
                <Input
                  value={translation.prakrit}
                  readOnly
                  placeholder="Translated text..."
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTranslate}
                  className="flex-1 bg-gradient-saffron hover:shadow-spiritual"
                >
                  Translate
                </Button>
                <Button variant="outline" className="flex-1">
                  Transliterate
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-saffron-600" />
                  <span className="font-semibold">Accuracy:</span>
                </div>
                <span className="text-saffron-600 font-bold text-lg">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-jainGreen-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-jainGreen-600" />
                  <span className="font-semibold">Words Learned:</span>
                </div>
                <span className="text-jainGreen-600 font-bold">150</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-gold-600" />
                  <span className="font-semibold">Current Streak:</span>
                </div>
                <span className="text-gold-600 font-bold">5 days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

