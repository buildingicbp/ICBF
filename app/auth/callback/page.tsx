'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 ===== AUTH CALLBACK START =====")
        
        // Ensure we're on the client side
        if (typeof window === 'undefined') {
          console.log("❌ Not on client side, skipping")
          return
        }
        
        // Get userType from URL parameter using direct parsing
        const urlParams = new URLSearchParams(window.location.search)
        const userTypeFromUrl = urlParams.get('userType')
        console.log("🎯 userType from URL parameter:", userTypeFromUrl)
        console.log("🔗 Full URL:", window.location.href)
        console.log("🔗 URL search params:", window.location.search)
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError)
          toast.error("Authentication error")
          router.push('/signin')
          return
        }

        if (!session?.user) {
          console.log("❌ No session found")
          toast.error("No user session found")
          router.push('/signin')
          return
        }

        console.log("✅ User authenticated:", session.user.email)
        console.log("📊 Current user metadata:", session.user.user_metadata)
        
        // PRIORITY: Use userType from URL parameter, fallback to metadata
        const finalUserType = userTypeFromUrl || session.user.user_metadata?.userType || 'member'
        console.log("🎯 FINAL userType to use:", finalUserType)
        console.log("🎯 Source:", userTypeFromUrl ? 'URL parameter' : 'metadata fallback')
        
        // IMMEDIATELY update user metadata with userType
        console.log("🔄 ===== UPDATING USER METADATA =====")
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            userType: finalUserType,
            signupDate: new Date().toISOString()
          }
        })
        
        if (updateError) {
          console.error("❌ Failed to update user metadata:", updateError)
        } else {
          console.log("✅ User metadata updated with userType:", finalUserType)
        }
        
        // Create profile based on userType
        console.log("🔄 ===== CREATING PROFILE =====")
        const profileResult = await createUserProfile(session.user.id, finalUserType)
        
        if (profileResult.success) {
          console.log("✅ Profile created successfully")
          console.log("🎯 Redirecting to dashboard for userType:", finalUserType)
          
          // Redirect based on userType
          if (finalUserType === 'trainer') {
            router.push('/trainer-dashboard')
          } else {
            router.push('/member-dashboard')
          }
        } else {
          console.error("❌ Profile creation failed:", profileResult.error)
          toast.error("Failed to create profile")
          router.push('/signin')
        }
        
      } catch (error) {
        console.error("💥 Auth callback error:", error)
        toast.error("Authentication failed")
        router.push('/signin')
      } finally {
        setIsProcessing(false)
      }
    }

    handleAuthCallback()
  }, [router])

  const createUserProfile = async (userId: string, userType: string) => {
    console.log("🔄 Creating profile for user:", userId, "with type:", userType)
    
    try {
      if (userType === 'trainer') {
        const { error } = await supabase
          .from('trainers')
          .insert({
            user_id: userId,
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
        
        if (error) {
          console.error("❌ Trainer profile creation error:", error)
          return { success: false, error }
        }
        
        console.log("✅ Trainer profile created")
        return { success: true }
      } else {
        const { error } = await supabase
          .from('members')
          .insert({
            user_id: userId,
            name: 'Member',
            email: 'member@example.com',
            phone: '1234567890',
            age: 25,
            weight: 70,
            height: 170,
            fitness_goal: 'General Fitness',
            created_at: new Date().toISOString()
          })
        
        if (error) {
          console.error("❌ Member profile creation error:", error)
          return { success: false, error }
        }
        
        console.log("✅ Member profile created")
        return { success: true }
      }
    } catch (error) {
      console.error("💥 Profile creation error:", error)
      return { success: false, error }
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  return null
} 