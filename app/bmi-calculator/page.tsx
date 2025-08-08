"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100 // Convert cm to meters
      const weightInKg = parseFloat(weight)
      const bmiValue = weightInKg / (heightInMeters * heightInMeters)
      setBmi(parseFloat(bmiValue.toFixed(1)))

      // Determine BMI category
      if (bmiValue < 18.5) {
        setCategory('Underweight')
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setCategory('Normal weight')
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory('Overweight')
      } else {
        setCategory('Obese')
      }
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Underweight': return 'text-blue-600'
      case 'Normal weight': return 'text-green-600'
      case 'Overweight': return 'text-yellow-600'
      case 'Obese': return 'text-red-600'
      default: return 'text-gray-600'
    }
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
          <Link href="/calories-calculator" className="text-black hover:text-slate-700 font-semibold">
            Calories Calculator
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1F509A] mb-4">BMI Calculator</h1>
            <p className="text-lg text-slate-600">
              Calculate your Body Mass Index (BMI) to understand your weight category
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Calculate Your BMI</CardTitle>
              <CardDescription className="text-center">
                Enter your height and weight to get your BMI and weight category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <Button 
                onClick={calculateBMI}
                className="w-full bg-[#1F509A] hover:bg-[#1a4a8a] text-white py-3 text-lg"
                disabled={!height || !weight}
              >
                Calculate BMI
              </Button>

              {bmi && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-center">Your Results</h3>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-[#1F509A]">
                      {bmi}
                    </div>
                    <div className={`text-xl font-semibold ${getCategoryColor(category)}`}>
                      {category}
                    </div>
                  </div>
                </div>
              )}

              {/* BMI Categories Reference */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">BMI Categories:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Underweight:</span>
                    <span className="text-blue-600">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal weight:</span>
                    <span className="text-green-600">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overweight:</span>
                    <span className="text-yellow-600">25.0 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obese:</span>
                    <span className="text-red-600">≥ 30.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 