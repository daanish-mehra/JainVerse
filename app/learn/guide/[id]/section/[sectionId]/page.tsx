"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Brain, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
}

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id as string;
  const sectionId = parseInt(params.sectionId as string);
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatedText, setGeneratedText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSection();
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [guideId, sectionId]);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/learn/guide/${guideId}/section/${sectionId}`);
      if (!response.ok) throw new Error("Failed to fetch section");
      const data = await response.json();
      setSection(data);
      
      // Use existing summary immediately, then enhance with chatbot
      const initialText = (data.summary || `Learn about ${data.title} in Jain philosophy.`).replace(/\s*\.{3,}\s*$/, "").trim();
      setDisplayedText(initialText);
      setGeneratedText(initialText);
      
      // Generate enhanced text and quiz in parallel for faster loading
      Promise.all([
        generateSectionText(data.title, initialText),
        generateQuizFromText(initialText, data.title)
      ]).catch(error => {
        console.error("Error generating content:", error);
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching section:", error);
      setLoading(false);
    }
  };

  const generateSectionText = async (title: string, existingSummary: string) => {
    try {
      // Use chatbot API to generate comprehensive text based on section topic
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide a comprehensive, detailed explanation about "${title}" in Jainism. Include key concepts, principles, historical context, and practical applications. Make it educational and engaging, suitable for learners. Keep it concise (300-400 words).

IMPORTANT: 
- Write only educational content about the topic
- Do NOT include questions, quizzes, or numbered lists
- Do NOT include contact information, addresses, or emails
- Do NOT include website URLs or organization details
- Write in clear, flowing paragraphs
- Focus on explaining the concepts and teachings`,
          language: 'EN',
          mode: 'intermediate',
        }),
      });

      const data = await response.json();
      let text = data.text || data.message || existingSummary;
      
      // Clean the generated text to remove unwanted content
      if (text) {
        text = text.replace(/Jainworld is a non-profit organization[^\n]*/gi, "");
        text = text.replace(/715 Bellemeade Place[^\n]*/gi, "");
        text = text.replace(/Email: info@jainworld\.com[^\n]*/gi, "");
        text = text.replace(/Since\.{3,}\s*\d{4}[^\n]*/gi, "");
        text = text.replace(/Questions?:\s*/gi, "");
        text = text.replace(/\d+\)\s*[^\n]+/g, ""); // Remove numbered questions
        text = text.replace(/\d+\s+[A-Z][a-z]+\s+(Place|Street|Avenue|Road|Drive|Lane|Boulevard)[^,]*,\s*[A-Z]{2}\s+\d{5}/gi, "");
        text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "");
        text = text.replace(/https?:\/\/[^\s]+/g, "");
        text = text.replace(/\n{3,}/g, "\n\n");
        text = text.trim();
      }
      
      if (text && text.length > 0) {
        // Remove any trailing ellipsis that might indicate truncation
        text = text.replace(/\s*\.{3,}\s*$/, "").trim();
        
        setGeneratedText(text);
        
        // Always update displayed text - either by typing or directly
        const currentDisplayed = displayedText || "";
        
        // If we have new content to type, start typing animation
        if (text !== currentDisplayed && text.length > currentDisplayed.length) {
          setIsTyping(true);
          let currentIndex = currentDisplayed.length;
          
          // Clear any existing interval
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
          
          typingIntervalRef.current = setInterval(() => {
            if (currentIndex < text.length) {
              currentIndex++;
              // Always update to show current progress
              setDisplayedText(text.substring(0, currentIndex));
            } else {
              // We've reached the end - force complete and stop
              setDisplayedText(text); // Ensure full text is displayed
              setIsTyping(false);
              
              if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
              }
            }
          }, 10); // Faster typing: 10ms per character
        } else {
          // If text is same or shorter, or if we already have it, just set directly
          setDisplayedText(text);
          setIsTyping(false);
          
          // Clear any running interval
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error generating section text:", error);
      // Keep existing text
    }
  };

  const generateQuizFromText = async (text: string, title: string) => {
    try {
      const response = await fetch('/api/learn/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.substring(0, 2000), // Limit text for faster processing
          title,
        }),
      });

      const data = await response.json();
      if (data.quiz) {
        setQuizzes([data.quiz]);
      } else {
        throw new Error("No quiz in response");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      // Fallback quiz
      setQuizzes([{
        question: `What is the main concept covered in "${title}"?`,
        options: [
          "A key Jain principle",
          "A historical event",
          "A meditation technique",
          "A prayer or mantra",
        ],
        correct: 0,
        explanation: `This section covers important concepts related to ${title} in Jain philosophy.`,
        source: title,
      }]);
    }
  };

  const handleQuizAnswer = async (answerIndex: number) => {
    if (!quizzes[currentQuizIndex]) return;
    setSelectedQuizAnswer(answerIndex);
    const isCorrect = answerIndex === quizzes[currentQuizIndex].correct;
    setQuizResult(isCorrect);

    if (isCorrect) {
      try {
        await fetch('/api/learn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit-quiz',
            quizId: `guide-${guideId}-section-${sectionId}`,
            answer: answerIndex,
          }),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedQuizAnswer(null);
      setQuizResult(null);
    }
  };

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      setSelectedQuizAnswer(null);
      setQuizResult(null);
    }
  };

  const handleSwipeStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleSwipeEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentQuizIndex < quizzes.length - 1) {
      handleNextQuiz();
    }
    if (isRightSwipe && currentQuizIndex > 0) {
      handlePrevQuiz();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleSectionComplete = async () => {
    try {
      const response = await fetch(`/api/learn/guide/${guideId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-module",
          moduleId: sectionId,
        }),
      });

      if (response.ok) {
        router.push(`/learn/guide/${guideId}`);
      }
    } catch (error) {
      console.error("Error completing section:", error);
    }
  };

  if (loading && !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Section not found</p>
          <Link href={`/learn/guide/${guideId}`}>
            <Button>Back to Guide</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white via-ivory-50 to-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href={`/learn/guide/${guideId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{section.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <Card className="bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-jainGreen-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 min-h-[200px]">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-2 h-5 bg-saffron-500 ml-1"
                    />
                  )}
                </div>
                {!isTyping && displayedText && quizzes.length === 0 && (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-sm text-gray-500">Generating quiz...</p>
                    <div className="w-6 h-6 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin ml-2"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {quizzes.length > 0 && !isTyping && (
          <ScrollReveal direction="up" delay={0.1}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      Quiz
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-700">
                      Question {currentQuizIndex + 1} of {quizzes.length}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevQuiz}
                      disabled={currentQuizIndex === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextQuiz}
                      disabled={currentQuizIndex >= quizzes.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {quizzes[currentQuizIndex] && (
                  <motion.div
                    key={currentQuizIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    onTouchStart={handleSwipeStart}
                    onTouchMove={handleSwipeMove}
                    onTouchEnd={handleSwipeEnd}
                    className="space-y-4"
                  >
                    <p className="font-semibold text-lg text-gray-900">
                      {quizzes[currentQuizIndex].question}
                    </p>
                    <div className="space-y-3">
                      {quizzes[currentQuizIndex].options.map((option: string, index: number) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedQuizAnswer !== null}
                          whileHover={{ scale: selectedQuizAnswer === null ? 1.02 : 1 }}
                          whileTap={{ scale: selectedQuizAnswer === null ? 0.98 : 1 }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium",
                            selectedQuizAnswer === index
                              ? quizResult
                                ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                                : "bg-red-100 border-red-500 text-red-700 shadow-lg"
                              : selectedQuizAnswer !== null && index === quizzes[currentQuizIndex].correct
                              ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                              : "bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedQuizAnswer === index && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {quizResult ? "✅" : "❌"}
                              </motion.span>
                            )}
                            {selectedQuizAnswer !== null && index === quizzes[currentQuizIndex].correct && selectedQuizAnswer !== index && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                ✅
                              </motion.span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {selectedQuizAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-4 rounded-xl space-y-2",
                          quizResult ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
                        )}
                      >
                        <p className="font-semibold text-lg">
                          {quizResult ? "🎉 Correct! Great job! +10 Punya Points!" : "💡 That's not quite right. The correct answer is highlighted."}
                        </p>
                        {quizzes[currentQuizIndex].explanation && (
                          <p className="text-sm mt-2">{quizzes[currentQuizIndex].explanation}</p>
                        )}
                      </motion.div>
                    )}
                    {quizzes.length > 1 && (
                      <div className="flex justify-center space-x-2 mt-4">
                        {quizzes.map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              idx === currentQuizIndex ? "w-8 bg-purple-500" : "w-2 bg-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {!isTyping && displayedText && quizzes.length > 0 && (
          <ScrollReveal direction="up" delay={0.2}>
            <Button
              onClick={handleSectionComplete}
              className="bg-gradient-to-r from-saffron-500 to-gold-500 w-full"
            >
              Mark as Complete
              <Trophy className="w-4 h-4 ml-2" />
            </Button>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
