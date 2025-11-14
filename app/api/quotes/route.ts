import { NextRequest, NextResponse } from 'next/server';
import { getRandomQuote } from '@/lib/cosmos';

const fallbackQuotes = [
  {
    quote: "Ahimsa is the highest virtue",
    author: "Mahavira",
    explanation: "Non-violence towards all living beings is the fundamental principle of Jainism. It means not causing harm through thought, word, or deed.",
  },
  {
    quote: "Live and let live",
    author: "Jain Proverb",
    explanation: "This principle emphasizes respecting all life forms and allowing them to exist peacefully without interference.",
  },
  {
    quote: "The soul is the master of its own destiny",
    author: "Jain Philosophy",
    explanation: "Every soul has the potential to achieve liberation through right conduct, right knowledge, and right faith.",
  },
  {
    quote: "Non-possessiveness leads to inner peace",
    author: "Aparigraha Principle",
    explanation: "By minimizing attachments to material possessions, one achieves spiritual freedom and tranquility.",
  },
  {
    quote: "Truth is multifaceted",
    author: "Anekantvad",
    explanation: "Reality has multiple aspects, and one should consider different perspectives before forming conclusions.",
  },
  {
    quote: "Every living being deserves respect",
    author: "Jain Ethics",
    explanation: "From the smallest microorganism to the largest being, all life has intrinsic value and deserves compassion.",
  },
  {
    quote: "Self-control is the path to liberation",
    author: "Jain Teachings",
    explanation: "Mastering one's passions and desires through discipline leads to spiritual progress and ultimate freedom.",
  },
  {
    quote: "Non-violence begins with non-violent thoughts",
    author: "Jain Wisdom",
    explanation: "True ahimsa starts in the mind - controlling harmful thoughts is as important as controlling harmful actions.",
  },
  {
    quote: "Karma is the cause of bondage",
    author: "Tattvarth Sutra",
    explanation: "Actions, thoughts, and words create karma that binds the soul to the cycle of birth and death.",
  },
  {
    quote: "Right knowledge leads to right conduct",
    author: "Jain Philosophy",
    explanation: "Understanding the true nature of reality guides one toward ethical behavior and spiritual growth.",
  },
];

export async function GET(request: NextRequest) {
  try {
    const randomQuoteText = jainQuotes[Math.floor(Math.random() * jainQuotes.length)];
    const explanation = getQuoteExplanation(randomQuoteText);
    
    return NextResponse.json({
      success: true,
      quote: randomQuoteText,
      author: "",
      explanation: explanation,
    });
  } catch (error) {
    console.error('Quotes API error:', error);
    
    const randomQuoteText = jainQuotes[Math.floor(Math.random() * jainQuotes.length)];
    const explanation = getQuoteExplanation(randomQuoteText);
    
    return NextResponse.json({
      success: true,
      quote: randomQuoteText,
      author: "",
      explanation: explanation,
    });
  }
}

