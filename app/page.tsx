"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Heart, Book, Mic, Sparkles, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Typewriter } from "@/components/animations/Typewriter";
import { FadeIn } from "@/components/animations/FadeIn";

interface DailyQuote {
  quote: string;
  author: string;
  explanation: string;
}

const jainQuotesFallback = [
  {
    quote: "Non-violence must be practiced in thought, speech, and action.",
    author: "",
    explanation: "Ahimsa (non-violence) is the foundation of Jainism. It means not causing harm through thought, word, or deed to any living being, regardless of size or form.",
  },
  {
    quote: "Every living being, however small, desires to live and should be protected.",
    author: "",
    explanation: "Jainism teaches the equality of all souls. Compassion and respect for all living beings arise from understanding this fundamental principle.",
  },
  {
    quote: "Reality has many perspectives; no single viewpoint is complete.",
    author: "",
    explanation: "Anekantvad (non-absolutism) teaches that reality has multiple aspects and can be understood from various perspectives, promoting tolerance and understanding.",
  },
  {
    quote: "You are solely responsible for your spiritual progress.",
    author: "",
    explanation: "Jainism teaches that every soul has the potential to achieve liberation (moksha) through right faith, right knowledge, and right conduct.",
  },
  {
    quote: "Possessiveness creates attachment, which leads to suffering.",
    author: "",
    explanation: "Aparigraha (non-possessiveness) emphasizes reducing attachments to material things and desires, leading to inner freedom and spiritual liberation.",
  },
];

const getRandomQuote = () => {
  return jainQuotesFallback[Math.floor(Math.random() * jainQuotesFallback.length)];
};

const quickActions = [
  { icon: MessageCircle, label: "Chat", href: "/chat", color: "from-saffron-400 to-saffron-600", description: "Ask questions about Jain philosophy" },
  { icon: BookOpen, label: "Learn", href: "/learn", color: "from-jainGreen-400 to-jainGreen-600", description: "Interactive lessons and quizzes" },
  { icon: Heart, label: "Practice", href: "/practice", color: "from-gold-400 to-gold-600", description: "Track your spiritual practices" },
  { icon: Book, label: "Stories", href: "/stories", color: "from-purple-400 to-purple-600", description: "Inspiring Jain stories" },
  { icon: Mic, label: "Pronounce", href: "/pronounce", color: "from-blue-400 to-blue-600", description: "Learn proper pronunciation" },
  { icon: Sparkles, label: "Social", href: "/social", color: "from-pink-400 to-pink-600", description: "Create content" },
];

export default function HomePage() {
  const [dailyWisdom, setDailyWisdom] = useState<DailyQuote | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");
  const [practices, setPractices] = useState([
    { icon: "🌅", title: "Morning Prayer", time: "6:30 AM", status: "completed" },
    { icon: "🧘", title: "Meditation", time: "7:00 AM", status: "pending" },
    { icon: "📖", title: "Scripture Reading", time: "8:00 AM", status: "scheduled" },
    { icon: "🍽️", title: "Fasting: Ekasan", time: "Today", status: "active" },
  ]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.json();
        if (data.success && data.quote) {
          setDailyWisdom({
            quote: data.quote,
            author: "",
            explanation: data.explanation || 'From Jain scriptures and teachings',
          });
        } else {
          const fallback = getRandomQuote();
          setDailyWisdom({
            ...fallback,
            author: "",
          });
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        const fallback = getRandomQuote();
        setDailyWisdom({
          ...fallback,
          author: "",
        });
      }
    };

    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hours = now.getHours();
      const greetingText = hours < 12 ? "Morning" : hours < 18 ? "Afternoon" : "Evening";
      setGreeting(greetingText);
      setCurrentTime(formatDate(now));
    };

    fetchQuote();
    updateTimeAndGreeting();
  }, []);

  const completedPractices = practices.filter(p => p.status === "completed").length;
  const totalPractices = practices.length;
  const practicesProgress = totalPractices > 0 ? Math.round((completedPractices / totalPractices) * 100) : 0;
  const learningProgress = 70;
  const streak = 7;
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-saffron-50 via-white to-gold-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,176,65,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.1),transparent_50%)]" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold font-display mb-4 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600 bg-clip-text text-transparent leading-tight"
              >
                JainAI
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light leading-relaxed px-2"
              >
                Mobile App for{" "}
                <span className="text-saffron-600 font-medium">JainVerse</span>
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="text-base sm:text-lg text-gray-600 leading-relaxed px-4 max-w-md mx-auto"
              >
                Where Ancient Wisdom Meets Modern AI
              </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2 }}
                        className="pt-6"
                      >
                        {greeting && (
                          <p className="text-base sm:text-lg text-gray-600 mb-1">
                            Good {greeting}! 🙏
                          </p>
                        )}
                        {currentTime && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            {currentTime}
                          </p>
                        )}
                      </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.5 }}
                className="pt-8"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block"
                >
                  <ArrowDown className="w-8 h-8 text-saffron-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-16 space-y-24 max-w-6xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 px-4">
              Learn. Reconnect. Remember.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Short teachings, small actions, and plain-language wisdom help you feel better now—without jargon or gatekeeping.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-saffron-100/50 via-transparent to-gold-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-400" />
              <CardHeader className="pb-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    💡 Daily Reflection
                  </CardTitle>
                </motion.div>
              </CardHeader>
                      <CardContent className="space-y-6">
                        {dailyWisdom ? (
                          <>
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="text-xl sm:text-2xl md:text-3xl font-light italic text-gray-800 leading-relaxed px-2"
                            >
                              "{dailyWisdom.quote}"
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.6 }}
                              className="bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl p-4 sm:p-6 border border-saffron-100"
                            >
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {dailyWisdom.explanation}
                              </p>
                            </motion.div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading reflection...</p>
                          </div>
                        )}
                      </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 text-center px-4">
              App Features
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Short, friendly ways to learn Jain principles, ethics, and practices.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4 max-w-2xl mx-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <ScrollReveal key={action.label} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 10, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={action.href}>
                    <Card className="group cursor-pointer border-2 border-transparent hover:border-saffron-200 transition-all duration-300 bg-white hover:shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-saffron-50 via-transparent to-gold-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="p-6 relative z-10 flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-saffron-600 transition-colors">
                            {action.label}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="text-saffron-500"
                        >
                          →
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="up" delay={0.3}>
          <div className="bg-gradient-to-br from-saffron-50 via-white to-gold-50 rounded-3xl p-6 sm:p-8 md:p-12 border border-saffron-100">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Today's Practices
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Your spiritual journey, one step at a time.
              </p>
              <div className="space-y-4 mt-8 max-w-2xl mx-auto">
                {practices.map((practice, idx) => (
                  <FadeIn key={idx} delay={idx * 0.1}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 10 }}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        practice.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : practice.status === "active"
                          ? "bg-purple-50 border-purple-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{practice.icon}</span>
                          <div>
                            <p className="font-semibold text-base text-gray-900">{practice.title}</p>
                            <p className="text-sm text-gray-600">{practice.time}</p>
                          </div>
                        </div>
                        <span className="text-2xl">
                          {practice.status === "completed" && "✅"}
                          {practice.status === "pending" && "⏰"}
                          {practice.status === "active" && "🔒"}
                          {practice.status === "scheduled" && "📅"}
                        </span>
                      </div>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-4">
              Progress Today
            </h2>
            <div className="max-w-md mx-auto space-y-6">
              <FadeIn delay={0.1}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Practices</span>
                    <span className="font-bold text-gray-900">{practicesProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${practicesProgress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-saffron-400 to-saffron-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {completedPractices} of {totalPractices} completed
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Learning</span>
                    <span className="font-bold text-gray-900">{learningProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${learningProgress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-jainGreen-400 to-jainGreen-600 rounded-full"
                    />
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200">
                  <span className="text-base sm:text-lg font-medium text-gray-900">Streak</span>
                  <span className="text-xl sm:text-2xl font-bold text-saffron-600">{streak} days</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 3 }}
        className="fixed bottom-24 right-6 z-40"
      >
        <Link href="/chat">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 text-white shadow-2xl flex items-center justify-center relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <MessageCircle className="w-7 h-7 relative z-10" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
