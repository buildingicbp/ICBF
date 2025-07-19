// Gemini AI Integration Service
// Note: You'll need to add your Gemini API key to your environment variables

interface DietPlanRequest {
  gender: string
  age: string
  height: string
  bodyFat: string
  workoutFrequency: string
  currentWeight: string
  goalWeight: string
  goalBodyFat: string
  goal: string
}

interface DietPlanResponse {
  plan: string
  recommendations: string
  mealPlan: {
    breakfast: string
    lunch: string
    dinner: string
    snacks: string
  }
  calories: string
  macros: {
    protein: string
    carbs: string
    fats: string
  }
  detailedPlan: {
    overview: string
    weeklySchedule: string
    shoppingList: string
    mealPrepTips: string
    hydrationGuide: string
    supplements: string
    progressTracking: string
    adjustments: string
  }
  nutritionFacts: {
    fiber: string
    vitamins: string
    minerals: string
    omega3: string
  }
}

export async function generateDietPlanWithGemini(data: DietPlanRequest): Promise<DietPlanResponse> {
  try {
    // Check if Gemini API key is available
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Gemini API key not configured')
    }

    const prompt = `
    Create a comprehensive, detailed diet plan for a ${data.age}-year-old ${data.gender} with the following specifications:
    
    Current Stats:
    - Height: ${data.height} cm
    - Current Weight: ${data.currentWeight} kg
    - Body Fat: ${data.bodyFat}%
    - Workout Frequency: ${data.workoutFrequency}
    
    Goals:
    - Primary Goal: ${data.goal}
    - Target Weight: ${data.goalWeight} kg
    - Target Body Fat: ${data.goalBodyFat}%
    
    Please provide a comprehensive, detailed diet plan including:
    
    1. A personalized overview explaining the plan and expected timeline
    2. 8-10 detailed nutrition recommendations with explanations
    3. A daily meal plan with specific foods, portions, and cooking methods for breakfast, lunch, dinner, and snacks
    4. Daily calorie target with breakdown
    5. Detailed macronutrient breakdown (protein, carbs, fats) with percentages
    6. Weekly meal schedule with variety
    7. Comprehensive shopping list organized by categories
    8. Meal prep tips and strategies
    9. Hydration guide with specific recommendations
    10. Supplement recommendations (if needed)
    11. Progress tracking methods and metrics
    12. How to adjust the plan based on progress
    13. Additional nutrition facts (fiber, vitamins, minerals, omega-3)
    
    Format the response as JSON with the following structure:
    {
      "plan": "detailed personalized overview with timeline",
      "recommendations": "recommendation1\\nrecommendation2\\n...",
      "mealPlan": {
        "breakfast": "detailed breakfast with portions and cooking methods",
        "lunch": "detailed lunch with portions and cooking methods", 
        "dinner": "detailed dinner with portions and cooking methods",
        "snacks": "detailed snacks with portions and timing"
      },
      "calories": "detailed calorie breakdown (e.g., 2000-2200 calories: 500 breakfast, 600 lunch, 700 dinner, 200 snacks)",
      "macros": {
        "protein": "protein grams and percentage (e.g., 150-180g, 30-35%)",
        "carbs": "carb grams and percentage (e.g., 200-250g, 40-45%)", 
        "fats": "fat grams and percentage (e.g., 60-80g, 25-30%)"
      },
      "detailedPlan": {
        "overview": "comprehensive plan overview with timeline and expectations",
        "weeklySchedule": "7-day meal rotation with variety",
        "shoppingList": "organized shopping list by categories (proteins, vegetables, grains, etc.)",
        "mealPrepTips": "detailed meal prep strategies and time-saving tips",
        "hydrationGuide": "specific hydration recommendations with timing",
        "supplements": "supplement recommendations with dosages and timing",
        "progressTracking": "detailed progress tracking methods and metrics",
        "adjustments": "how to adjust the plan based on progress and results"
      },
      "nutritionFacts": {
        "fiber": "fiber recommendations and sources",
        "vitamins": "key vitamins and their sources",
        "minerals": "key minerals and their sources",
        "omega3": "omega-3 recommendations and sources"
      }
    }
    
    Make the plan extremely detailed, realistic, sustainable, and tailored to their specific goals and current fitness level. Include specific portion sizes, cooking methods, and timing recommendations.
    `

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const result = await response.json()
    
    // Extract the generated text from Gemini response
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!generatedText) {
      throw new Error('No response generated from Gemini')
    }

    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(generatedText)
      return parsedResponse as DietPlanResponse
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      return {
        plan: generatedText,
        recommendations: "Focus on whole foods, stay hydrated, and maintain consistency with your meal plan.",
        mealPlan: {
          breakfast: "Oatmeal with berries and nuts, Greek yogurt",
          lunch: "Grilled chicken breast, quinoa, mixed vegetables",
          dinner: "Salmon fillet, brown rice, steamed broccoli",
          snacks: "Protein shake, almonds, apple with peanut butter"
        },
        calories: "2000-2200 calories: 500 breakfast, 600 lunch, 700 dinner, 200 snacks",
        macros: {
          protein: "150-180g, 30-35%",
          carbs: "200-250g, 40-45%",
          fats: "60-80g, 25-30%"
        },
        detailedPlan: {
          overview: `Comprehensive ${data.goal} plan for ${data.age}-year-old ${data.gender}. Expected timeline: 8-12 weeks for significant results.`,
          weeklySchedule: "Day 1-7 meal rotation with protein variety, seasonal vegetables, and whole grains",
          shoppingList: "Proteins: Chicken breast, salmon, eggs, Greek yogurt\nVegetables: Spinach, broccoli, sweet potatoes\nGrains: Quinoa, brown rice, oats\nFruits: Berries, bananas, apples",
          mealPrepTips: "Prep proteins on Sunday, chop vegetables, cook grains in advance, portion snacks",
          hydrationGuide: "8-10 glasses water daily, electrolyte replacement during workouts",
          supplements: "Multivitamin, omega-3, vitamin D (consult healthcare provider)",
          progressTracking: "Weekly weigh-ins, body measurements, progress photos, energy levels",
          adjustments: "Adjust calories by 100-200 based on weekly progress, modify macros as needed"
        },
        nutritionFacts: {
          fiber: "25-30g daily from vegetables, fruits, and whole grains",
          vitamins: "Vitamin C from citrus, Vitamin D from sunlight/fish, B vitamins from whole grains",
          minerals: "Iron from lean meats, calcium from dairy, magnesium from nuts",
          omega3: "2-3 servings fatty fish weekly or omega-3 supplements"
        }
      }
    }

  } catch (error) {
    console.error('Error generating diet plan with Gemini:', error)
    
    // Fallback to detailed mock response if Gemini fails
    return {
      plan: `Based on your profile (${data.age} year old ${data.gender}, ${data.height}cm, ${data.currentWeight}kg, ${data.bodyFat}% body fat), here's your comprehensive diet plan to ${data.goal} from ${data.currentWeight}kg to ${data.goalWeight}kg. Expected timeline: 8-12 weeks for significant results.`,
      recommendations: [
        "Focus on high-protein foods (1.6-2.2g per kg body weight) to maintain muscle mass during weight loss",
        "Include complex carbohydrates (40-45% of calories) for sustained energy throughout the day",
        "Stay hydrated with at least 8-10 glasses of water daily, more during workouts",
        "Eat 5-6 small meals throughout the day to maintain stable blood sugar",
        "Limit processed foods and added sugars to less than 10% of daily calories",
        "Include healthy fats (25-30% of calories) from sources like avocados, nuts, and olive oil",
        "Time protein intake around workouts (within 2 hours) for optimal muscle recovery",
        "Include fiber-rich foods (25-30g daily) for digestive health and satiety"
      ].join('\n'),
      mealPlan: {
        breakfast: "1 cup oatmeal (80g dry) with 1/2 cup mixed berries, 1/4 cup chopped almonds, 1 cup Greek yogurt (170g), 1 medium banana. Cook oatmeal with water, top with berries and nuts.",
        lunch: "150g grilled chicken breast, 1 cup cooked quinoa (185g), 2 cups mixed vegetables (broccoli, carrots, bell peppers), 1 tbsp olive oil dressing. Season chicken with herbs, steam vegetables.",
        dinner: "150g salmon fillet, 1 cup brown rice (195g), 2 cups steamed broccoli, 1/4 avocado. Bake salmon at 400°F for 12-15 minutes, cook rice with 2:1 water ratio.",
        snacks: "Protein shake (30g protein powder + 1 cup almond milk), 1/4 cup almonds (28g), 1 medium apple with 1 tbsp natural peanut butter"
      },
      calories: "2000-2200 calories: 500 breakfast, 600 lunch, 700 dinner, 200 snacks",
      macros: {
        protein: "150-180g, 30-35%",
        carbs: "200-250g, 40-45%",
        fats: "60-80g, 25-30%"
      },
      detailedPlan: {
        overview: `Comprehensive ${data.goal} plan for ${data.age}-year-old ${data.gender}. This plan is designed to help you achieve your goal of reaching ${data.goalWeight}kg and ${data.goalBodyFat}% body fat. Expected timeline: 8-12 weeks for significant results. The plan includes progressive adjustments based on your progress.`,
        weeklySchedule: "Day 1-7 meal rotation with protein variety (chicken, fish, lean beef, eggs), seasonal vegetables, and whole grains. Each day includes 3 main meals and 2-3 snacks strategically timed around your workout schedule.",
        shoppingList: "Proteins: Chicken breast (2kg), salmon fillets (1kg), eggs (2 dozen), Greek yogurt (1kg)\nVegetables: Spinach (500g), broccoli (1kg), sweet potatoes (1kg), bell peppers (6 pieces)\nGrains: Quinoa (500g), brown rice (1kg), oats (1kg)\nFruits: Berries (500g), bananas (7 pieces), apples (7 pieces)\nNuts: Almonds (500g), natural peanut butter (500g)",
        mealPrepTips: "Sunday prep: Cook 2kg chicken breast, 2 cups quinoa, 2 cups brown rice. Chop all vegetables and store in containers. Portion snacks into individual servings. Cook sweet potatoes and store for the week.",
        hydrationGuide: "8-10 glasses water daily (2-2.5L), electrolyte replacement during workouts (500ml sports drink or coconut water), pre-workout: 500ml water 2 hours before, during: 250ml every 15 minutes, post-workout: 500ml within 30 minutes.",
        supplements: "Multivitamin (daily), omega-3 (1000mg EPA/DHA), vitamin D (2000-4000 IU if deficient), protein powder (30g post-workout). Always consult with a healthcare provider before starting supplements.",
        progressTracking: "Weekly weigh-ins (same time, same scale), body measurements (chest, waist, hips, arms, thighs), progress photos (monthly), energy levels and workout performance, body fat percentage (monthly if possible).",
        adjustments: "Adjust calories by 100-200 based on weekly progress. If weight loss stalls for 2 weeks, reduce calories by 200. If losing too fast (>1kg/week), increase calories by 200. Modify macros: increase protein if losing muscle, adjust carbs based on energy levels."
      },
      nutritionFacts: {
        fiber: "25-30g daily from vegetables (10g), fruits (8g), whole grains (8g), nuts and seeds (4g). Aim for 5-9 servings of fruits and vegetables daily.",
        vitamins: "Vitamin C: 90mg daily from citrus fruits, bell peppers, broccoli\nVitamin D: 600-800 IU from sunlight exposure, fatty fish, fortified dairy\nB vitamins: from whole grains, lean meats, eggs, dairy products",
        minerals: "Iron: 18mg daily from lean meats, spinach, fortified cereals\nCalcium: 1000mg daily from dairy, leafy greens, fortified foods\nMagnesium: 400mg daily from nuts, seeds, whole grains, dark chocolate",
        omega3: "2-3 servings fatty fish weekly (salmon, mackerel, sardines) or 1000mg EPA/DHA supplement. Plant sources: flaxseeds, chia seeds, walnuts."
      }
    }
  }
} 