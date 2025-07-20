'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function OAuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log("🔄 ===== OAUTH CALLBACK START =====")
        setDebugInfo("Starting OAuth callback...")
        
        // Wait for client-side
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (typeof window === 'undefined') {
          console.log("❌ Not on client side")
          setDebugInfo("Not on client side")
          return
        }
        
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search)
        const userType = params.get('userType') || 'member'
        
        console.log("🎯 UserType from URL:", userType)
        console.log("🔗 Full URL:", window.location.href)
        console.log("🔗 Search params:", window.location.search)
        setDebugInfo(`UserType from URL: ${userType}`)
        
        // Get session
        console.log("🔄 Getting session...")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError)
          setDebugInfo(`Session error: ${sessionError.message}`)
          toast.error("Session error")
          router.push('/signin')
          return
        }
        
        if (!session?.user) {
          console.log("❌ No session found")
          setDebugInfo("No session found")
          toast.error("No user session found")
          router.push('/signin')
          return
        }
        
        console.log("✅ User authenticated:", session.user.email)
        console.log("📊 User metadata:", session.user.user_metadata)
        setDebugInfo(`User authenticated: ${session.user.email}`)
        
        // Update metadata
        console.log("🔄 Updating user metadata...")
        const { error: updateError } = await supabase.auth.updateUser({
          data: { userType, signupDate: new Date().toISOString() }
        })
        
        if (updateError) {
          console.error("❌ Failed to update metadata:", updateError)
          setDebugInfo(`Metadata update failed: ${updateError.message}`)
        } else {
          console.log("✅ Metadata updated successfully")
          setDebugInfo("Metadata updated successfully")
        }
        
        // Create profile
        console.log("🔄 Creating profile for userType:", userType)
        setDebugInfo(`Creating ${userType} profile...`)
        
        if (userType === 'trainer') {
          console.log("🏋️ Creating trainer profile...")
          const { data: trainerData, error: trainerError } = await supabase.from('trainers').insert({
            user_id: session.user.id,
            username: session.user.email?.split('@')[0] || 'trainer',
            email: session.user.email || 'trainer@example.com',
            contact: '1234567890',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Trainer',
            date_of_birth: null,
            gender: null,
            specialization: ['General Fitness'],
            certifications: [],
            experience_years: 1,
            bio: 'New trainer',
            hourly_rate: 50.00,
            rating: 0.00,
            total_reviews: 0,
            total_clients: 0,
            active_clients: 0,
            total_sessions: 0,
            join_date: new Date().toISOString(),
            is_verified: false,
            is_available: true,
            working_hours: null,
            location: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).select()
          
          if (trainerError) {
            console.error("❌ Trainer profile creation error:", trainerError)
            setDebugInfo(`Trainer profile error: ${trainerError.message}`)
            toast.error("Failed to create trainer profile")
            router.push('/signin')
            return
          }
          
          console.log("✅ Trainer profile created:", trainerData)
          setDebugInfo("Trainer profile created successfully")
          
          console.log("🎯 Redirecting to trainer dashboard...")
          setDebugInfo("Redirecting to trainer dashboard...")
          router.push('/trainer-dashboard')
          
        } else {
          console.log("👤 Creating member profile...")
          const { data: memberData, error: memberError } = await supabase.from('members').insert({
            user_id: session.user.id,
            username: session.user.email?.split('@')[0] || 'member',
            email: session.user.email || 'member@example.com',
            contact: '1234567890',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Member',
            date_of_birth: null,
            gender: null,
            height: null,
            weight: null,
            fitness_goals: ['General Fitness'],
            experience_level: 'beginner',
            medical_conditions: [],
            emergency_contact: null,
            membership_type: 'basic',
            join_date: new Date().toISOString(),
            last_workout: null,
            total_workouts: 0,
            current_streak: 0,
            longest_streak: 0,
            total_calories_burned: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).select()
          
          if (memberError) {
            console.error("❌ Member profile creation error:", memberError)
            setDebugInfo(`Member profile error: ${memberError.message}`)
            toast.error("Failed to create member profile")
            router.push('/signin')
            return
          }
          
          console.log("✅ Member profile created:", memberData)
          setDebugInfo("Member profile created successfully")
          
          console.log("🎯 Redirecting to member dashboard...")
          setDebugInfo("Redirecting to member dashboard...")
          router.push('/member-dashboard')
        }
        
      } catch (error) {
        console.error("💥 OAuth callback error:", error)
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        toast.error("Authentication failed")
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
        <p className="text-gray-600 mb-2">Setting up your account...</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">{debugInfo}</p>
      </div>
    </div>
  )
} 