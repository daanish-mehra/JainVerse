export const LANGUAGES = [
  { code: "EN", name: "English", flag: "🌐" },
  { code: "HI", name: "Hindi", flag: "🌐" },
  { code: "GU", name: "Gujarati", flag: "🌐" },
  { code: "SA", name: "Sanskrit", flag: "🌐" },
  { code: "PA", name: "Prakrit", flag: "🌐" },
] as const;

export const MODES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "scholar", label: "Scholar" },
] as const;

export const QUICK_ACTIONS = [
  { icon: "MessageCircle", label: "Chat", href: "/chat", color: "from-saffron-400 to-saffron-600" },
  { icon: "BookOpen", label: "Learn", href: "/learn", color: "from-jainGreen-400 to-jainGreen-600" },
  { icon: "Heart", label: "Practice", href: "/practice", color: "from-gold-400 to-gold-600" },
  { icon: "Book", label: "Stories", href: "/stories", color: "from-purple-400 to-purple-600" },
  { icon: "Mic", label: "Pronounce", href: "/pronounce", color: "from-blue-400 to-blue-600" },
  { icon: "Sparkles", label: "Social", href: "/social", color: "from-pink-400 to-pink-600" },
] as const;

export const DAILY_PRACTICES = [
  { type: "prayer", title: "Morning Prayer", time: "06:30", icon: "🌅" },
  { type: "meditation", title: "Meditation", time: "07:00", icon: "🧘" },
  { type: "scripture", title: "Scripture Reading", time: "08:00", icon: "📖" },
  { type: "fasting", title: "Fasting: Ekasan", time: "all-day", icon: "🍽️" },
] as const;

export const THEMES = [
  "Ahimsa",
  "Karma",
  "Anekantvad",
  "Aparigraha",
  "Meditation",
  "Philosophy",
] as const;

export const AGE_GROUPS = [
  "2-5",
  "5-10",
  "10-15",
  "15+",
] as const;

export const STORY_STYLES = [
  "friendly",
  "educational",
  "adventure",
  "moral",
] as const;

export const PLATFORMS = [
  "TikTok",
  "YouTube",
  "Instagram",
  "Facebook",
] as const;

export const CONTENT_STYLES = [
  "educational",
  "entertaining",
  "inspirational",
  "informative",
] as const;

