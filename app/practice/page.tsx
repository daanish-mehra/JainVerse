"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, Flame, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FadeIn } from "@/components/animations/FadeIn";

interface Practice {
  id: number;
  icon: string;
  title: string;
  titleJain?: string;
  time: string;
  status: string;
  description?: string;
}

interface Vrata {
  id: number;
  name: string;
  day: number;
  totalDays: number;
  progress: number;
  description?: string;
}

interface FastingDay {
  day: string;
  type: string;
  date?: string;
  isToday?: boolean;
}

interface Progress {
  streak: number;
  totalPractices: number;
  vratasCompleted: number;
  thisMonth: number;
}

export default function PracticePage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [vratas, setVratas] = useState<Vrata[]>([]);
  const [fastingSchedule, setFastingSchedule] = useState<FastingDay[]>([]);
  const [progress, setProgress] = useState<Progress>({ streak: 0, totalPractices: 0, vratasCompleted: 0, thisMonth: 0 });
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Handle scroll to specific section from URL params
    const params = new URLSearchParams(window.location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, []);

  const fetchData = async () => {
    try {
      const [practicesRes, vratasRes, fastingRes, progressRes] = await Promise.all([
        fetch('/api/practice?type=practices'),
        fetch('/api/practice?type=vratas'),
        fetch('/api/practice?type=fasting'),
        fetch('/api/practice?type=progress'),
      ]);

      const practicesData = await practicesRes.json();
      const vratasData = await vratasRes.json();
      const fastingData = await fastingRes.json();
      const progressData = await progressRes.json();

      const today = new Date();
      const todayDayName = today.toLocaleDateString('en-US', { weekday: 'short' });
      const scheduleWithDates = (fastingData.schedule || []).map((day: FastingDay, index: number) => {
        const date = new Date();
        date.setDate(date.getDate() - today.getDay() + index + 1);
        return {
          ...day,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isToday: day.day === todayDayName,
        };
      });

      setPractices(practicesData.practices || []);
      setVratas(vratasData.vratas || []);
      setFastingSchedule(scheduleWithDates);
      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching practice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePractice = async (practiceId: number) => {
    try {
      const practice = practices.find(p => p.id === practiceId);
      const isCurrentlyCompleted = practice?.status === 'completed';
      const newStatus = isCurrentlyCompleted ? 'pending' : 'completed';

      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete-practice',
          practiceId,
          completed: !isCurrentlyCompleted,
        }),
      });

      if (response.ok) {
        setPractices((prev) =>
          prev.map((p) => (p.id === practiceId ? { ...p, status: newStatus } : p))
        );
        fetch('/api/practice?type=progress').then(r => r.json()).then(data => setProgress(data));
      }
    } catch (error) {
      console.error('Error completing practice:', error);
    }
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim()) return;

    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-reflection',
          reflection,
        }),
      });

      if (response.ok) {
        setReflection("");
        alert("Reflection saved successfully!");
      }
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your practices...</p>
        </div>
      </div>
    );
  }
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
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-saffron-600 to-gold-500 bg-clip-text text-transparent"
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
          <div id="practices" className="scroll-mt-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Today's Practices
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Your spiritual routine for today
            </p>
            <div className="space-y-4">
              {practices.map((practice, index) => (
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
                          className="text-3xl sm:text-4xl"
                        >
                          {practice.icon}
                        </motion.span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {practice.title}
                            {practice.titleJain && (
                              <span className="ml-2 text-sm font-normal text-saffron-600">
                                ({practice.titleJain})
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{practice.time}</p>
                          {practice.description && (
                            <p className="text-xs text-gray-500 mt-1">{practice.description}</p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleCompletePractice(practice.id)}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                        className="text-3xl cursor-pointer focus:outline-none"
                      >
                        {practice.status === "completed" && "✅"}
                        {practice.status === "pending" && "⏰"}
                        {practice.status === "active" && "🔒"}
                        {practice.status === "scheduled" && "📅"}
                      </motion.button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div id="vrata" className="relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-saffron-100/50 via-transparent to-gold-100/50 rounded-3xl blur-3xl" />
            <Card className="relative border-2 border-saffron-200 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-saffron-600" />
                  Vrata Tracker
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
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
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-gray-900">🔒 {vrata.name}</h3>
                      <span className="text-sm text-gray-600 font-medium">
                        Day: {vrata.day}/{vrata.totalDays}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{vrata.description}</p>
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
          <div id="fasting" className="relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-jainGreen-100/50 via-transparent to-teal-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jainGreen-400 via-teal-400 to-jainGreen-500" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-jainGreen-600" />
                      Fasting Schedule
                    </CardTitle>
                    <CardDescription className="text-base mt-1">This Week's Observance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                    <p key={dayName} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {dayName}
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {fastingSchedule.map((day, index) => {
                    const getFastingTypeInfo = (type: string) => {
                      switch (type) {
                        case 'Ekasan':
                          return { icon: '🍽️', color: 'from-saffron-400 to-orange-400', bg: 'from-saffron-50 to-orange-50', border: 'border-saffron-300', description: 'One meal a day' };
                        case 'Biasan':
                          return { icon: '🥗', color: 'from-green-400 to-emerald-400', bg: 'from-green-50 to-emerald-50', border: 'border-green-300', description: 'Two meals a day' };
                        case 'Chauvihar':
                          return { icon: '🌙', color: 'from-purple-400 to-indigo-400', bg: 'from-purple-50 to-indigo-50', border: 'border-purple-300', description: 'No food after sunset' };
                        default:
                          return { icon: '🙏', color: 'from-gray-400 to-gray-400', bg: 'from-gray-50 to-gray-50', border: 'border-gray-300', description: type };
                      }
                    };

                    const typeInfo = getFastingTypeInfo(day.type);
                    
                    return (
                      <FadeIn key={index} delay={index * 0.05}>
                        <motion.div
                          whileHover={{ scale: 1.08, y: -6 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative p-3 rounded-xl text-center shadow-md hover:shadow-xl transition-all duration-300 border-2 cursor-pointer group",
                            day.isToday 
                              ? `bg-gradient-to-br ${typeInfo.bg} ${typeInfo.border} ring-2 ring-jainGreen-400 ring-offset-2` 
                              : `bg-white ${typeInfo.border}`
                          )}
                        >
                          {day.isToday && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-3 h-3 bg-jainGreen-500 rounded-full ring-2 ring-white"
                            />
                          )}
                          <p className={cn(
                            "text-xs font-bold mb-1",
                            day.isToday ? "text-jainGreen-700" : "text-gray-600"
                          )}>
                            {day.day}
                          </p>
                          <p className={cn(
                            "text-[10px] text-gray-500 mb-2",
                            day.isToday && "font-semibold"
                          )}>
                            {day.date}
                          </p>
                          <div className={cn(
                            "text-2xl mb-2 transform transition-transform group-hover:scale-110",
                            day.isToday && "scale-110"
                          )}>
                            {typeInfo.icon}
                          </div>
                          <p className={cn(
                            "text-xs font-bold leading-tight",
                            day.type === 'Ekasan' && "text-saffron-700",
                            day.type === 'Biasan' && "text-green-700",
                            day.type === 'Chauvihar' && "text-purple-700"
                          )}>
                            {day.type}
                          </p>
                          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity rounded-xl" 
                            style={{ background: `linear-gradient(135deg, ${typeInfo.color.replace('from-', '').replace(' to-', ',')})` }}
                          />
                        </motion.div>
                      </FadeIn>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-jainGreen-200">
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-saffron-400 to-orange-400"></div>
                      <span className="text-gray-600">Ekasan</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"></div>
                      <span className="text-gray-600">Biasan</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                      <span className="text-gray-600">Chauvihar</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-jainGreen-50 hover:border-jainGreen-300 rounded-xl">
                    <Calendar className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
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
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">💭 Reflections</CardTitle>
                <CardDescription className="text-base">Daily Reflection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 font-medium">
                  How did you practice Ahimsa today?
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all bg-white/80 backdrop-blur-sm"
                  placeholder="Write your reflection here..."
                />
                <Button 
                  onClick={handleSaveReflection}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl hover:scale-105 transition-all rounded-xl"
                >
                  Save Reflection
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.5}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Progress
            </h2>
            <div className="space-y-4">
              {[
                { icon: Flame, label: "Streak", value: `${progress.streak} days`, color: "saffron", bg: "from-saffron-50 to-orange-50", border: "border-saffron-200" },
                { icon: TrendingUp, label: "This Month", value: `${progress.thisMonth} practices`, color: "jainGreen", bg: "from-jainGreen-50 to-teal-50", border: "border-jainGreen-200" },
                { icon: Award, label: "Vratas Completed", value: `${progress.vratasCompleted}`, color: "gold", bg: "from-gold-50 to-yellow-50", border: "border-gold-200" },
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
                      <p className={`text-xl sm:text-2xl font-bold text-${stat.color}-600`}>
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
