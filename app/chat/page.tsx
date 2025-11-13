"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Globe, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      text: "🙏 Welcome to JainVerse! I'm your AI companion for learning about Jain philosophy, ethics, and practices. How can I help you today?",
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

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        text: "Ahimsa is the principle of non-violence, which is the foundation of Jain philosophy. It means not causing harm to any living being through thought, word, or deed. Ahimsa is considered the highest virtue in Jainism and is practiced in daily life through vegetarianism, compassion, and respect for all life forms.",
        timestamp: new Date(),
        sources: ["Tattvarth Sutra", "Jainworld.com"],
        confidence: 95,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-ivory-50 to-white pb-20">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-saffron-100 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gradient">💬 JainGPT</h1>
          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-saffron-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
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
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1 text-xs rounded-full font-medium transition-all duration-300",
                mode === m
                  ? "bg-saffron-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
                  message.type === "user"
                    ? "bg-gradient-saffron text-white rounded-br-sm"
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-saffron-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-20 bg-white/80 backdrop-blur-lg border-t border-saffron-100 px-4 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-saffron-100"
          >
            <Mic className="w-5 h-5 text-saffron-600" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Jain philosophy, practices, or ethics..."
            className="flex-1 rounded-full border-saffron-200 focus:border-saffron-500"
          />
          <Button
            onClick={handleSend}
            className="rounded-full bg-gradient-saffron hover:shadow-spiritual"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

