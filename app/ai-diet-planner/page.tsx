"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Utensils, Target, Activity, Heart, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AIDietPlannerPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [dietPlan, setDietPlan] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    fitnessGoal: "",
    dietaryRestrictions: "",
    allergies: "",
    mealPreference: "",
    budget: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateDietPlan = async () => {
    // Validate required fields
    const requiredFields = ['age', 'weight', 'height', 'gender', 'activityLevel', 'fitnessGoal']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    setIsGenerating(true)
    setDietPlan(null)

    try {
      const response = await fetch('/api/generate-diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          userId: 'anonymous',
          userEmail: 'anonymous@example.com'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate diet plan')
      }

      const data = await response.json()
      setDietPlan(data.dietPlan)
      toast.success("Diet plan generated successfully!")
      
    } catch (error) {
      console.error('Error generating diet plan:', error)
      toast.error("Failed to generate diet plan. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image src="/logo.png" alt="ICBF Logo" width={120} height={40} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">AI Diet Planner</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Provide your details to get a personalized diet plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                  <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange('fitnessGoal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="improve_health">Improve Health</SelectItem>
                      <SelectItem value="increase_energy">Increase Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    placeholder="e.g., vegetarian, vegan, gluten-free, etc."
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="e.g., nuts, dairy, shellfish, etc."
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mealPreference">Meal Preference</Label>
                    <Select value={formData.mealPreference} onValueChange={(value) => handleInputChange('mealPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick_meals">Quick & Easy Meals</SelectItem>
                        <SelectItem value="gourmet">Gourmet Cooking</SelectItem>
                        <SelectItem value="meal_prep">Meal Prep Friendly</SelectItem>
                        <SelectItem value="no_preference">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget_friendly">Budget Friendly</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="no_limit">No Budget Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateDietPlan} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Diet Plan...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Generate Personalized Diet Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Your Personalized Diet Plan
                </CardTitle>
                <CardDescription>
                  AI-generated nutrition plan tailored to your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dietPlan ? (
                  <div className="prose prose-sm max-w-none space-y-6">
                    {/* Plan Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Plan Overview</h3>
                      <p className="text-sm leading-relaxed">{dietPlan.plan}</p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key Recommendations</h3>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {dietPlan.recommendations}
                      </div>
                    </div>

                    {/* Daily Meal Plan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Daily Meal Plan</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-blue-600">Breakfast</h4>
                          <p className="text-sm">{dietPlan.mealPlan.breakfast}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600">Lunch</h4>
                          <p className="text-sm">{dietPlan.mealPlan.lunch}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-600">Dinner</h4>
                          <p className="text-sm">{dietPlan.mealPlan.dinner}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-600">Snacks</h4>
                          <p className="text-sm">{dietPlan.mealPlan.snacks}</p>
                        </div>
                      </div>
                    </div>

                    {/* Calories and Macros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Daily Calories</h3>
                        <p className="text-sm">{dietPlan.calories}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Macronutrients</h3>
                        <div className="space-y-1 text-sm">
                          <p><strong>Protein:</strong> {dietPlan.macros.protein}</p>
                          <p><strong>Carbs:</strong> {dietPlan.macros.carbs}</p>
                          <p><strong>Fats:</strong> {dietPlan.macros.fats}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Plan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Detailed Plan</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-medium">Weekly Schedule</h4>
                          <p>{dietPlan.detailedPlan.weeklySchedule}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Shopping List</h4>
                          <div className="whitespace-pre-wrap">{dietPlan.detailedPlan.shoppingList}</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Meal Prep Tips</h4>
                          <p>{dietPlan.detailedPlan.mealPrepTips}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Hydration Guide</h4>
                          <p>{dietPlan.detailedPlan.hydrationGuide}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Supplements</h4>
                          <p>{dietPlan.detailedPlan.supplements}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Progress Tracking</h4>
                          <p>{dietPlan.detailedPlan.progressTracking}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Adjustments</h4>
                          <p>{dietPlan.detailedPlan.adjustments}</p>
                        </div>
                      </div>
                    </div>

                    {/* Nutrition Facts */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Fiber:</strong> {dietPlan.nutritionFacts.fiber}</p>
                          <p><strong>Vitamins:</strong> {dietPlan.nutritionFacts.vitamins}</p>
                        </div>
                        <div>
                          <p><strong>Minerals:</strong> {dietPlan.nutritionFacts.minerals}</p>
                          <p><strong>Omega-3:</strong> {dietPlan.nutritionFacts.omega3}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form and click "Generate Diet Plan" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Personalized</p>
                      <p className="text-xs text-gray-500">Tailored to your goals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">7-Day Plan</p>
                      <p className="text-xs text-gray-500">Complete weekly guide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 