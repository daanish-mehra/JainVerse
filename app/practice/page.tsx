"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, Flame, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FadeIn } from "@/components/animations/FadeIn";

const todayPractices = [
  {
    id: 1,
    icon: "🌅",
    title: "Morning Prayer",
    time: "6:30 AM",
    status: "completed",
    color: "green",
  },
  {
    id: 2,
    icon: "🧘",
    title: "Meditation",
    time: "7:00 AM - Reminder in 10 min",
    status: "pending",
    color: "saffron",
  },
  {
    id: 3,
    icon: "📖",
    title: "Scripture Reading",
    time: "8:00 AM",
    status: "scheduled",
    color: "blue",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Fasting: Ekasan",
    time: "Next meal: 6:00 PM",
    status: "active",
    color: "purple",
  },
];

const vratas = [
  {
    id: 1,
    name: "Ekasan Vrata",
    day: 3,
    totalDays: 30,
    progress: 10,
  },
];

const fastingSchedule = [
  { day: "Mon", type: "Ekasan" },
  { day: "Tue", type: "Biasan" },
  { day: "Wed", type: "Chauvihar" },
  { day: "Thu", type: "Ekasan" },
  { day: "Fri", type: "Biasan" },
  { day: "Sat", type: "Chauvihar" },
  { day: "Sun", type: "Ekasan" },
];

export default function PracticePage() {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-8 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-saffron-600 to-gold-500 bg-clip-text text-transparent"
          >
            🧘 Practice
          </motion.h1>
          <Link href="/practice/calendar">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-saffron-600 hover:bg-saffron-50 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="px-6 py-12 space-y-16 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Today's Practices
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your spiritual routine for today
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayPractices.map((practice, index) => (
                <ScrollReveal key={practice.id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={cn(
                      "p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl",
                      practice.status === "completed"
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                        : practice.status === "active"
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                        : "bg-gradient-to-br from-saffron-50 to-gold-50 border-saffron-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          className="text-4xl"
                        >
                          {practice.icon}
                        </motion.span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{practice.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{practice.time}</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                        className="text-3xl"
                      >
                        {practice.status === "completed" && "✅"}
                        {practice.status === "pending" && "⏰"}
                        {practice.status === "active" && "🔒"}
                        {practice.status === "scheduled" && "📅"}
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-saffron-100/50 via-transparent to-gold-100/50 rounded-3xl blur-3xl" />
            <Card className="relative border-2 border-saffron-200 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-saffron-600" />
                  Vrata Tracker
                </CardTitle>
                <CardDescription className="text-base">
                  Track your spiritual commitments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {vratas.map((vrata) => (
                  <motion.div
                    key={vrata.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-gray-900">🔒 {vrata.name}</h3>
                      <span className="text-sm text-gray-600 font-medium">
                        Day: {vrata.day}/{vrata.totalDays}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="text-saffron-600 font-bold text-lg">{vrata.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${vrata.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500 h-4 rounded-full"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-saffron-50 hover:border-saffron-300 rounded-xl">
                      View Details
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-jainGreen-100/50 via-transparent to-teal-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jainGreen-400 via-teal-400 to-jainGreen-500" />
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">🗓️ Fasting Schedule</CardTitle>
                <CardDescription className="text-base">This Week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {fastingSchedule.map((day, index) => (
                    <FadeIn key={index} delay={index * 0.05}>
                      <motion.div
                        whileHover={{ scale: 1.1, y: -4 }}
                        className="p-3 bg-white rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-300 border border-jainGreen-100"
                      >
                        <p className="text-xs font-semibold text-gray-600 mb-1">{day.day}</p>
                        <p className="text-sm font-bold text-saffron-600">{day.type}</p>
                      </motion.div>
                    </FadeIn>
                  ))}
                </div>
                <Button variant="outline" className="w-full hover:bg-jainGreen-50 hover:border-jainGreen-300 rounded-xl">
                  Edit Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-transparent to-pink-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500" />
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">💭 Reflections</CardTitle>
                <CardDescription className="text-base">Daily Reflection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 font-medium">
                  How did you practice Ahimsa today?
                </p>
                <textarea
                  className="w-full min-h-[120px] p-4 rounded-xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all bg-white/80 backdrop-blur-sm"
                  placeholder="Write your reflection here..."
                />
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl hover:scale-105 transition-all rounded-xl">
                  Save Reflection
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.5}>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Flame, label: "Streak", value: "7 days", color: "saffron", bg: "from-saffron-50 to-orange-50", border: "border-saffron-200" },
                { icon: TrendingUp, label: "This Month", value: "20 practices", color: "jainGreen", bg: "from-jainGreen-50 to-teal-50", border: "border-jainGreen-200" },
                { icon: Award, label: "Achievements", value: "5 badges", color: "gold", bg: "from-gold-50 to-yellow-50", border: "border-gold-200" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeIn key={index} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -6 }}
                      className={`p-6 rounded-2xl border-2 ${stat.border} bg-gradient-to-br ${stat.bg} shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                        <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                      </div>
                      <p className={`text-2xl font-bold text-${stat.color}-600`}>
                        {stat.value}
                      </p>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
