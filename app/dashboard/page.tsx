"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
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
      
      console.log("User type:", userType)
      console.log("User email:", userEmail)
      
      // Check if user is admin (specific email)
      if (userEmail === 'gouravpanda2k04@gmail.com') {
        console.log("User is admin, redirecting to admin dashboard")
        router.push("/admin-dashboard")
        return
      }
      
      // Redirect to role-specific dashboard
      if (userType === 'trainer') {
        console.log("User is trainer, redirecting to trainer dashboard")
        router.push("/trainer-dashboard")
      } else {
        console.log("User is member, redirecting to member dashboard")
        router.push("/member-dashboard")
      }
    }
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