"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const todayPractices = [
  {
    id: 1,
    icon: "🌅",
    title: "Morning Prayer",
    time: "6:30 AM",
    status: "completed",
  },
  {
    id: 2,
    icon: "🧘",
    title: "Meditation",
    time: "7:00 AM - Reminder in 10 min",
    status: "pending",
  },
  {
    id: 3,
    icon: "📖",
    title: "Scripture Reading",
    time: "8:00 AM",
    status: "scheduled",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Fasting: Ekasan",
    time: "Next meal: 6:00 PM",
    status: "active",
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
    <div className="min-h-screen pb-20 bg-gradient-to-br from-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">🧘 Practice</h1>
          <Link href="/practice/calendar">
            <Button variant="ghost" size="sm" className="text-saffron-600">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">📅 Today's Practices</h2>
          <div className="space-y-3">
            {todayPractices.map((practice, index) => (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={cn(
                    "card-hover border-2",
                    practice.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : practice.status === "active"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-saffron-50 border-saffron-200"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{practice.icon}</span>
                        <div>
                          <h3 className="font-semibold">{practice.title}</h3>
                          <p className="text-sm text-muted-foreground">{practice.time}</p>
                        </div>
                      </div>
                      <div className="text-2xl">
                        {practice.status === "completed" && "✅"}
                        {practice.status === "pending" && "⏰"}
                        {practice.status === "active" && "🔒"}
                        {practice.status === "scheduled" && "📅"}
                      </div>
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
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-saffron-200">
            <CardHeader>
              <CardTitle className="text-lg">📊 Vrata Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vratas.map((vrata) => (
                <div key={vrata.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">🔒 {vrata.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      Day: {vrata.day}/{vrata.totalDays}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="text-saffron-600 font-semibold">{vrata.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${vrata.progress}%` }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-saffron h-3 rounded-full"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-jainGreen-200 bg-jainGreen-50">
            <CardHeader>
              <CardTitle className="text-lg">🗓️ Fasting Schedule</CardTitle>
              <CardDescription>This Week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fastingSchedule.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded-lg"
                  >
                    <span className="font-medium">{day.day}:</span>
                    <span className="text-saffron-600 font-semibold">{day.type}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Edit Schedule
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
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg">💭 Reflections</CardTitle>
              <CardDescription>Daily Reflection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                How did you practice Ahimsa today?
              </p>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Write your reflection here..."
              />
              <Button className="w-full bg-gradient-saffron hover:shadow-spiritual">
                Save Reflection
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
              <CardTitle className="text-lg">📊 Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-saffron-600" />
                  <span className="font-semibold">Streak:</span>
                </div>
                <span className="text-saffron-600 font-bold text-lg">7 days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-jainGreen-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-jainGreen-600" />
                  <span className="font-semibold">This Month:</span>
                </div>
                <span className="text-jainGreen-600 font-bold">20 practices</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gold-600" />
                  <span className="font-semibold">Achievements:</span>
                </div>
                <span className="text-gold-600 font-bold">5 badges</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

