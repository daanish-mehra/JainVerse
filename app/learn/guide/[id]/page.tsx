"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Lock, Trophy, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";

interface Module {
  id: number;
  title: string;
  articles: any[];
  completed: boolean;
  progress: number;
  totalArticles: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  progress: number;
  modules: Module[];
  currentModule: number;
  completedModules: number[];
}

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [guideId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${guideId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId: number) => {
    router.push(`/learn/guide/${guideId}/section/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <Link href="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/learn">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-saffron-50 to-gold-50 border-2 border-saffron-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-saffron-600" />
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-700 mt-2">
                    {course.description}
                  </CardDescription>
                </div>
                <span className="text-xs bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full font-medium">
                  {course.level}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Overall Progress</span>
                    <span className="font-semibold text-saffron-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500 h-3 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Trophy className="w-4 h-4 mr-2 text-saffron-600" />
                  <span>
                    {course.completedModules?.length || 0} of {course.modules?.length || 0} modules completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Modules</h2>
            <div className="space-y-4">
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((module, index) => {
                  const isLocked = index > (course.currentModule || 0) && !module.completed;
                  const isCompleted = module.completed;
                  
                  return (
                    <ScrollReveal key={module.id} direction="left" delay={index * 0.1}>
                      <motion.div
                        whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                        className="relative"
                      >
                        <Card
                          className={`relative border-2 transition-all duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                              : isLocked
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-white border-gray-100 hover:border-saffron-200 hover:shadow-xl"
                          }`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {isCompleted ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isLocked ? (
                                  <Lock className="w-6 h-6 text-gray-400" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                )}
                                <CardTitle className="text-xl font-bold text-gray-900">
                                  {module.title}
                                </CardTitle>
                              </div>
                            </div>
                            <CardDescription className="text-sm text-gray-600 mt-2">
                              {module.progress} of {module.totalArticles} articles completed
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">Module Progress</span>
                                  <span className="font-semibold text-saffron-600">
                                    {module.totalArticles > 0
                                      ? Math.round((module.progress / module.totalArticles) * 100)
                                      : 0}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${
                                        module.totalArticles > 0
                                          ? (module.progress / module.totalArticles) * 100
                                          : 0
                                      }%`,
                                    }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`h-2 rounded-full ${
                                      isCompleted
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                        : "bg-gradient-to-r from-saffron-400 to-gold-400"
                                    }`}
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={() => handleModuleClick(module.id)}
                                disabled={isLocked}
                                className={`w-full ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    : isLocked
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-saffron-500 to-gold-500 hover:shadow-xl hover:scale-105"
                                } transition-all`}
                              >
                                {isCompleted ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Review Module
                                  </>
                                ) : isLocked ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Locked
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Learning
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </ScrollReveal>
                  );
                })
              ) : (
                <Card className="bg-white border-2 border-gray-200">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">No modules available for this course.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

