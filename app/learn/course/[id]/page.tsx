"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Circle, ChevronRight, ArrowLeft, Trophy } from "lucide-react";
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
  modules: Module[];
  progress: number;
  currentModule: number;
  completedModules: number[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch guide");
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching guide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module: Module) => {
    router.push(`/learn/guide/${courseId}/section/${module.id}`);
  };

  const getNextIncompleteModule = () => {
    if (!course) return null;
    return course.modules.find((m) => !m.completed) || course.modules[course.modules.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guide...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
                  <p className="text-gray-600 mb-4">Guide not found</p>
          <Link href="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextModule = getNextIncompleteModule();

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/learn">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-saffron-50 to-gold-50 border-2 border-saffron-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {course.title}
              </CardTitle>
              <CardDescription className="text-base text-gray-700">
                Daily guide for learning and practicing Jain principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Guide Progress</span>
                    <span className="font-bold text-saffron-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-saffron-400 to-gold-500 h-3 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedModules.length} of {course.modules.length} sections completed
                  </p>
                </div>
                {nextModule && (
                  <Button
                    onClick={() => handleModuleClick(nextModule)}
                    className="w-full bg-gradient-to-r from-saffron-500 to-gold-500 hover:shadow-xl"
                  >
                    Continue Learning: {nextModule.title}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sections</h2>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <ScrollReveal key={module.id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="cursor-pointer"
                    onClick={() => handleModuleClick(module)}
                  >
                    <Card className={`border-2 transition-all duration-300 ${
                      module.completed
                        ? "bg-green-50 border-green-200"
                        : module.id === course.currentModule
                        ? "bg-saffron-50 border-saffron-200"
                        : "bg-white border-gray-200"
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              module.completed
                                ? "bg-green-500"
                                : module.id === course.currentModule
                                ? "bg-saffron-500"
                                : "bg-gray-300"
                            }`}>
                              {module.completed ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <Circle className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {module.id + 1}. {module.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {module.completed ? "Completed" : "Ready to learn"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

