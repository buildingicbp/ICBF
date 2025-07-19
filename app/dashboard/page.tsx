"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { supabase, supabaseService } from "@/lib/supabase"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("🏠 Dashboard page - User:", user)
      console.log("🏠 Dashboard page - Loading:", loading)
      
      if (!loading && !user) {
        console.log("❌ No user found, redirecting to signin")
        router.push("/signin")
        return
      }

      if (!loading && user) {
        console.log("✅ User found, checking user type")
        
        // Force refresh session to get latest metadata
        const { data: sessionData } = await supabase.auth.getSession()
        const currentUser = sessionData.session?.user || user
        
        console.log("📧 Current user metadata:", currentUser.user_metadata)
        
        // Get userType from metadata (set from toggle selection)
        const userType = currentUser.user_metadata?.userType || 'member'
        const userEmail = currentUser.email?.toLowerCase()
        
        console.log("🎯 User type from metadata (toggle selection):", userType)
        console.log("📧 User email:", userEmail)
        console.log("📧 Full user metadata:", currentUser.user_metadata)
        
        // Check if user is admin (specific email)
        if (userEmail === 'gouravpanda2k04@gmail.com') {
          console.log("👑 User is admin, redirecting to admin dashboard")
          router.push("/admin-dashboard")
          return
        }
        
        // PRIORITY: Use userType from metadata (toggle selection) first
        console.log("🎯 Using userType from metadata (toggle selection):", userType)
        
        if (userType === 'trainer') {
          console.log("🏋️ User is trainer (from toggle), redirecting to trainer dashboard")
          router.push("/trainer-dashboard")
          return
        } else {
          console.log("👤 User is member (from toggle), redirecting to member dashboard")
          router.push("/member-dashboard")
          return
        }
      }
    }

    // Add a small delay to ensure session is fully loaded
    const timer = setTimeout(() => {
      handleRedirect()
    }, 500)

    return () => clearTimeout(timer)
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