import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiClient } from '@/lib/gemini';

const JAIN_DIETARY_GUIDELINES = `
JAIN DIETARY PRINCIPLES (MANDATORY):
1. STRICTLY VEGETARIAN - No meat, fish, eggs, or any animal products
2. ROOT VEGETABLES FORBIDDEN: onion, garlic, potato, carrot, radish, beetroot, sweet potato, yam, ginger (as it's underground)
3. ALLOWED: Fruits and vegetables that grow above ground (tomatoes, bell peppers, eggplant, okra, spinach, cabbage, etc.)
4. ALLOWED: Grains (wheat, rice, millet, quinoa), lentils, beans, nuts, seeds, dairy products
5. AVOID: Fermented foods (alcohol, vinegar-based pickles)
6. AVOID: Honey (harms bees)
7. PREFERRED: Fresh, seasonal foods
8. PHILOSOPHY: Minimize harm to all living beings, including microscopic organisms

COMMON JAIN SUBSTITUTIONS:
- Onion/Garlic → Asafoetida (hing), curry leaves, fennel seeds
- Potato → Sweet potato (if above ground), tapioca
- Carrot → Bell peppers, tomatoes
- Vinegar → Lemon juice, tamarind
- Meat/Egg → Tofu, paneer, legumes, nuts
`;

export async function POST(req: NextRequest) {
  try {
    const { recipe } = await req.json();

    if (!recipe || recipe.trim().length === 0) {
      return NextResponse.json(
        { error: 'Recipe is required' },
        { status: 400 }
      );
    }

    // Use the same Gemini client helper as other parts of the app
    const genAIClient = getGeminiClient();
    
    if (!genAIClient) {
      return NextResponse.json(
        { 
          success: true,
          suggestion: `Gemini API is not configured. Here's a quick guide to make your recipe Jain-compliant:\n\n**Essential Substitutions:**\n- **Onion/Garlic** → Use asafoetida (hing) or curry leaves for flavor\n- **Potato** → Replace with tapioca or sweet potato (if above ground)\n- **Carrot** → Use bell peppers or tomatoes instead\n- **Vinegar** → Use lemon juice or tamarind\n\n**What to Avoid:**\n- Root vegetables: onion, garlic, potato, carrot, radish, beetroot\n- Animal products: meat, fish, eggs, any animal-derived ingredients\n- Honey (harms bees)\n- Fermented foods with vinegar\n\n**What to Use:**\n- Above-ground vegetables: tomatoes, peppers, eggplant, okra, spinach, cabbage\n- Grains: rice, wheat, quinoa, millet\n- Legumes: lentils, beans, chickpeas\n- Dairy: milk, paneer, ghee\n- Nuts and seeds\n\nPlease configure Gemini API for detailed recipe conversions!`
        }
      );
    }

    // Use available models for this API key (2.5 preview models)
    const modelNames = ['gemini-2.5-flash-preview-05-20', 'gemini-2.5-pro-preview-03-25'];

    const prompt = `You are a Jain culinary expert. A user wants to make a recipe Jain-compliant.

USER'S RECIPE:
${recipe}

${JAIN_DIETARY_GUIDELINES}

TASK:
Convert this recipe to be Jain-compliant. Keep your response SHORT and CONCISE.

FORMAT YOUR RESPONSE (be brief):
1. **Non-Jain Ingredients & Substitutions:** List each non-Jain ingredient and its Jain alternative (one line each)
2. **Modified Recipe:**
   - Ingredients (list only)
   - Preparation/Instructions (keep it short, step-by-step)

Keep explanations minimal - focus on the ingredients and cooking steps. Maximum 300 words total.`;

    // Try multiple models with retry logic
    let lastError: Error | null = null;
    let success = false;
    let responseText = '';

    for (let attempt = 0; attempt < modelNames.length; attempt++) {
      try {
        const currentModel = genAIClient.getGenerativeModel({ model: modelNames[attempt] });
        console.log(`Recipe converter: Trying model ${modelNames[attempt]} (attempt ${attempt + 1}/${modelNames.length})`);
        
        const result = await currentModel.generateContent(prompt);
        const response = await result.response;
        responseText = response.text() || '';

        if (responseText && responseText.trim().length > 0) {
          success = true;
          break; // Success - exit retry loop
        }
      } catch (error: any) {
        lastError = error;
        const errorMsg = error instanceof Error ? error.message : String(error);
        const errorString = errorMsg.toLowerCase();
        
        // If it's a 404 and we have more models to try, continue
        if (errorString.includes('404') && attempt < modelNames.length - 1) {
          console.log(`Model ${modelNames[attempt]} not available, trying next model...`);
          // Wait a bit before trying next model
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        
        // If it's a 503/overload, retry with same model
        if ((errorString.includes('503') || errorString.includes('overloaded') || errorString.includes('service unavailable')) && attempt < modelNames.length - 1) {
          console.log(`Model ${modelNames[attempt]} overloaded, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          attempt--; // Retry same model
          continue;
        }
        
        // For other errors or last attempt, throw
        if (attempt === modelNames.length - 1) {
          throw error;
        }
      }
    }

    if (success && responseText) {
      return NextResponse.json({
        success: true,
        suggestion: responseText,
      });
    }

    // If we get here, all models failed
    try {
      throw lastError || new Error('All Gemini models failed');
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const errorString = errorMsg.toLowerCase();
      
      // Always return a helpful suggestion, even on errors
      if (errorString.includes('429') || errorString.includes('quota') || errorString.includes('rate limit') || errorString.includes('too many requests')) {
        return NextResponse.json({
          success: true,
          suggestion: `The recipe service is temporarily busy. Here's a quick guide for making your recipe Jain-compliant:\n\n**Key Substitutions:**\n- Onion/Garlic → Asafoetida (hing) or curry leaves\n- Potato → Tapioca or sweet potato (if above ground)\n- Carrot → Bell peppers or tomatoes\n- Vinegar → Lemon juice or tamarind\n\n**General Guidelines:**\n- Avoid all root vegetables (onion, garlic, potato, carrot, radish, beetroot)\n- Use above-ground vegetables (tomatoes, peppers, eggplant, okra, spinach)\n- All ingredients must be plant-based (no meat, fish, eggs)\n- Prefer fresh, seasonal ingredients\n\nTry again in a moment for a full detailed conversion of your recipe!`,
        });
      }
      
      console.error('Gemini API error:', error);
      // Return a helpful fallback suggestion instead of an error
      return NextResponse.json({
        success: true,
        suggestion: `I encountered a technical difficulty with Gemini API. Here's a general guide to make your recipe Jain-compliant:\n\n**Jain Dietary Guidelines:**\n1. Replace onions/garlic with asafoetida (hing), curry leaves, or fennel seeds\n2. Avoid root vegetables: onions, garlic, potatoes, carrots, radishes, beetroot\n3. Use above-ground vegetables: tomatoes, bell peppers, eggplant, okra, spinach, cabbage\n4. All ingredients must be vegetarian (no meat, fish, eggs, animal products)\n5. Avoid honey (harms bees)\n6. Prefer fresh ingredients over fermented ones\n\n**Common Substitutions:**\n- Onion/Garlic → Asafoetida (hing)\n- Potato → Tapioca\n- Carrot → Bell peppers\n- Vinegar → Lemon juice\n- Meat/Egg → Paneer, tofu, legumes\n\nPlease try again in a moment for a detailed recipe conversion!`,
      });
    }
  } catch (error) {
    console.error('Recipe suggestion error:', error);
    // Always return a helpful response, even on unexpected errors
    return NextResponse.json({
      success: true,
      suggestion: `I encountered an error processing your recipe. Here's a quick guide to make any recipe Jain-compliant:\n\n**Essential Substitutions:**\n- **Onion/Garlic** → Use asafoetida (hing) or curry leaves for flavor\n- **Potato** → Replace with tapioca or sweet potato (if above ground)\n- **Carrot** → Use bell peppers or tomatoes instead\n- **Vinegar** → Use lemon juice or tamarind\n\n**What to Avoid:**\n- Root vegetables: onion, garlic, potato, carrot, radish, beetroot\n- Animal products: meat, fish, eggs, any animal-derived ingredients\n- Honey (harms bees)\n- Fermented foods with vinegar\n\n**What to Use:**\n- Above-ground vegetables: tomatoes, peppers, eggplant, okra, spinach, cabbage\n- Grains: rice, wheat, quinoa, millet\n- Legumes: lentils, beans, chickpeas\n- Dairy: milk, paneer, ghee\n- Nuts and seeds\n\nPlease try again or consult Jain cooking resources for more detailed guidance!`,
    });
  }
}

