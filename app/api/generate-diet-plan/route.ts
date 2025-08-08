import { NextRequest, NextResponse } from 'next/server'
import { generateDietPlanWithGemini } from '@/lib/gemini-ai'

export async function POST(request: NextRequest) {
  try {
    const { formData, userId, userEmail } = await request.json()

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      )
    }

    console.log('🍽️ Generating diet plan for:', userEmail || 'anonymous user')

    // Generate diet plan using Gemini AI
    const dietPlanResponse = await generateDietPlanWithGemini({
      gender: formData.gender,
      age: formData.age,
      height: formData.height,
      bodyFat: '15', // Default value
      workoutFrequency: formData.activityLevel,
      currentWeight: formData.weight,
      goalWeight: formData.weight, // Same as current for maintenance
      goalBodyFat: '12', // Default value
      goal: formData.fitnessGoal
    })

    if (!dietPlanResponse) {
      return NextResponse.json(
        { error: 'Failed to generate diet plan' },
        { status: 500 }
      )
    }

    console.log('✅ Diet plan generated successfully')

    return NextResponse.json({
      dietPlan: dietPlanResponse,
      userId,
      userEmail,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error generating diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 