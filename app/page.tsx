"use client";

import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Heart, Book, Mic, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const dailyWisdom = {
  quote: "Ahimsa is the highest virtue",
  author: "Mahavira",
  explanation: "Non-violence towards all living beings is the fundamental principle of Jainism. It means not causing harm through thought, word, or deed.",
};

const quickActions = [
  { icon: MessageCircle, label: "Chat", href: "/chat", color: "from-saffron-400 to-saffron-600" },
  { icon: BookOpen, label: "Learn", href: "/learn", color: "from-jainGreen-400 to-jainGreen-600" },
  { icon: Heart, label: "Practice", href: "/practice", color: "from-gold-400 to-gold-600" },
  { icon: Book, label: "Stories", href: "/stories", color: "from-purple-400 to-purple-600" },
  { icon: Mic, label: "Pronounce", href: "/pronounce", color: "from-blue-400 to-blue-600" },
  { icon: Sparkles, label: "Social", href: "/social", color: "from-pink-400 to-pink-600" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 via-white to-saffron-50">
      {}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-spiritual pt-12 pb-8 px-6 rounded-b-3xl"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2 font-display"
          >
            🕉️ JainVerse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-ivory-100 text-lg mb-4"
          >
            Where Ancient Wisdom Meets Modern AI
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/90 text-sm"
          >
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}! 🙏
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-white/80 text-xs mt-1"
          >
            {formatDate(new Date())}
          </motion.p>
        </div>
      </motion.div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-saffron border-0 shadow-spiritual overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-xl">💡 Daily Jain Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white text-lg font-semibold italic">
                "{dailyWisdom.quote}"
              </p>
              <p className="text-white/90 text-sm">— {dailyWisdom.author}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-3">
                <p className="text-white text-sm leading-relaxed">
                  {dailyWisdom.explanation}
                </p>
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
          <h2 className="text-xl font-bold text-foreground mb-4">🎯 Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={action.href}>
                    <Card className="card-hover cursor-pointer border-2 border-transparent hover:border-saffron-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground text-center">
                          {action.label}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-saffron-200">
            <CardHeader>
              <CardTitle className="text-lg">📅 Today's Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌅</span>
                  <div>
                    <p className="font-semibold text-sm">Morning Prayer</p>
                    <p className="text-xs text-muted-foreground">6:30 AM</p>
                  </div>
                </div>
                <span className="text-green-600">✅</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg border border-saffron-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧘</span>
                  <div>
                    <p className="font-semibold text-sm">Meditation</p>
                    <p className="text-xs text-muted-foreground">7:00 AM - Reminder in 10 min</p>
                  </div>
                </div>
                <span className="text-saffron-600">⏰</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <p className="font-semibold text-sm">Scripture Reading</p>
                    <p className="text-xs text-muted-foreground">8:00 AM</p>
                  </div>
                </div>
                <span className="text-blue-600">📅</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="font-semibold text-sm">Fasting: Ekasan</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
                <span className="text-purple-600">🔒</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Progress Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Practices</span>
                  <span className="text-saffron-600 font-semibold">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="bg-gradient-saffron h-2.5 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Learning</span>
                  <span className="text-jainGreen-600 font-semibold">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ delay: 0.9, duration: 1 }}
                    className="bg-gradient-to-r from-jainGreen-400 to-jainGreen-600 h-2.5 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium">🔥 Streak</span>
                <span className="text-saffron-600 font-bold text-lg">7 days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-gradient-saffron text-white shadow-spiritual flex items-center justify-center pulse-glow"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
