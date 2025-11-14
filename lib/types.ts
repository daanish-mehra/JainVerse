export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  punyaPoints: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  sources?: string[];
  confidence?: number;
}

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
}

export interface Practice {
  id: number;
  type: string;
  title: string;
  time: string;
  completed: boolean;
  date?: string;
}

export interface Vrata {
  id: number;
  name: string;
  day: number;
  totalDays: number;
  progress: number;
  startDate: string;
  endDate: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  age: string;
  theme: string;
  rating: number;
  pages: number;
  createdAt: Date;
}

export interface Progress {
  userId: string;
  practicesCompleted: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  punyaPoints: number;
  streak: number;
  lastActive: Date;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

