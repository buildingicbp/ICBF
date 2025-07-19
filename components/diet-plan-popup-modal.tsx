"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, Utensils, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface DietPlanPopupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DietPlanPopupModal({ isOpen, onClose }: DietPlanPopupModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleGetDietPlan = () => {
    if (!user) {
      // If not logged in, redirect to signin
      router.push('/signin')
      onClose()
      return
    }

    // Check user type and redirect to appropriate dashboard
    const userType = user.user_metadata?.userType || 'member'
    const userEmail = user.email?.toLowerCase()
    
    if (userEmail === 'gouravpanda2k04@gmail.com') {
      router.push('/admin-dashboard')
    } else if (userType === 'trainer') {
      router.push('/trainer-dashboard/ai-diet-planner')
    } else {
      router.push('/member-dashboard/ai-diet-planner')
    }
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <div className={`transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>

          {/* Content */}
          <div className="relative">
            {/* Background with gradient */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Get Your Personalized</h3>
                  <h4 className="text-base font-semibold">Diet Plan</h4>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="p-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                Transform your fitness journey with AI-powered nutrition plans tailored to your goals and lifestyle.
              </p>
              
              <Button 
                onClick={handleGetDietPlan}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get My Diet Plan
              </Button>
              
              <p className="text-xs text-gray-500 mt-3">
                Free • Takes 2 minutes • No credit card required
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 