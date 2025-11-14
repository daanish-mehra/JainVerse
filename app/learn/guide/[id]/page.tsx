"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, Trophy, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id as string;
  const [guide, setGuide] = useState<any>(null);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuide();
    fetchProgress();
  }, [guideId]);

  const fetchGuide = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${guideId}`);
      if (!response.ok) throw new Error("Failed to fetch guide");
      const data = await response.json();
      setGuide(data);
    } catch (error) {
      console.error("Error fetching guide:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/learn?type=progress');
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        
        // Extract completed sections for this guide
        if (data.completedSections) {
          const completed = new Set<number>();
          const sectionKeyPrefix = `guide-${guideId}-section-`;
          
          Object.keys(data.completedSections).forEach((key) => {
            if (key.startsWith(sectionKeyPrefix)) {
              const sectionId = parseInt(key.replace(sectionKeyPrefix, ''));
              if (!isNaN(sectionId)) {
                completed.add(sectionId);
              }
            }
          });
          
          setCompletedSections(completed);
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Refresh progress when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchProgress();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [guideId]);

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

  if (!guide) {
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
            <h1 className="text-xl font-bold text-gray-900">{guide.title}</h1>
            <p className="text-sm text-gray-600">{guide.description}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-saffron-50 via-gold-50 to-saffron-50 border-2 border-saffron-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-saffron-600" />
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-700 mt-2">
                    {guide.description}
                  </CardDescription>
                </div>
                <span className="text-xs bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full font-medium">
                  {guide.level}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-bold text-saffron-600">
                    {guide.modules && guide.modules.length > 0
                      ? Math.round((completedSections.size / guide.modules.length) * 100)
                      : guide.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${guide.modules && guide.modules.length > 0
                        ? (completedSections.size / guide.modules.length) * 100
                        : guide.progress || 0}%` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500 h-3 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>🏅 {guide.badges}/{guide.totalBadges} Badges</span>
                  <span>{completedSections.size}/{guide.modules?.length || 0} Sections Completed</span>
                </div>
                {progress && (
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                    <span>✨ {progress.punyaPoints || 0} Punya Points</span>
                    <span>Level {progress.level || 1}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sections</h2>
            <p className="text-gray-600 mb-6">
              Complete each section to progress through this guide. Each section includes a summary and quiz.
            </p>
            <div className="space-y-4">
              {guide.modules && guide.modules.length > 0 ? (
                guide.modules.map((module: string, index: number) => {
                  const sectionId = index + 1;
                  return (
                    <ScrollReveal key={sectionId} direction="left" delay={index * 0.1}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="relative"
                      >
                        <Link href={`/learn/guide/${guideId}/section/${sectionId}`}>
                          <Card className="border-2 border-gray-100 hover:border-saffron-200 transition-all duration-300 bg-white hover:shadow-xl cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                  {completedSections.has(sectionId) ? (
                                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                                      <CheckCircle className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                                      {sectionId}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h3 className={`font-bold text-lg ${
                                      completedSections.has(sectionId) ? 'text-green-700' : 'text-gray-900'
                                    }`}>
                                      {module}
                                    </h3>
                                    {completedSections.has(sectionId) && (
                                      <p className="text-sm text-green-600 mt-1">✓ Completed</p>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                                  completedSections.has(sectionId) ? 'text-green-500' : 'text-gray-400'
                                }`} />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    </ScrollReveal>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-600">
                    No sections available for this guide.
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
