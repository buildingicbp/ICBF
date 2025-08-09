"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Users, Trophy, Target } from "lucide-react"

export default function WorkWithUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      alert("Thanks! Your application has been submitted.")
      ;(e.target as HTMLFormElement).reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Background */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <Image
          src="/Background.png"
          alt="Work with us background"
          fill
          priority
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-white/70" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4">
            Work with ICANBEFITTER
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Work With Us
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Flexible. Growth-focused. Impact-driven.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow">
              <Users className="w-4 h-4 text-blue-600" /> Community
            </span>
            <span className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow">
              <Target className="w-4 h-4 text-blue-600" /> Real impact
            </span>
            <span className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow">
              <Trophy className="w-4 h-4 text-blue-600" /> Growth
            </span>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Apply to Work With Us</CardTitle>
              <p className="text-gray-600">Share a few details and we will get back to you shortly.</p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" min={10} max={100} placeholder="Age" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <RadioGroup name="sex" defaultValue="male" className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="sex-m" value="male" />
                        <Label htmlFor="sex-m">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="sex-f" value="female" />
                        <Label htmlFor="sex-f">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="sex-o" value="other" />
                        <Label htmlFor="sex-o">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="Your phone number" required />
                  </div>
                </div>

                {/* Experience length */}
                <div className="space-y-2">
                  <Label htmlFor="fitnessYears">Since how long have you been in the world of fitness</Label>
                  <Input id="fitnessYears" name="fitnessYears" placeholder="e.g., 2 years, 6 months" />
                </div>

                {/* Fit yes/no */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Do you consider yourself fit?</Label>
                    <RadioGroup name="isFit" defaultValue="yes" className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="fit-yes" value="yes" />
                        <Label htmlFor="fit-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="fit-no" value="no" />
                        <Label htmlFor="fit-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Socials */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="insta">Instagram Handle</Label>
                    <Input id="insta" name="insta" placeholder="@yourhandle" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Handle</Label>
                    <Input id="linkedin" name="linkedin" placeholder="Profile URL or @handle" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="facebook">Facebook Handle</Label>
                    <Input id="facebook" name="facebook" placeholder="Profile URL or @handle" />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Upload your latest Resume</Label>
                  <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" />
                </div>

                {/* Work experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="experience">Work experience till now (describe in short)</Label>
                    <Textarea id="experience" name="experience" placeholder="Write a short paragraph..." rows={6} />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
