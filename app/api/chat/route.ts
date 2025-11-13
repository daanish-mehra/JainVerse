import { NextRequest, NextResponse } from 'next/server';

const mockResponses: Record<string, string> = {
  "ahimsa": "Ahimsa (non-violence) is the highest virtue in Jainism. It means not causing harm to any living being through thought, word, or deed. This principle extends to all life forms, from humans to the smallest microorganisms. Ahimsa is practiced through vegetarianism, compassion, and respect for all living beings.",
  
  "mahavira": "Mahavira was the 24th and last Tirthankara (spiritual teacher) of Jainism. Born as Vardhamana around 599 BCE, he renounced worldly life at age 30 and achieved enlightenment after 12 years of intense meditation and ascetic practices. He taught the path to liberation through the three jewels: Right Faith, Right Knowledge, and Right Conduct.",
  
  "jainism": "Jainism is an ancient Indian religion that emphasizes non-violence, truth, non-stealing, celibacy, and non-possessiveness. Founded on the teachings of 24 Tirthankaras, Jainism teaches that every soul has the potential to achieve liberation (moksha) through ethical living, meditation, and spiritual discipline.",
  
  "tirthankara": "Tirthankaras are spiritual teachers in Jainism who have achieved enlightenment and show the path to liberation. There have been 24 Tirthankaras in the current time cycle, with Mahavira being the last. They are revered as role models who have conquered their inner enemies (passions) and achieved perfect knowledge.",
  
  "karma": "In Jainism, karma is a subtle matter that binds to the soul based on one's actions, thoughts, and words. Good actions lead to good karma, while harmful actions create bad karma. The goal is to stop the influx of new karma and shed existing karma through ethical living, meditation, and spiritual practices.",
  
  "moksha": "Moksha (liberation) in Jainism is the ultimate goal - the complete freedom of the soul from the cycle of birth and death. It is achieved when all karma is eliminated and the soul reaches its pure, perfect state. This requires following the path of Right Faith, Right Knowledge, and Right Conduct.",
  
  "vrata": "Vratas are vows or observances in Jainism that help practitioners progress on the spiritual path. Common vratas include fasting (upvas), limiting food intake (ekasan - one meal a day), and abstaining from food after sunset (chauvihar). These practices help develop self-discipline and reduce attachment to material pleasures.",
  
  "meditation": "Meditation (dhyana) in Jainism is a practice of focusing the mind to achieve inner peace and spiritual progress. It helps practitioners develop equanimity, reduce passions, and purify the soul. Common forms include contemplation of the Tirthankaras, reflection on the nature of the soul, and mindfulness practices.",
};

export async function POST(req: NextRequest) {
  try {
    const { message, language = "EN", mode = "beginner" } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const lowerMessage = message.toLowerCase().trim();
    
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(key)) {
        return NextResponse.json({
          text: response,
          sources: ["Jainworld.com", "Tattvarth Sutra"],
          confidence: 95,
        });
      }
    }
    
    const defaultResponse = mode === "beginner" 
      ? "I'm here to help you learn about Jain philosophy! Try asking about:\n\n• What is Ahimsa?\n• Tell me about Mahavira\n• What is Jainism?\n• Explain Tirthankaras\n• What is Karma in Jainism?\n• How to achieve Moksha?\n• What are Vratas?\n• Jain meditation practices"
      : "I'm still learning about Jain philosophy. Could you ask about specific topics like Ahimsa, Mahavira, Tirthankaras, Karma, Moksha, Vratas, or Meditation? I can provide detailed explanations on these topics.";
    
    return NextResponse.json({
      text: defaultResponse,
      sources: [],
      confidence: 60,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: "I apologize, but I'm having trouble processing your request right now. Please try again." },
      { status: 500 }
    );
  }
}
