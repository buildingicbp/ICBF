"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Utensils, Star, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface DietPlanModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DietPlanModal({ isOpen, onClose }: DietPlanModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleGetPlan = () => {
    // Add your logic here for getting the diet plan
    console.log('Getting personalized diet plan...')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className={`transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Header with Background */}
          <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Get Your Free</h2>
                <h3 className="text-xl font-semibold">Personalized Diet Plan</h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Benefits */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">Customized to your body type & goals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">Nutritionist-approved meal plans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">Easy-to-follow recipes & shopping lists</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">Progress tracking & adjustments</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-center text-gray-600">
                Trusted by 10,000+ fitness enthusiasts
              </p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleGetPlan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get My Free Diet Plan
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              No credit card required • Takes 2 minutes to complete
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 