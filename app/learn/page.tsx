"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, BookOpen, Brain, Target, CheckCircle, XCircle, Sparkles, ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";

interface LearningPath {
  id: number;
  title: string;
  progress: number;
  badges: number;
  totalBadges: number;
  level: string;
  description: string;
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  source?: string;
  topic?: string;
}

interface Story {
  id: number;
  title: string;
  age: string;
  rating: number;
  pages: number;
  description?: string;
  content?: string;
}

interface Achievement {
  id: number;
  title: string;
  icon: string;
  earned: boolean;
  description?: string;
}

export default function LearnPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [punyaPoints, setPunyaPoints] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [narratingStoryId, setNarratingStoryId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [storyContent, setStoryContent] = useState<string>("");
  const [loadingStory, setLoadingStory] = useState(false);
  const [moralDilemma, setMoralDilemma] = useState<any>(null);
  const [loadingDilemma, setLoadingDilemma] = useState(false);
  const [selectedDilemmaOption, setSelectedDilemmaOption] = useState<number | null>(null);

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
      setLoading(true);
      // Load critical data first, then load other data
      const [pathsRes, achievementsRes, progressRes] = await Promise.all([
        fetch('/api/learn?type=paths'),
        fetch('/api/learn?type=achievements'),
        fetch('/api/learn?type=progress'),
      ]);
      
      const pathsData = await pathsRes.json();
      const achievementsData = await achievementsRes.json();
      const progressData = await progressRes.json();

      setLearningPaths(pathsData.paths || []);
      setAchievements(achievementsData.achievements || []);
      setPunyaPoints(progressData.punyaPoints || 0);
      
      // Set loading to false early for better UX
      setLoading(false);
      
      // Load non-critical data in background
      const [quizzesRes, storiesRes] = await Promise.all([
        fetch('/api/learn?type=quizzes'),
        fetch('/api/learn?type=stories'),
      ]);

      const quizzesData = await quizzesRes.json();
      const storiesData = await storiesRes.json();
      setQuizzes(quizzesData.quizzes || []);
      setStories(storiesData.stories || []);
    } catch (error) {
      console.error('Error fetching learn data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = async (quizId: number, answerIndex: number) => {
    setSelectedQuiz(quizId);
    setSelectedAnswer(answerIndex);

    try {
      const response = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit-quiz',
          quizId,
          answer: answerIndex,
        }),
      });

      const result = await response.json();
      setQuizResult(result.correct);
      
      if (result.correct) {
        setPunyaPoints((prev) => prev + (result.points || 10));
      }

      const quiz = quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.explanation = result.explanation;
        quiz.source = result.source;
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedQuiz(null);
      setSelectedAnswer(null);
      setQuizResult(null);
    }
  };

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      setSelectedQuiz(null);
      setSelectedAnswer(null);
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

  const handleReadStory = async (story: Story) => {
    setSelectedStory(story);
    setIsStoryDialogOpen(true);
    
    // If story already has content, use it
    if (story.content && story.content.trim().length > 0) {
      setStoryContent(story.content);
      return;
    }
    
    // If story has description, use it as fallback
    if (story.description && story.description.trim().length > 0) {
      setStoryContent(story.description);
      return;
    }
    
    // Otherwise show a placeholder message
    setStoryContent(`This story is about ${story.title}. The full content will be available soon.`);
  };

  const handleNarrateStory = async (story: Story) => {
    if (narratingStoryId === story.id && audioUrl) {
      // Toggle pause/play
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch((err) => {
            console.error('Error resuming audio:', err);
            alert('Failed to play audio. Please check your browser settings.');
          });
        } else {
          audioRef.current.pause();
        }
      }
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Use story content, description, or title for narration
    const textToNarrate = story.content || story.description || story.title || 'This story is not available for narration.';
    
    setNarratingStoryId(story.id);
    setAudioUrl(null);
    
    try {
      console.log('Fetching narration for story:', story.id);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/stories/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToNarrate.substring(0, 2000), // Limit to 2000 chars for faster generation
          storyId: story.id,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', { success: data.success, hasAudio: !!data.audio, audioLength: data.audio?.length });

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Server returned ${response.status}`;
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      if (data.success && data.audio) {
        console.log('Setting audio URL, length:', data.audio.length);
        setAudioUrl(data.audio);
        
        // Create and configure audio
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        
        // Set volume and preload
        audio.volume = 1.0;
        audio.preload = 'auto';
        
        // Set up event handlers
        audio.onloadedmetadata = () => {
          console.log('Audio metadata loaded, duration:', audio.duration);
        };
        
        audio.oncanplaythrough = () => {
          console.log('Audio can play through');
        };
        
        audio.onplay = () => {
          console.log('Audio started playing');
        };
        
        audio.onpause = () => {
          console.log('Audio paused');
        };
        
        audio.onended = () => {
          console.log('Audio playback ended');
          setNarratingStoryId(null);
          setAudioUrl(null);
          if (audioRef.current) {
            audioRef.current = null;
          }
        };
        
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          console.error('Audio error details:', {
            error: error,
            networkState: audio.networkState,
            readyState: audio.readyState,
            src: audio.src.substring(0, 100),
            duration: audio.duration,
            volume: audio.volume
          });
          setNarratingStoryId(null);
          setAudioUrl(null);
          if (audioRef.current) {
            audioRef.current = null;
          }
          alert('Failed to play narration. The audio file may be corrupted. Please check the browser console for details.');
        };

        // Wait for audio to be ready, then play
        const playAudio = () => {
          if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            console.log('Audio ready, attempting to play...');
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log('Audio play promise resolved - should be playing now');
                })
                .catch((playError) => {
                  console.error('Error playing audio:', playError);
                  console.error('Error name:', playError.name);
                  console.error('Error message:', playError.message);
                  setNarratingStoryId(null);
                  setAudioUrl(null);
                  if (audioRef.current) {
                    audioRef.current = null;
                  }
                  
                  let errorMsg = 'Failed to play narration. ';
                  if (playError.name === 'NotAllowedError') {
                    errorMsg += 'Your browser blocked autoplay. Please check your browser settings and ensure audio is not muted.';
                  } else if (playError.name === 'NotSupportedError') {
                    errorMsg += 'Your browser does not support this audio format.';
                  } else {
                    errorMsg += `Error: ${playError.message}. Please check your browser audio settings.`;
                  }
                  alert(errorMsg);
                });
            }
          } else {
            console.log('Audio not ready yet, waiting... readyState:', audio.readyState);
            audio.addEventListener('canplay', () => {
              console.log('Audio can play now, attempting to play...');
              playAudio();
            }, { once: true });
            
            // Fallback: try to play after a short delay
            setTimeout(() => {
              if (audio.readyState >= 2) {
                playAudio();
              }
            }, 500);
          }
        };

        // Start loading and attempt to play
        try {
          audio.load();
          playAudio();
        } catch (error) {
          console.error('Exception trying to play audio:', error);
          setNarratingStoryId(null);
          setAudioUrl(null);
          if (audioRef.current) {
            audioRef.current = null;
          }
          alert('Failed to play narration. Please try again.');
        }
      } else {
        throw new Error(data.error || data.message || 'Failed to generate narration - no audio received');
      }
    } catch (error) {
      console.error('Error narrating story:', error);
      setNarratingStoryId(null);
      setAudioUrl(null);
      
      let errorMessage = 'Failed to generate narration. ';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += 'Request timed out. The narration is taking too long. Please try again or try a shorter story.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Please check your ElevenLabs API key configuration.';
      }
      alert(errorMessage);
    }
  };

  if (loading && learningPaths.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning content...</p>
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
        <div className="flex items-center justify-between mb-3">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-saffron-600 to-gold-500 bg-clip-text text-transparent"
          >
            📚 Learn
          </motion.h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold text-base sm:text-lg">{punyaPoints}</span>
            <span className="text-xs sm:text-sm opacity-90">Punya</span>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm"
        >
          Level 1 Learner • Start your journey
        </motion.p>
      </motion.div>

      <div className="px-6 py-12 space-y-16 max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Learning Paths
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Daily guides for learning and practicing Jain principles
            </p>
            <div className="space-y-6">
              {learningPaths.map((path, index) => (
                <ScrollReveal key={path.id} direction="left" delay={index * 0.15}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-saffron-50/50 via-transparent to-gold-50/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="relative border-2 border-gray-100 hover:border-saffron-200 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {path.title}
                          </CardTitle>
                          <span className="text-xs bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full font-medium">
                            {path.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{path.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">{path.progress}% Complete</span>
                            <span className="font-semibold text-saffron-600">🏅 {path.badges}/{path.totalBadges} Badges</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${path.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                              className="bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500 h-3 rounded-full"
                            />
                          </div>
                        </div>
                        <Link href={`/learn/guide/${path.id}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-saffron-500 to-gold-500 hover:shadow-xl hover:scale-105 transition-all">
                            Continue Learning
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-jainGreen-100/50 via-transparent to-teal-100/50 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-jainGreen-50 to-teal-50 border-2 border-jainGreen-200 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jainGreen-400 via-teal-400 to-jainGreen-500" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center text-gray-900">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-jainGreen-600" />
                      Daily Quiz
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
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
                {quizzes.length > 0 && quizzes[currentQuizIndex] ? (
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
                    <p className="font-bold text-lg sm:text-xl text-gray-900">❓ {quizzes[currentQuizIndex].question}</p>
                    <div className="space-y-3">
                      {quizzes[currentQuizIndex].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuizAnswer(quizzes[currentQuizIndex].id, index)}
                          disabled={selectedQuiz === quizzes[currentQuizIndex].id}
                          whileHover={{ scale: selectedQuiz !== quizzes[currentQuizIndex].id ? 1.02 : 1 }}
                          whileTap={{ scale: selectedQuiz !== quizzes[currentQuizIndex].id ? 0.98 : 1 }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium",
                            selectedQuiz === quizzes[currentQuizIndex].id && selectedAnswer === index
                              ? quizResult
                                ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                                : "bg-red-100 border-red-500 text-red-700 shadow-lg"
                              : selectedQuiz === quizzes[currentQuizIndex].id && index === quizzes[currentQuizIndex].correct
                              ? "bg-green-100 border-green-500 text-green-700 shadow-lg"
                              : "bg-white border-gray-200 hover:border-jainGreen-400 hover:bg-jainGreen-50 text-gray-800"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedQuiz === quizzes[currentQuizIndex].id && selectedAnswer === index && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {quizResult ? "✅" : "❌"}
                              </motion.span>
                            )}
                            {selectedQuiz === quizzes[currentQuizIndex].id && index === quizzes[currentQuizIndex].correct && selectedAnswer !== index && (
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
                    {selectedQuiz === quizzes[currentQuizIndex].id && quizResult !== null && (
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
                        {quizzes[currentQuizIndex].source && (
                          <p className="text-xs mt-1 opacity-75">Source: {quizzes[currentQuizIndex].source}</p>
                        )}
                      </motion.div>
                    )}
                    <div className="flex justify-center space-x-2 mt-4">
                      {quizzes.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            idx === currentQuizIndex ? "w-8 bg-jainGreen-500" : "w-2 bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-center text-gray-600 py-8">No quizzes available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Stories & Moral Dilemmas
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Engaging stories for different age groups
            </p>
            <div className="space-y-6">
              {stories.map((story, index) => (
                <ScrollReveal key={story.id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -6 }}
                    className="h-full"
                  >
                    <Card className="h-full border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 bg-white hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-3">📖 {story.title}</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              <span>🎯 Age: {story.age}</span>
                              <span>⭐ {story.rating.toFixed(2)}/5</span>
                              <span>📚 {story.pages} pages</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => handleReadStory(story)}
                          >
                            Read
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => handleNarrateStory(story)}
                            disabled={narratingStoryId === story.id && !audioUrl}
                          >
                            {narratingStoryId === story.id && audioUrl ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Listen
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
              <ScrollReveal direction="up" delay={0.2}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }}>
                  <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">🤔 Moral Dilemma</h3>
                      <p className="text-gray-600 mb-4 text-sm">Think deeply about Jain values through challenging ethical scenarios.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full hover:bg-indigo-100 hover:border-indigo-400"
                        onClick={async () => {
                          setLoadingDilemma(true);
                          try {
                            const response = await fetch('/api/moral-dilemma');
                            const data = await response.json();
                            if (data.success && data.dilemma) {
                              setMoralDilemma(data.dilemma);
                              setSelectedDilemmaOption(null);
                            } else {
                              alert('Failed to generate moral dilemma. Please try again.');
                            }
                          } catch (error) {
                            console.error('Error fetching moral dilemma:', error);
                            alert('Failed to generate moral dilemma. Please try again.');
                          } finally {
                            setLoadingDilemma(false);
                          }
                        }}
                        disabled={loadingDilemma}
                      >
                        {loadingDilemma ? 'Generating...' : 'Generate New Dilemma'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {moralDilemma && (
          <ScrollReveal direction="up" delay={0.1}>
            <div className="relative mt-8 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-transparent to-purple-100/50 rounded-3xl blur-3xl" />
              <Card className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500" />
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-bold flex items-center text-gray-900">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-600" />
                    Moral Dilemma
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1">
                    {moralDilemma.jainPrinciple}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/60 rounded-xl p-4 sm:p-6 border border-indigo-100">
                    <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-3">📖 Scenario</h4>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {moralDilemma.scenario}
                    </p>
                  </div>

                  <div className="bg-white/60 rounded-xl p-4 sm:p-6 border border-indigo-100">
                    <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-4">❓ {moralDilemma.question}</h4>
                    <div className="space-y-3">
                      {moralDilemma.options.map((option: string, index: number) => (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedDilemmaOption(index)}
                          whileHover={{ scale: selectedDilemmaOption !== index ? 1.02 : 1 }}
                          whileTap={{ scale: selectedDilemmaOption !== index ? 0.98 : 1 }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium text-sm sm:text-base",
                            selectedDilemmaOption === index
                              ? "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-lg"
                              : "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-800"
                          )}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {selectedDilemmaOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-4 sm:p-6 border-2 border-indigo-300"
                    >
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-3">💡 Lesson</h4>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {moralDilemma.lesson}
                      </p>
                      <p className="text-xs sm:text-sm text-indigo-600 mt-4 font-medium">
                        💭 Reflection: Consider how this dilemma applies to your daily life and how you can apply Jain principles in similar situations.
                      </p>
                    </motion.div>
                  )}

                  <Button
                    variant="outline"
                    onClick={async () => {
                      setLoadingDilemma(true);
                      setSelectedDilemmaOption(null);
                      try {
                        const response = await fetch('/api/moral-dilemma');
                        const data = await response.json();
                        if (data.success && data.dilemma) {
                          setMoralDilemma(data.dilemma);
                        } else {
                          alert('Failed to generate moral dilemma. Please try again.');
                        }
                      } catch (error) {
                        console.error('Error fetching moral dilemma:', error);
                        alert('Failed to generate moral dilemma. Please try again.');
                      } finally {
                        setLoadingDilemma(false);
                      }
                    }}
                    disabled={loadingDilemma}
                    className="w-full hover:bg-indigo-100 hover:border-indigo-400"
                  >
                    {loadingDilemma ? 'Generating...' : 'Generate Another Dilemma'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        )}

        <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
                  {selectedStory?.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsStoryDialogOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogTitle>
              {selectedStory && (
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 pt-2">
                  <span>🎯 Age: {selectedStory.age}</span>
                  <span>⭐ {selectedStory.rating.toFixed(2)}/5</span>
                  <span>📚 {selectedStory.pages} pages</span>
                </div>
              )}
            </DialogHeader>
            <div className="mt-4">
              {loadingStory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading story content...</p>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {storyContent || selectedStory?.description || `This story is about ${selectedStory?.title}. The full content will be available soon.`}
                  </div>
                </div>
              )}
            </div>
            {selectedStory?.content && !loadingStory && (
              <div className="mt-6 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleNarrateStory(selectedStory)}
                  disabled={narratingStoryId === selectedStory.id && !audioUrl}
                  className="flex-1"
                >
                  {narratingStoryId === selectedStory.id && audioUrl ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Narration
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Listen to Story
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <ScrollReveal direction="up" delay={0.4}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              Achievements
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Your accomplishments on your spiritual journey
            </p>
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => (
                <ScrollReveal key={achievement.id} direction="right" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={cn(
                      "transition-all duration-300",
                      achievement.earned
                        ? "bg-gradient-to-r from-saffron-50 via-gold-50 to-saffron-50 border-2 border-saffron-200 shadow-lg"
                        : "bg-gray-50 border-2 border-gray-200 opacity-60"
                    )}
                  >
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                            className="text-3xl sm:text-4xl"
                          >
                            {achievement.icon}
                          </motion.span>
                          <span className={cn("font-bold text-base sm:text-lg", achievement.earned ? "text-gray-900" : "text-gray-500")}>
                            {achievement.title}
                          </span>
                        </div>
                        {achievement.earned ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="w-7 h-7 text-green-500" />
                          </motion.div>
                        ) : (
                          <XCircle className="w-7 h-7 text-gray-400" />
                        )}
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
