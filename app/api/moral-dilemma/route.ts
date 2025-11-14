import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function GET(request: NextRequest) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const prompt = `Generate a compelling Jain moral dilemma that teaches an important lesson about Jain principles such as Ahimsa (non-violence), Anekantvad (multiple viewpoints), Aparigraha (non-attachment), or other core Jain values. 

The dilemma should:
1. Present a realistic situation where a Jain student must make a difficult ethical choice
2. Be age-appropriate for students aged 12-18
3. Challenge the student to think deeply about Jain values
4. Not have an obviously correct answer - it should provoke thoughtful reflection
5. Include context about why the decision is difficult

Return ONLY a JSON object with this exact structure:
{
  "scenario": "A detailed description of the moral dilemma situation (200-300 words)",
  "question": "The main ethical question the student must answer",
  "options": [
    "Option 1: A possible response/action",
    "Option 2: Another possible response/action",
    "Option 3: A third possible response/action"
  ],
  "jainPrinciple": "The Jain principle this dilemma relates to (e.g., 'Ahimsa - Non-violence')",
  "lesson": "What lesson this dilemma teaches about Jain values (100-150 words)"
}

Do NOT include any explanatory text before or after the JSON. Return only the JSON object.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON from the response
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').trim();
      }

      const dilemma = JSON.parse(jsonText);

      return NextResponse.json({
        success: true,
        dilemma,
      });
    } catch (error) {
      console.error('Error generating moral dilemma:', error);
      
      // Fallback dilemma
      const fallbackDilemma = {
        scenario: "You are volunteering at a local animal shelter. A cat has been injured and needs immediate medical care, but the shelter is funded by donations from a company that tests products on animals. The veterinarian is available, but you know that accepting help might indirectly support practices that harm animals. What should you do?",
        question: "Should you accept help from a source that contradicts Jain principles, even if it means saving an animal's life?",
        options: [
          "Accept the help to save the cat's life immediately, recognizing that the immediate need for Ahimsa (non-violence) takes priority",
          "Refuse the help and try to find alternative funding, even if it means the cat suffers longer",
          "Accept the help but actively work to find ethical alternatives and reduce future dependency on unethical funding sources"
        ],
        jainPrinciple: "Ahimsa - Non-violence",
        lesson: "This dilemma challenges the application of Ahimsa in complex situations. It teaches that Jain values must be balanced with practical realities, while still maintaining commitment to non-violence. The key is to minimize harm and work toward ethical solutions, even when perfect options don't exist."
      };

      return NextResponse.json({
        success: true,
        dilemma: fallbackDilemma,
      });
    }
  } catch (error) {
    console.error('Moral dilemma API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

