"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Brain, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Notification } from "@/components/ui/notification";
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
  const typingCharIndexRef = useRef<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

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
      
      // Handle quizzes - can be single quiz object or array of quizzes
      if (data.quizzes && Array.isArray(data.quizzes)) {
        setQuizzes(data.quizzes);
      } else if (data.quiz) {
        if (Array.isArray(data.quiz)) {
          setQuizzes(data.quiz);
        } else {
          setQuizzes([data.quiz]);
        }
      }
      
      // Use existing summary immediately, then enhance with chatbot
      // Ensure we have meaningful content (at least 100 chars), otherwise use a better fallback
      let initialText = data.summary || "";
      if (!initialText || initialText.length < 100) {
        // Special handling for Mahavira
        if (data.title.toLowerCase().includes('mahavira')) {
          initialText = `Lord Mahavira, also known as Vardhamana, was the 24th and last Tirthankara (spiritual teacher) of Jainism. Born in 599 BCE in present-day Bihar, India, he is considered the founder of Jainism in its current form. Mahavira renounced his royal life at age 30 and spent 12 years in deep meditation and rigorous ascetic practices, attaining perfect knowledge (kevala jnana) at the age of 42. He then spent the next 30 years teaching the principles of Jainism, emphasizing Ahimsa (non-violence), truth, non-stealing, celibacy, and non-attachment. His teachings form the foundation of Jain philosophy, and he is revered as one of the greatest spiritual teachers in Jain tradition. Mahavira attained moksha (liberation) in 527 BCE at the age of 72.`;
        } else {
          initialText = `${data.title} is an important aspect of Jain philosophy. This section explores the fundamental concepts, teachings, and practices related to ${data.title}, providing valuable insights into this essential topic.`;
        }
      }
      initialText = initialText.replace(/\s*\.{3,}\s*$/, "").trim();
      
      // Start typing animation immediately with the initial text
      setGeneratedText(initialText);
      setDisplayedText(""); // Start with empty text
      setIsTyping(true);
      typingCharIndexRef.current = 0;
      
      // Clear any existing interval
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      // Start typing animation for initial text - slower and smoother
      typingIntervalRef.current = setInterval(() => {
        if (typingCharIndexRef.current < initialText.length) {
          typingCharIndexRef.current++;
          setDisplayedText(initialText.substring(0, typingCharIndexRef.current));
        } else {
          // Animation complete
          setDisplayedText(initialText); // Ensure full text is displayed
          setIsTyping(false);
          
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }
      }, 20); // 20ms per character for smooth, readable typing effect
      
      // Generate enhanced text and quiz in parallel for faster loading (non-blocking)
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
              // Skip AI generation if we already have substantial content (faster and better)
              // Only enhance if we have less than 800 chars (meaningful content threshold)
              if (existingSummary && existingSummary.length > 800) {
                // We have good content, no need to call Gemini
                return;
              }
              
              // Only call Gemini if we have at least some content (not just fallback)
              // If summary is the generic fallback, skip Gemini (it's likely to fail anyway)
              const isGenericFallback = existingSummary.includes("is an important") || 
                                       existingSummary.includes("This section explores") ||
                                       existingSummary.includes("fundamental concepts");
              
              if (isGenericFallback && existingSummary.length < 300) {
                // This is a generic fallback, don't waste time calling Gemini
                console.log("Skipping Gemini - using fallback content");
                return;
              }
              
              // Use chatbot API to enhance the existing content
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
              
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                  message: `Based on the following information about "${title}", provide a clear, concise explanation (200-300 words):

${existingSummary.substring(0, 1500)}

Provide an educational explanation that:
- Explains the topic clearly and accurately
- Uses only educational content
- Does NOT include questions, quizzes, numbered lists, contact info, addresses, emails, or URLs
- Writes in clear, flowing paragraphs
- Focuses on concepts and teachings`,
                  language: 'EN',
                  mode: 'intermediate',
                }),
              });
              
              clearTimeout(timeoutId);
              
              // Check if response is not ok (including 503 errors)
              if (!response.ok) {
                // For 503 or other errors, just use existing summary
                console.warn(`Chat API returned ${response.status}, using existing summary`);
                return;
              }

              const data = await response.json();
              let text = data.text || data.message || existingSummary;
              
              // If the response indicates service unavailable, use existing summary
              if (!text || text.includes('experiencing high traffic') || text.includes('temporarily unavailable') || text.includes('try again')) {
                console.warn('AI service unavailable, using existing summary');
                return;
              }
      
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
          }, 20); // Smooth typing: 20ms per character for better readability
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
            } catch (error: any) {
              // Don't log timeout or abort errors - they're expected
              if (error?.name !== 'AbortError' && !error?.message?.includes('503')) {
                console.warn("Error generating section text (using cached content):", error?.message || error);
              }
              // Always keep existing text - never fail silently
              // The existing summary will be displayed
            }
          };

  const generateQuizFromText = async (text: string, title: string) => {
    // Only generate if we don't already have quizzes from API
    if (quizzes.length >= 2) {
      return; // Already have quizzes from the API response
    }
    
    try {
      // Try to generate a second quiz if we only have 1
      if (quizzes.length === 1) {
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
          // Add the new quiz to existing quizzes
          setQuizzes(prev => [...prev, data.quiz]);
        }
      }
    } catch (error: any) {
      // Don't log 503 errors - they're expected
      if (!error?.message?.includes('503') && !error?.message?.includes('overloaded')) {
        console.warn("Error generating additional quiz:", error?.message || error);
      }
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
      setSelectedQuizAnswer(null);
      setQuizResult(null);
      // Use setTimeout to allow exit animation to play
      setTimeout(() => {
        setCurrentQuizIndex(prev => prev + 1);
      }, 150);
    }
  };

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setSelectedQuizAnswer(null);
      setQuizResult(null);
      // Use setTimeout to allow exit animation to play
      setTimeout(() => {
        setCurrentQuizIndex(prev => prev - 1);
      }, 150);
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
          action: "complete-section",
          sectionId: sectionId,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state to show completion
        setSection((prev: any) => prev ? { ...prev, completed: true } : null);
        
        // Show animated notification
        setNotificationMessage(data.message || "Section completed! +15 Punya Points!");
        setShowNotification(true);
        
        // Redirect to guide page after notification duration
        setTimeout(() => {
        router.push(`/learn/guide/${guideId}`);
        }, 3500); // Slightly longer than notification duration
      } else {
        console.error("Failed to complete section:", data.error || "Unknown error");
        setNotificationMessage("Failed to mark section as complete. Please try again.");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error completing section:", error);
      setNotificationMessage("An error occurred while completing the section. Please try again.");
      setShowNotification(true);
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
    <>
      {/* Animated Notification */}
      <Notification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        duration={4000}
      />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              duration: 0.6 
            }}
          >
            <Card className="bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200 shadow-lg hover:shadow-xl transition-shadow duration-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-jainGreen-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <motion.div 
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 min-h-[200px] text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                        className="inline-block w-2 h-5 bg-saffron-500 ml-1 rounded-sm"
                      />
                    )}
                  </motion.div>
                  {!isTyping && displayedText && quizzes.length === 0 && (
                    <motion.div 
                      className="flex items-center justify-center py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-gray-500">Generating quiz...</p>
                      <motion.div 
                        className="w-6 h-6 border-2 border-saffron-500 border-t-transparent rounded-full ml-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>

        {quizzes.length > 0 && !isTyping && (
          <ScrollReveal direction="up" delay={0.1}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                duration: 0.6,
                delay: 0.2
              }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-500">
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
                {quizzes.length > 0 ? (
                  <AnimatePresence mode="wait">
                    {quizzes[currentQuizIndex] && (
                      <motion.div
                        key={currentQuizIndex}
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 30,
                          duration: 0.5 
                        }}
                        onTouchStart={handleSwipeStart}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={handleSwipeEnd}
                        className="space-y-4"
                      >
                        <motion.p 
                          className="font-semibold text-lg sm:text-xl text-gray-900 leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          ❓ {quizzes[currentQuizIndex].question}
                        </motion.p>
                        <div className="space-y-3">
                          {quizzes[currentQuizIndex].options.map((option: string, index: number) => (
                            <motion.button
                              key={index}
                              onClick={() => handleQuizAnswer(index)}
                              disabled={selectedQuizAnswer !== null}
                              whileHover={{ 
                                scale: selectedQuizAnswer === null ? 1.02 : 1,
                                x: selectedQuizAnswer === null ? 4 : 0,
                              }}
                              whileTap={{ scale: selectedQuizAnswer === null ? 0.98 : 1 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 25 
                              }}
                              className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-500 ease-out font-medium",
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
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 25,
                              duration: 0.5 
                            }}
                            className={cn(
                              "p-5 rounded-xl space-y-2 shadow-md",
                              quizResult ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
                            )}
                          >
                            <motion.p 
                              className="font-semibold text-lg"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                            >
                              {quizResult ? "🎉 Correct! Great job! +10 Punya Points!" : "💡 That's not quite right. The correct answer is highlighted."}
                            </motion.p>
                            {quizzes[currentQuizIndex].explanation && (
                              <motion.p 
                                className="text-sm mt-2 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                              >
                                {quizzes[currentQuizIndex].explanation}
                              </motion.p>
                            )}
                          </motion.div>
                        )}
                        {quizzes.length > 1 && (
                          <motion.div 
                            className="flex justify-center space-x-2 mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {quizzes.map((_, idx) => (
                              <motion.div
                                key={idx}
                                className={`h-2 rounded-full ${
                                  idx === currentQuizIndex ? "bg-purple-500" : "bg-gray-300"
                                }`}
                                initial={{ width: idx === currentQuizIndex ? 8 : 2 }}
                                animate={{ 
                                  width: idx === currentQuizIndex ? 32 : 8,
                                  scale: idx === currentQuizIndex ? 1.2 : 1
                                }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 400, 
                                  damping: 25,
                                  duration: 0.4 
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <p className="text-center text-gray-600 py-8">No quiz available for this section.</p>
                )}
              </CardContent>
            </Card>
            </motion.div>
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
    </>
  );
}
