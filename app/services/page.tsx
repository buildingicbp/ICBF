"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Target, Users, Zap, Star, ArrowRight, Calendar, MessageCircle, Dumbbell, Utensils, BookOpen, TrendingUp } from "lucide-react"
import PricingSignupModal from "@/components/pricing-signup-modal"

export default function ServicesPage() {
  const [showPricingModal, setShowPricingModal] = useState(false)
  const openPricingModal = () => setShowPricingModal(true)
  const closePricingModal = () => setShowPricingModal(false)

  return (
    <div className="min-h-screen bg-white font-['Manrope']">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Transformation Services
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Journey to
              <span className="text-blue-600"> Transformation</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We don't just give workouts. We help you build habits, follow a structured path, 
              and stay consistent — for real change.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformation Timeline
            </h2>
            <p className="text-lg text-gray-600">
              Real change takes time, but the results are worth it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">4 Weeks</h3>
                <p className="text-gray-600">For you to see the change</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">8 Weeks</h3>
                <p className="text-gray-600">For family to see the change</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">12 Weeks</h3>
                <p className="text-gray-600">For the world to see the change</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Transformations Fail
            </h2>
            <p className="text-lg text-gray-600">
              The biggest reasons behind unsuccessful transformational journeys
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Lack of Knowledge",
                description: "Not knowing the right approach to fitness and nutrition",
                color: "red"
              },
              {
                icon: Target,
                title: "Lack of Guidance",
                description: "No expert direction to keep you on the right track",
                color: "orange"
              },
              {
                icon: TrendingUp,
                title: "Lack of Vision",
                description: "No clear picture of where you want to be",
                color: "yellow"
              },
              {
                icon: Zap,
                title: "Lack of Motivation",
                description: "Losing drive and willpower along the journey",
                color: "blue"
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Which eventually leads to <strong>lack of willpower & integral push</strong>. 
                  Sometimes people get desperate to lose weight and then they follow dieting. 
                  They do lose weight, only to gain it back, that too even more quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformation Packages
            </h2>
            <p className="text-lg text-gray-600">
              To bridge the above gaps we provide the following transformation packages
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 16 Weeks Package */}
            <Card className="border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-4 bg-gradient-to-b from-gray-50 to-white">
                <CardTitle className="text-2xl font-bold text-gray-900">16 Weeks</CardTitle>
                <p className="text-gray-600">Perfect starting point</p>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-sm text-gray-600 mb-8 text-center leading-relaxed">
                  We believe 16 weeks is a good enough time frame to say and feel ICanBeFitter.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Introduction call</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Goal Oriented Diet Plans</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Goal oriented workout plans</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Doubt Clearing sessions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Regular follow ups</span>
                  </div>
                </div>

                <Button onClick={openPricingModal} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* 6 Months Package - Recommended */}
            <Card className="border-2 border-blue-500 shadow-2xl rounded-2xl overflow-hidden relative transform scale-105">
              <CardHeader className="text-center pb-4 pt-8 bg-gradient-to-b from-blue-50 to-white">
                <CardTitle className="text-2xl font-bold text-gray-900">6 Months</CardTitle>
                <p className="text-gray-600 font-medium">Complete transformation</p>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-sm text-gray-600 mb-8 text-center leading-relaxed">
                  Especially designed for complete beginners. In this we offer everything you need for a complete transformation.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 font-medium">Everything from 16 weeks package</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Advanced nutrition guidance</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Progressive workout programs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Lifestyle coaching</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Community support</span>
                  </div>
                </div>

                <Button onClick={openPricingModal} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 font-bold shadow-lg">
                  Choose This Plan
                </Button>
              </CardContent>
            </Card>

            {/* 12 Months Package */}
            <Card className="border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-4 bg-gradient-to-b from-gray-50 to-white">
                <CardTitle className="text-2xl font-bold text-gray-900">12 Months</CardTitle>
                <p className="text-gray-600">Long-term lifestyle change</p>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-sm text-gray-600 mb-8 text-center leading-relaxed">
                  So you are in the Long Run! Bravo Fitness is a lifestyle and its better to learn and adopt it in our day to day life.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 font-medium">Everything from 6 months package</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Lifetime habit formation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Advanced fitness techniques</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Ongoing support & motivation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Lifestyle transformation</span>
                  </div>
                </div>

                <Button onClick={openPricingModal} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold">
                  Start Long Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600">
              We have everything which you would require to start transforming yourself
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Introduction Call",
                description: "Personal consultation to understand your goals"
              },
              {
                icon: Utensils,
                title: "Goal Oriented Diet Plans",
                description: "Customized nutrition plans for your specific needs"
              },
              {
                icon: Dumbbell,
                title: "Goal Oriented Workout Plans",
                description: "Structured exercise programs designed for you"
              },
              {
                icon: BookOpen,
                title: "Doubt Clearing Sessions",
                description: "Regular Q&A sessions to address your concerns"
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-2xl overflow-hidden text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Crisp, plain and to the point steps to be taken to Start Your Fitness Journey! 
            Even after reading, you think you need assistance, then To motivate you to the core 
            we present this amazing ONE Month Idea.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Our Guarantee
            </h3>
            <p className="text-blue-100 mb-4">
              If you are not satisfied with the progress in one month, money will be REFUNDED to you, 
              with a minor penalty of 1000/- Rs.
            </p>
            <p className="text-white font-semibold text-lg">
              Nothing to lose now and everything to gain. ICANBEFITTER!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/icanbefitter/30min" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Free Consultation
              </Button>
            </a>
            <Link href="/signin">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold flex items-center gap-2 bg-transparent">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PricingSignupModal isOpen={showPricingModal} onClose={closePricingModal} />
    </div>
  )
} 