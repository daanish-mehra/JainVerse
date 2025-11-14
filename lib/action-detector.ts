export interface ActionButton {
  label: string;
  href: string;
  type: 'learn' | 'practice' | 'vrata' | 'fasting' | 'quiz' | 'story';
}

export function detectActionFromMessage(message: string): ActionButton | null {
  const lowerMessage = message.toLowerCase();
  
  // Learning-related queries
  if (lowerMessage.includes('ahimsa') || lowerMessage.includes('non-violence') || lowerMessage.includes('nonviolence')) {
    return {
      label: 'Learn about Ahimsa',
      href: '/learn/guide/1?scrollTo=ahimsa',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('anekantvad') || lowerMessage.includes('anekant') || lowerMessage.includes('multi-sidedness')) {
    return {
      label: 'Learn about Anekantvad',
      href: '/learn/guide/1?scrollTo=anekantvad',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('aparigraha') || lowerMessage.includes('non-attachment') || lowerMessage.includes('nonattachment')) {
    return {
      label: 'Learn about Aparigraha',
      href: '/learn/guide/1?scrollTo=aparigraha',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('jain principles') || lowerMessage.includes('jainism principles') || lowerMessage.includes('core principles')) {
    return {
      label: 'Explore Jain Principles',
      href: '/learn/guide/1',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('jain philosophy') || lowerMessage.includes('jainism philosophy')) {
    return {
      label: 'Study Jain Philosophy',
      href: '/learn/guide/2',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('meditation') || lowerMessage.includes('dhyan') || lowerMessage.includes('samayik')) {
    return {
      label: 'Learn Meditation Practices',
      href: '/learn/guide/3',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('mahavira') || lowerMessage.includes('lord mahavira')) {
    return {
      label: 'Learn about Lord Mahavira',
      href: '/learn/guide/1?scrollTo=mahavira',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('tirthankara') || lowerMessage.includes('tirthankaras')) {
    return {
      label: 'Explore Tirthankaras',
      href: '/learn/guide/2?scrollTo=tirthankaras',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('karma') && (lowerMessage.includes('jain') || lowerMessage.includes('jainism'))) {
    return {
      label: 'Understand Karma in Jainism',
      href: '/learn/guide/2?scrollTo=karma',
      type: 'learn',
    };
  }
  
  if (lowerMessage.includes('moksha') || lowerMessage.includes('liberation')) {
    return {
      label: 'Learn about Moksha',
      href: '/learn/guide/1?scrollTo=moksha',
      type: 'learn',
    };
  }
  
  // Practice-related queries
  if (lowerMessage.includes('fasting schedule') || lowerMessage.includes('fasting') || lowerMessage.includes('fast')) {
    return {
      label: 'View Fasting Schedule',
      href: '/practice?scrollTo=fasting',
      type: 'fasting',
    };
  }
  
  if (lowerMessage.includes('vrata') || lowerMessage.includes('vratas') || lowerMessage.includes('vow')) {
    return {
      label: 'Track Vratas',
      href: '/practice?scrollTo=vrata',
      type: 'vrata',
    };
  }
  
  if (lowerMessage.includes('daily practice') || lowerMessage.includes('today practice') || lowerMessage.includes('practice today')) {
    return {
      label: 'View Today\'s Practices',
      href: '/practice?scrollTo=practices',
      type: 'practice',
    };
  }
  
  if (lowerMessage.includes('practice meditation') || lowerMessage.includes('meditate')) {
    return {
      label: 'Practice Meditation',
      href: '/practice?scrollTo=meditation',
      type: 'practice',
    };
  }
  
  if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('question')) {
    return {
      label: 'Take a Quiz',
      href: '/learn?scrollTo=quiz',
      type: 'quiz',
    };
  }
  
  if (lowerMessage.includes('story') || lowerMessage.includes('stories') || lowerMessage.includes('tale')) {
    return {
      label: 'Read Jain Stories',
      href: '/stories',
      type: 'story',
    };
  }
  
  // Generic learning queries
  if (lowerMessage.includes('learn') || lowerMessage.includes('teach') || lowerMessage.includes('explain')) {
    if (lowerMessage.includes('how') || lowerMessage.includes('practice') || lowerMessage.includes('do')) {
      // If asking how to practice something, likely need practice page
      if (!lowerMessage.includes('about') && !lowerMessage.includes('what is')) {
        return {
          label: 'View Practices',
          href: '/practice',
          type: 'practice',
        };
      }
    }
    return {
      label: 'Explore Learning Paths',
      href: '/learn',
      type: 'learn',
    };
  }
  
  return null;
}

