"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

export default function CaloriesCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [calories, setCalories] = useState<number | null>(null)

  const calculateCalories = () => {
    if (age && gender && weight && height && activityLevel && goal) {
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr = 0
      if (gender === 'male') {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) + 5
      } else {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) - 161
      }

      // Apply activity multiplier
      const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very-active': 1.9
      }

      const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

      // Apply goal adjustment
      const goalAdjustments = {
        'lose': 0.85, // 15% deficit
        'maintain': 1,
        'gain': 1.15 // 15% surplus
      }

      const finalCalories = Math.round(tdee * goalAdjustments[goal as keyof typeof goalAdjustments])
      setCalories(finalCalories)
    }
  }

  const getActivityDescription = (level: string) => {
    const descriptions = {
      'sedentary': 'Little or no exercise',
      'light': 'Light exercise 1-3 days/week',
      'moderate': 'Moderate exercise 3-5 days/week',
      'active': 'Hard exercise 6-7 days/week',
      'very-active': 'Very hard exercise, physical job'
    }
    return descriptions[level as keyof typeof descriptions] || ''
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} className="h-8 w-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-black hover:text-slate-700 font-semibold">
            Home
          </Link>
          <Link href="/bmi-calculator" className="text-black hover:text-slate-700 font-semibold">
            BMI Calculator
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1F509A] mb-4">Calories Calculator</h1>
            <p className="text-lg text-slate-600">
              Calculate your daily calorie needs based on your goals and activity level
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Calculate Your Daily Calories</CardTitle>
              <CardDescription className="text-center">
                Enter your details to get personalized calorie recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g., 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Very Active</SelectItem>
                    <SelectItem value="very-active">Extremely Active</SelectItem>
                  </SelectContent>
                </Select>
                {activityLevel && (
                  <p className="text-sm text-slate-600">{getActivityDescription(activityLevel)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateCalories}
                className="w-full bg-[#1F509A] hover:bg-[#1a4a8a] text-white py-3 text-lg"
                disabled={!age || !gender || !weight || !height || !activityLevel || !goal}
              >
                Calculate Calories
              </Button>

              {calories && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-center">Your Daily Calorie Needs</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#1F509A] mb-2">
                      {calories.toLocaleString()}
                    </div>
                    <div className="text-lg text-slate-600">
                      calories per day
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-slate-600">
                    <p className="text-center">
                      This is an estimate based on your inputs. For personalized nutrition advice, 
                      consult with a certified nutritionist or fitness professional.
                    </p>
                  </div>
                </div>
              )}

              {/* Tips Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-[#1F509A]">💡 Tips:</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Adjust your calorie intake gradually for sustainable results</li>
                  <li>• Focus on nutrient-dense foods for better health</li>
                  <li>• Combine proper nutrition with regular exercise</li>
                  <li>• Monitor your progress and adjust as needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 