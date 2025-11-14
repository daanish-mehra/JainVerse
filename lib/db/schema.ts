export interface UserSchema {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  level: number;
  punyaPoints: number;
  streak: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressSchema {
  id: string;
  userId: string;
  practicesCompleted: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  punyaPoints: number;
  streak: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeSchema {
  id: string;
  userId: string;
  type: string;
  title: string;
  time: string;
  completed: boolean;
  date: Date;
  reflection?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VrataSchema {
  id: string;
  userId: string;
  name: string;
  day: number;
  totalDays: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttemptSchema {
  id: string;
  userId: string;
  quizId: number;
  answer: number;
  correct: boolean;
  points: number;
  completedAt: Date;
}

export interface AchievementSchema {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface StorySchema {
  id: string;
  userId: string;
  title: string;
  content: string;
  age: string;
  theme: string;
  style: string;
  rating: number;
  pages: number;
  createdAt: Date;
  updatedAt: Date;
}

