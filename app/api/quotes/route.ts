import { NextRequest, NextResponse } from 'next/server';

const jainQuotes = [
  "Non-violence must be practiced in thought, speech, and action.",
  "Every living being, however small, desires to live and should be protected.",
  "Avoid harm not only by action but also by negligence and carelessness.",
  "Compassion is the natural expression of understanding the equality of souls.",
  "Anger and violence first harm the person who carries them.",
  "Reality has many perspectives; no single viewpoint is complete.",
  "Listening to others' viewpoints reduces conflict and increases clarity.",
  "Certainty should be held with humility, not arrogance.",
  "Partial truths can coexist; wisdom lies in integration.",
  "Disagreement is not opposition—it's a different angle of the same truth.",
  "Possessiveness creates attachment, which leads to suffering.",
  "Reduce dependence on material things to increase inner freedom.",
  "The less you cling to, the lighter your life becomes.",
  "True wealth lies in self-restraint and contentment.",
  "Limit your consumption to what is necessary.",
  "Every action, intention, and emotion leaves karmic impressions.",
  "You are solely responsible for your spiritual progress.",
  "No external being can cleanse your karma—you must purify it yourself.",
  "Pure thoughts reduce karmic bondage; impure thoughts strengthen it.",
  "Awareness is the foundation for reducing negative karma.",
  "Self-discipline is essential for spiritual clarity.",
  "Ethical living is the starting point of all higher practices.",
  "Control over speech is as important as control over actions.",
  "Avoid lying by being intentional, precise, and kind with words.",
  "Restraining anger and pride is a daily practice, not a one-time effort.",
  "True knowledge removes ignorance, not just accumulates information.",
  "Understanding the difference between soul and body brings clarity.",
  "Study should lead to transformation, not mere memorization.",
  "Awareness increases when distraction decreases.",
  "Knowledge must be accompanied by humility.",
  "Trust in reality as it is, not as you wish it to be.",
  "Faith grows by inquiry, reasoning, and experience—not blind belief.",
  "Clear vision of life's principles leads to stable inner peace.",
  "Doubt is resolved through understanding, not avoidance.",
  "A steady mind strengthens faith; a restless mind weakens it.",
  "Regular silence helps calm passions and purify the mind.",
  "The mind becomes steady through awareness of each moment.",
  "Meditation is a practice of returning to yourself, again and again.",
  "Self-observation dismantles ego and reveals truth.",
  "Without inner discipline, external rituals have limited value.",
  "All souls are equal, regardless of form, status, or species.",
  "Every being is on its own path of evolution; respect that journey.",
  "No being exists in isolation—life is deeply interconnected.",
  "Helping others rise is part of helping yourself rise.",
  "Judging others clouds your own progress.",
  "Detachment does not mean withdrawal—it means freedom from craving.",
  "Pain comes from attachment to expectations, not circumstances.",
  "Letting go of ego opens the path to liberation.",
  "A calm and detached mind sees reality clearly.",
  "Freedom is found not in the external world but in internal mastery."
];

function getQuoteExplanation(quote: string): string {
  const lowerQuote = quote.toLowerCase();
  
  if (lowerQuote.includes("non-violence") || lowerQuote.includes("ahimsa") || lowerQuote.includes("harm")) {
    return "Ahimsa (non-violence) is the foundation of Jainism. It means not causing harm through thought, word, or deed to any living being, regardless of size or form.";
  }
  
  if (lowerQuote.includes("karma") || lowerQuote.includes("karmic")) {
    return "Karma in Jainism refers to subtle matter that binds to the soul based on actions, thoughts, and words. Reducing negative karma and eliminating existing karma is essential for spiritual progress.";
  }
  
  if (lowerQuote.includes("reality") || lowerQuote.includes("perspective") || lowerQuote.includes("viewpoint")) {
    return "Anekantvad (non-absolutism) teaches that reality has multiple aspects and can be understood from various perspectives, promoting tolerance and understanding.";
  }
  
  if (lowerQuote.includes("possessiveness") || lowerQuote.includes("attachment") || lowerQuote.includes("material")) {
    return "Aparigraha (non-possessiveness) emphasizes reducing attachments to material things and desires, leading to inner freedom and spiritual liberation.";
  }
  
  if (lowerQuote.includes("soul") || lowerQuote.includes("liberation") || lowerQuote.includes("spiritual")) {
    return "Jainism teaches that every soul has the potential to achieve liberation (moksha) through right faith, right knowledge, and right conduct.";
  }
  
  if (lowerQuote.includes("meditation") || lowerQuote.includes("mind") || lowerQuote.includes("silence")) {
    return "Meditation and mental discipline are essential practices in Jainism for calming passions, purifying the mind, and achieving spiritual clarity.";
  }
  
  if (lowerQuote.includes("compassion") || lowerQuote.includes("equality") || lowerQuote.includes("souls")) {
    return "Jainism teaches the equality of all souls. Compassion and respect for all living beings arise from understanding this fundamental principle.";
  }
  
  return "This teaching reflects core principles of Jain philosophy, emphasizing ethical living, spiritual discipline, and the path to liberation.";
}

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
