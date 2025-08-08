"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        console.log("🔄 ===== DASHBOARD ROUTING START =====")
        
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
          router.push('/signin')
          return
        }

        console.log("✅ User authenticated:", session.user.email)
        console.log("📊 User metadata:", session.user.user_metadata)
        
        // PRIORITY: Check userType in metadata FIRST
        const userTypeFromMetadata = session.user.user_metadata?.userType
        console.log("🎯 userType from metadata:", userTypeFromMetadata)
        
        if (userTypeFromMetadata) {
          console.log("✅ Found userType in metadata:", userTypeFromMetadata)
          console.log("🎯 Redirecting based on metadata userType")
          
          if (userTypeFromMetadata === 'trainer') {
            console.log("🏋️ Redirecting to trainer dashboard")
            router.push('/trainer-dashboard')
            return
          } else {
            console.log("👤 Redirecting to member dashboard")
            router.push('/member-dashboard')
            return
          }
        }
        
        // Fallback: Check database for profile
        console.log("🔄 No userType in metadata, checking database...")
        
        const userId = session.user.id
        
        // Check trainers table
        const { data: trainerData, error: trainerError } = await supabase
          .from('trainers')
          .select('id')
          .eq('user_id', userId)
          .single()
        
        if (trainerError && trainerError.code !== 'PGRST116') {
          console.error("❌ Error checking trainers table:", trainerError)
        }
        
        // Check members table
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('id')
          .eq('user_id', userId)
          .single()
        
        if (memberError && memberError.code !== 'PGRST116') {
          console.error("❌ Error checking members table:", memberError)
        }
        
        console.log("📊 Trainer data:", trainerData)
        console.log("📊 Member data:", memberData)
        
        // Determine userType based on database
        if (trainerData && !memberData) {
          console.log("🏋️ Found trainer profile, redirecting to trainer dashboard")
          router.push('/trainer-dashboard')
        } else if (memberData && !trainerData) {
          console.log("👤 Found member profile, redirecting to member dashboard")
          router.push('/member-dashboard')
        } else if (trainerData && memberData) {
          console.log("⚠️ User found in both tables, defaulting to trainer")
          router.push('/trainer-dashboard')
        } else {
          console.log("❌ No profile found, redirecting to signin")
          toast.error("No user profile found")
          router.push('/signin')
        }
        
      } catch (error) {
        console.error("💥 Dashboard routing error:", error)
        toast.error("Error determining user type")
        router.push('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndRedirect()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Determining your dashboard...</p>
        </div>
      </div>
    )
  }

  return null
} 