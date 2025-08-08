"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Utensils, Loader2, Sparkles, Target, Scale, Activity, User, Download, FileText, Calendar, ShoppingCart, Droplets, Pill, TrendingUp, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { generateDietPlanWithGemini } from '@/lib/gemini-ai'

interface DietPlanForm {
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

export default function AIDietPlanner() {
  const [formData, setFormData] = useState<DietPlanForm>({
    gender: '',
    age: '',
    height: '',
    bodyFat: '',
    workoutFrequency: '',
    currentWeight: '',
    goalWeight: '',
    goalBodyFat: '',
    goal: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: keyof DietPlanForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateDietPlan = async () => {
    // Validate form
    const requiredFields = ['gender', 'age', 'height', 'bodyFat', 'workoutFrequency', 'currentWeight', 'goalWeight', 'goal']
    const missingFields = requiredFields.filter(field => !formData[field as keyof DietPlanForm])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      // Generate diet plan using Gemini AI
      const generatedDietPlan = await generateDietPlanWithGemini(formData)
      
      setDietPlan(generatedDietPlan)
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized diet plan is ready.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      gender: '',
      age: '',
      height: '',
      bodyFat: '',
      workoutFrequency: '',
      currentWeight: '',
      goalWeight: '',
      goalBodyFat: '',
      goal: ''
    })
    setDietPlan(null)
  }

  const downloadPDF = async () => {
    if (!dietPlan) return

    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20

      // Title
      pdf.setFontSize(24)
      pdf.setTextColor(30, 64, 175) // Blue color
      pdf.text('AI Diet Plan', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // User Info
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Generated for: ${formData.age}-year-old ${formData.gender}`, 20, yPosition)
      yPosition += 8
      pdf.text(`Current Weight: ${formData.currentWeight}kg → Goal Weight: ${formData.goalWeight}kg`, 20, yPosition)
      yPosition += 8
      pdf.text(`Goal: ${formData.goal}`, 20, yPosition)
      yPosition += 15

      // Plan Overview
      pdf.setFontSize(16)
      pdf.setTextColor(30, 64, 175)
      pdf.text('Plan Overview', 20, yPosition)
      yPosition += 8
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      const planLines = pdf.splitTextToSize(dietPlan.plan, pageWidth - 40)
      pdf.text(planLines, 20, yPosition)
      yPosition += planLines.length * 5 + 10

      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = 20
      }

      // Recommendations
      pdf.setFontSize(16)
      pdf.setTextColor(30, 64, 175)
      pdf.text('Key Recommendations', 20, yPosition)
      yPosition += 8
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      const recommendations = dietPlan.recommendations.split('\n')
      recommendations.forEach(rec => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(`• ${rec}`, 20, yPosition)
        yPosition += 6
      })
      yPosition += 10

      // Nutrition Targets
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.setFontSize(16)
      pdf.setTextColor(30, 64, 175)
      pdf.text('Daily Nutrition Targets', 20, yPosition)
      yPosition += 8
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Calories: ${dietPlan.calories}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Protein: ${dietPlan.macros.protein}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Carbs: ${dietPlan.macros.carbs}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Fats: ${dietPlan.macros.fats}`, 20, yPosition)
      yPosition += 15

      // Meal Plan
      if (yPosition > pageHeight - 80) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.setFontSize(16)
      pdf.setTextColor(30, 64, 175)
      pdf.text('Daily Meal Plan', 20, yPosition)
      yPosition += 8
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      
      const meals = [
        { name: 'Breakfast', content: dietPlan.mealPlan.breakfast },
        { name: 'Lunch', content: dietPlan.mealPlan.lunch },
        { name: 'Dinner', content: dietPlan.mealPlan.dinner },
        { name: 'Snacks', content: dietPlan.mealPlan.snacks }
      ]

      meals.forEach(meal => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.setFontSize(12)
        pdf.setTextColor(30, 64, 175)
        pdf.text(meal.name, 20, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        const mealLines = pdf.splitTextToSize(meal.content, pageWidth - 40)
        pdf.text(mealLines, 20, yPosition)
        yPosition += mealLines.length * 5 + 8
      })

      // Detailed Plan Sections
      const detailedSections = [
        { title: 'Weekly Schedule', content: dietPlan.detailedPlan.weeklySchedule, icon: Calendar },
        { title: 'Shopping List', content: dietPlan.detailedPlan.shoppingList, icon: ShoppingCart },
        { title: 'Meal Prep Tips', content: dietPlan.detailedPlan.mealPrepTips, icon: FileText },
        { title: 'Hydration Guide', content: dietPlan.detailedPlan.hydrationGuide, icon: Droplets },
        { title: 'Supplements', content: dietPlan.detailedPlan.supplements, icon: Pill },
        { title: 'Progress Tracking', content: dietPlan.detailedPlan.progressTracking, icon: TrendingUp },
        { title: 'Plan Adjustments', content: dietPlan.detailedPlan.adjustments, icon: Settings }
      ]

      detailedSections.forEach(section => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.setFontSize(16)
        pdf.setTextColor(30, 64, 175)
        pdf.text(section.title, 20, yPosition)
        yPosition += 8
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        const sectionLines = pdf.splitTextToSize(section.content, pageWidth - 40)
        pdf.text(sectionLines, 20, yPosition)
        yPosition += sectionLines.length * 5 + 10
      })

      // Nutrition Facts
      if (yPosition > pageHeight - 80) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.setFontSize(16)
      pdf.setTextColor(30, 64, 175)
      pdf.text('Nutrition Facts', 20, yPosition)
      yPosition += 8
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      
      const nutritionFacts = [
        { name: 'Fiber', content: dietPlan.nutritionFacts.fiber },
        { name: 'Vitamins', content: dietPlan.nutritionFacts.vitamins },
        { name: 'Minerals', content: dietPlan.nutritionFacts.minerals },
        { name: 'Omega-3', content: dietPlan.nutritionFacts.omega3 }
      ]

      nutritionFacts.forEach(fact => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.setFontSize(12)
        pdf.setTextColor(30, 64, 175)
        pdf.text(fact.name, 20, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        const factLines = pdf.splitTextToSize(fact.content, pageWidth - 40)
        pdf.text(factLines, 20, yPosition)
        yPosition += factLines.length * 5 + 8
      })

      // Footer
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(128, 128, 128)
        pdf.text(`Generated by ICBF AI Diet Planner - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }

      // Save the PDF
      const fileName = `diet-plan-${formData.gender}-${formData.age}-${formData.goal}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast({
        title: "PDF Downloaded!",
        description: "Your detailed diet plan has been saved.",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Diet Planner</h1>
            <p className="text-blue-100">Get your personalized diet plan powered by AI</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Your Profile</span>
            </CardTitle>
            <CardDescription>
              Provide your details to generate a personalized diet plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  placeholder="70"
                  value={formData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat %</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="20"
                  value={formData.bodyFat}
                  onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workoutFrequency">Workout Frequency</Label>
                <Select value={formData.workoutFrequency} onValueChange={(value) => handleInputChange('workoutFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1-2">1-2 times/week</SelectItem>
                    <SelectItem value="3-4">3-4 times/week</SelectItem>
                    <SelectItem value="5-6">5-6 times/week</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  placeholder="65"
                  value={formData.goalWeight}
                  onChange={(e) => handleInputChange('goalWeight', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goalBodyFat">Goal Body Fat %</Label>
                <Input
                  id="goalBodyFat"
                  type="number"
                  placeholder="15"
                  value={formData.goalBodyFat}
                  onChange={(e) => handleInputChange('goalBodyFat', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Primary Goal</Label>
              <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose weight">Lose Weight</SelectItem>
                  <SelectItem value="gain muscle">Gain Muscle</SelectItem>
                  <SelectItem value="maintain weight">Maintain Weight</SelectItem>
                  <SelectItem value="improve health">Improve Health</SelectItem>
                  <SelectItem value="reduce body fat">Reduce Body Fat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={generateDietPlan} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Diet Plan
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {dietPlan ? (
            <>
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Your Diet Plan</span>
                    </div>
                    <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{dietPlan.plan}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Key Recommendations:</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      {dietPlan.recommendations.split('\n').map((rec, index) => (
                        <p key={index} className="text-sm text-gray-700 mb-2 last:mb-0">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Targets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Daily Nutrition Targets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calories */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                      <h4 className="font-semibold mb-2">Daily Calories</h4>
                      <p className="text-2xl font-bold">{dietPlan.calories}</p>
                    </div>
                    
                    {/* Macros */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Macronutrients</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-red-600 font-medium">Protein</p>
                          <p className="text-lg font-bold text-red-700">{dietPlan.macros.protein}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-yellow-600 font-medium">Carbs</p>
                          <p className="text-lg font-bold text-yellow-700">{dietPlan.macros.carbs}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-green-600 font-medium">Fats</p>
                          <p className="text-lg font-bold text-green-700">{dietPlan.macros.fats}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meal Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="w-5 h-5" />
                    <span>Daily Meal Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Breakfast</h4>
                      <p className="text-sm text-green-700">{dietPlan.mealPlan.breakfast}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Lunch</h4>
                      <p className="text-sm text-blue-700">{dietPlan.mealPlan.lunch}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Dinner</h4>
                      <p className="text-sm text-purple-700">{dietPlan.mealPlan.dinner}</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Snacks</h4>
                      <p className="text-sm text-orange-700">{dietPlan.mealPlan.snacks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Plan Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Weekly Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{dietPlan.detailedPlan.weeklySchedule}</p>
                  </CardContent>
                </Card>

                {/* Shopping List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Shopping List</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {dietPlan.detailedPlan.shoppingList.split('\n').map((item, index) => (
                        <p key={index} className="text-sm text-gray-700 mb-1 last:mb-0">
                          {item}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Meal Prep Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Meal Prep Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{dietPlan.detailedPlan.mealPrepTips}</p>
                  </CardContent>
                </Card>

                {/* Hydration Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Droplets className="w-5 h-5" />
                      <span>Hydration Guide</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{dietPlan.detailedPlan.hydrationGuide}</p>
                  </CardContent>
                </Card>

                {/* Supplements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="w-5 h-5" />
                      <span>Supplements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{dietPlan.detailedPlan.supplements}</p>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Progress Tracking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{dietPlan.detailedPlan.progressTracking}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Adjustments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Plan Adjustments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{dietPlan.detailedPlan.adjustments}</p>
                </CardContent>
              </Card>

              {/* Nutrition Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Nutrition Facts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Fiber</h4>
                        <p className="text-sm text-yellow-700">{dietPlan.nutritionFacts.fiber}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Vitamins</h4>
                        <p className="text-sm text-green-700">{dietPlan.nutritionFacts.vitamins}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Minerals</h4>
                        <p className="text-sm text-blue-700">{dietPlan.nutritionFacts.minerals}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-800 mb-2">Omega-3</h4>
                        <p className="text-sm text-purple-700">{dietPlan.nutritionFacts.omega3}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="w-5 h-5" />
                  <span>Your Diet Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Diet Plan Yet</h3>
                  <p className="text-gray-500">
                    Fill in your details and click "Generate Diet Plan" to get your personalized nutrition plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 