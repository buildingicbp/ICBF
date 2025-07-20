'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function OAuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log("🔄 OAuth callback started")
        
        // Wait for client-side
        await new Promise(resolve => setTimeout(resolve, 200))
        
        if (typeof window === 'undefined') return
        
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search)
        const userType = params.get('userType') || 'member'
        
        console.log("🎯 UserType from URL:", userType)
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push('/signin')
          return
        }
        
        console.log("✅ User authenticated:", session.user.email)
        
        // Update metadata
        await supabase.auth.updateUser({
          data: { userType, signupDate: new Date().toISOString() }
        })
        
        // Create profile
        if (userType === 'trainer') {
          await supabase.from('trainers').insert({
            user_id: session.user.id,
            name: 'Trainer',
            email: 'trainer@example.com',
            phone: '1234567890',
            specialization: 'General Fitness',
            experience_years: 1,
            bio: 'New trainer',
            hourly_rate: 50,
            is_available: true,
            created_at: new Date().toISOString()
          })
          router.push('/trainer-dashboard')
        } else {
          await supabase.from('members').insert({
            user_id: session.user.id,
            name: 'Member',
            email: 'member@example.com',
            phone: '1234567890',
            age: 25,
            weight: 70,
            height: 170,
            fitness_goal: 'General Fitness',
            created_at: new Date().toISOString()
          })
          router.push('/member-dashboard')
        }
        
      } catch (error) {
        console.error("OAuth callback error:", error)
        router.push('/signin')
      } finally {
        setIsProcessing(false)
      }
    }
    
    processAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    </div>
  )
} 