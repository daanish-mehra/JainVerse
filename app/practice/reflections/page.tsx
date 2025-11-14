"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface Reflection {
  id: string;
  text: string;
  date: string;
  createdAt: string;
  timestamp: number;
}

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      const response = await fetch("/api/practice?type=reflections");
      if (!response.ok) throw new Error("Failed to fetch reflections");
      const data = await response.json();
      setReflections(data.reflections || []);
    } catch (error) {
      console.error("Error fetching reflections:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupReflectionsByDate = (reflections: Reflection[]) => {
    const grouped: { [key: string]: Reflection[] } = {};
    
    reflections.forEach((reflection) => {
      const dateKey = formatDate(reflection.createdAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(reflection);
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reflections...</p>
        </div>
      </div>
    );
  }

  const groupedReflections = groupReflectionsByDate(reflections);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/practice">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">💭 Past Reflections</h1>
            <p className="text-sm text-gray-600">
              {reflections.length} {reflections.length === 1 ? "reflection" : "reflections"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        {reflections.length === 0 ? (
          <ScrollReveal direction="up" delay={0}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reflections yet</h3>
                <p className="text-gray-600 mb-6">
                  Start your journey by writing your first reflection on the Practice page.
                </p>
                <Link href="/practice">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl">
                    Go to Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>
        ) : (
          Object.entries(groupedReflections)
            .sort(([, reflectionsA], [, reflectionsB]) => {
              const dateA = new Date(reflectionsA[0].createdAt).getTime();
              const dateB = new Date(reflectionsB[0].createdAt).getTime();
              return dateB - dateA;
            })
            .map(([date, dateReflections], dateIndex) => (
              <ScrollReveal key={date} direction="up" delay={dateIndex * 0.1}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">{date}</h2>
                    <span className="text-sm text-gray-500">
                      ({dateReflections.length} {dateReflections.length === 1 ? "reflection" : "reflections"})
                    </span>
                  </div>
                  {dateReflections.map((reflection, index) => (
                    <motion.div
                      key={reflection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-purple-600" />
                              {formatTime(reflection.createdAt)}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {reflection.text}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>
            ))
        )}
      </div>
    </div>
  );
}

