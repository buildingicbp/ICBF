"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("Dashboard page - User:", user)
      console.log("Dashboard page - Loading:", loading)
      
      if (!loading && !user) {
        console.log("No user found, redirecting to signin")
        router.push("/signin")
        return
      }

      if (!loading && user) {
        console.log("User found, checking user type")
        // Redirect based on user type
        const userType = user.user_metadata?.userType || 'member'
        const userEmail = user.email?.toLowerCase()
        
        console.log("User type from metadata:", userType)
        console.log("User email:", userEmail)
        console.log("Full user metadata:", user.user_metadata)
        
        // Check if user is admin (specific email)
        if (userEmail === 'gouravpanda2k04@gmail.com') {
          console.log("User is admin, redirecting to admin dashboard")
          router.push("/admin-dashboard")
          return
        }
        
        // Try to determine user type from database if metadata is not set
        if (!user.user_metadata?.userType) {
          console.log("No userType in metadata, checking database...")
          try {
            // Check if user exists in trainers table
            const { data: trainerData } = await supabase
              .from('trainers')
              .select('id')
              .eq('user_id', user.id)
              .single()
            
            if (trainerData) {
              console.log("User found in trainers table, redirecting to trainer dashboard")
              router.push("/trainer-dashboard")
              return
            }
            
            // Check if user exists in members table
            const { data: memberData } = await supabase
              .from('members')
              .select('id')
              .eq('user_id', user.id)
              .single()
            
            if (memberData) {
              console.log("User found in members table, redirecting to member dashboard")
              router.push("/member-dashboard")
              return
            }
          } catch (error) {
            console.log("Error checking database for user type:", error)
          }
        }
        
        // Redirect to role-specific dashboard based on metadata
        if (userType === 'trainer') {
          console.log("User is trainer, redirecting to trainer dashboard")
          router.push("/trainer-dashboard")
        } else {
          console.log("User is member, redirecting to member dashboard")
          router.push("/member-dashboard")
        }
      }
    }

    handleRedirect()
  }, [user, loading, router])

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        <p className="mt-2 text-sm text-gray-500">
          User: {user ? user.email : 'None'} | Loading: {loading ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  )
} 