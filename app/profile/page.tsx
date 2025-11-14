"use client";

import { motion } from "framer-motion";
import { Settings, Trophy, BookOpen, MessageCircle, TrendingUp, Bell, Globe, Palette, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = {
  streak: 0,
  lessons: 0,
  totalLessons: 20,
  badges: 0,
  chats: 0,
};

const settings = [
  { icon: Globe, label: "Language", description: "English, Hindi, Gujarati" },
  { icon: Bell, label: "Notifications", description: "Practice reminders" },
  { icon: Palette, label: "Theme", description: "Light mode" },
  { icon: Shield, label: "Privacy", description: "Data privacy settings" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">👤 Profile</h1>
          <Button variant="ghost" size="sm" className="text-saffron-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-spiritual border-0 shadow-spiritual overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-md">
                👤
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Daanish</h2>
              <p className="text-white/90 text-sm">Level 1 Learner</p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white text-sm font-semibold">🔥 {stats.streak} day streak</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-saffron-600" />
                  <span className="font-semibold">🔥 Streak:</span>
                </div>
                <span className="text-saffron-600 font-bold text-lg">{stats.streak} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-jainGreen-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-jainGreen-600" />
                  <span className="font-semibold">📚 Lessons:</span>
                </div>
                <span className="text-jainGreen-600 font-bold">{stats.lessons}/{stats.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-gold-600" />
                  <span className="font-semibold">🏆 Badges:</span>
                </div>
                <span className="text-gold-600 font-bold">{stats.badges}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">💬 Chats:</span>
                </div>
                <span className="text-blue-600 font-bold">{stats.chats}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚙️ Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {settings.map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <motion.div
                    key={setting.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-saffron-100 rounded-xl hover:bg-saffron-50 transition-all duration-300 card-hover">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-saffron-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-saffron-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{setting.label}</p>
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <span className="text-muted-foreground">→</span>
                    </button>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                📊 Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Learning Progress</span>
                  <span className="text-saffron-600 font-semibold">
                    {Math.round((stats.lessons / stats.totalLessons) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.lessons / stats.totalLessons) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-saffron h-3 rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg text-center">
                  <p className="text-2xl font-bold text-saffron-600">{stats.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="p-3 bg-white rounded-lg text-center">
                  <p className="text-2xl font-bold text-jainGreen-600">{stats.badges}</p>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

