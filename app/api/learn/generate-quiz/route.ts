import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { text, title } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required for quiz generation' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Based on the following text about "${title}", create a single quiz question that:
- Tests understanding of the key concepts from the text
- Has exactly 4 multiple choice options
- Has one clearly correct answer
- Includes a brief explanation of why the answer is correct
- Is appropriate for learners of Jain philosophy

Text: ${text.substring(0, 2000)}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no additional text. Format:
{
  "question": "The quiz question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation",
  "source": "${title}"
}

The "correct" field must be a number 0-3 representing the index of the correct option.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quiz = JSON.parse(jsonMatch[0]);
        // Validate quiz structure
        if (quiz.question && Array.isArray(quiz.options) && quiz.options.length === 4 &&
            typeof quiz.correct === 'number' && quiz.correct >= 0 && quiz.correct < 4) {
          return NextResponse.json({ quiz });
        }
      }

      // Fallback quiz
      return NextResponse.json({
        quiz: {
          question: `What is the main concept covered in "${title}"?`,
          options: [
            "A key Jain principle",
            "A historical event",
            "A meditation technique",
            "A prayer or mantra",
          ],
          correct: 0,
          explanation: `This section covers important concepts related to ${title} in Jain philosophy.`,
          source: title,
        },
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Fallback quiz
      return NextResponse.json({
        quiz: {
          question: `What is the main concept covered in "${title}"?`,
          options: [
            "A key Jain principle",
            "A historical event",
            "A meditation technique",
            "A prayer or mantra",
          ],
          correct: 0,
          explanation: `This section covers important concepts related to ${title} in Jain philosophy.`,
          source: title,
        },
      });
    }
  } catch (error) {
    console.error('Quiz generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

