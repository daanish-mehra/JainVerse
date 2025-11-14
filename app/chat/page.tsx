"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FadeIn } from "@/components/animations/FadeIn";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  sources?: string[];
  confidence?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
              text: "🙏 Welcome to JainAI! Your mobile companion for JainVerse. I'm here to help you learn about Jain philosophy, ethics, and practices. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [mode, setMode] = useState<"beginner" | "intermediate" | "scholar">("beginner");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input.trim();
    const userMessageId = Date.now();
    const botMessageId = Date.now() + 1;

    const userMessage: Message = {
      id: userMessageId,
      type: "user",
      text: currentInput,
      timestamp: new Date(),
    };

    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          language,
          mode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: botMessageId,
          type: "bot",
          text: data.text || data.message || "I apologize, but I couldn't generate a response.",
          timestamp: new Date(),
          // Sources and confidence are optional - only include if provided by API
          sources: data.sources,
          confidence: data.confidence,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: botMessageId,
          type: "bot",
          text: data.error || data.message || "I'm having trouble right now. Please try again later.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: botMessageId,
        type: "bot",
        text: "I apologize, but I'm having connection issues. Please check your internet and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white via-ivory-50 to-white pb-20">
      <FadeIn>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-saffron-100/50 px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-saffron-600 to-gold-500 bg-clip-text text-transparent"
            >
              💬 JainAI Chat
            </motion.h1>
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500 transition-all"
              >
                <option value="EN">🌐 EN</option>
                <option value="HI">🌐 HI</option>
                <option value="GU">🌐 GU</option>
                <option value="SA">🌐 SA</option>
                <option value="PA">🌐 PA</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            {(["beginner", "intermediate", "scholar"] as const).map((m) => (
              <motion.button
                key={m}
                onClick={() => setMode(m)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 text-xs rounded-full font-medium transition-all duration-300",
                  mode === m
                    ? "bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex mb-4",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 shadow-md",
                  message.type === "user"
                    ? "bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-br-sm"
                    : "bg-white border border-saffron-100 rounded-bl-sm"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs font-semibold mb-1 flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Sources:
                    </p>
                    <ul className="text-xs space-y-1">
                      {message.sources.map((source, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="mr-1">📖</span>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {message.confidence && (
                  <div className="mt-2 text-xs opacity-80 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Confidence: {message.confidence}%
                  </div>
                )}
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border-2 border-saffron-100 rounded-3xl rounded-bl-md px-6 py-4 shadow-lg">
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-saffron-400 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-20 bg-white/95 backdrop-blur-xl border-t border-saffron-100/50 px-4 py-5 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-saffron-100 w-12 h-12"
            >
              <Mic className="w-5 h-5 text-saffron-600" />
            </Button>
          </motion.div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Jain philosophy, practices, or ethics..."
            className="flex-1 rounded-full border-2 border-saffron-200 focus:border-saffron-500 h-12 px-6 transition-all"
          />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleSend}
              className="rounded-full bg-gradient-to-r from-saffron-500 to-gold-500 hover:shadow-xl w-12 h-12 p-0"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
