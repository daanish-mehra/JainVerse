export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function calculateStreak(lastActive: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActiveDate = new Date(lastActive);
  lastActiveDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastActiveDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 1;
  if (diffDays === 1) return 2;
  return 1;
}

export function calculateLevel(punyaPoints: number): number {
  return Math.floor(punyaPoints / 100) + 1;
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

export function extractSources(text: string): string[] {
  const sources: string[] = [];
  const sourcePatterns = [
    /Tattvarth\s+Sutra/gi,
    /Jainworld\.com/gi,
    /Acharanga\s+Sutra/gi,
    /Sthananga\s+Sutra/gi,
    /Uttaradhyayana\s+Sutra/gi,
  ];

  sourcePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      sources.push(...matches);
    }
  });

  return Array.from(new Set(sources));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

