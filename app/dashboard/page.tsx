"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    if (!loading && user) {
      // Redirect based on user type
      const userType = user.user_metadata?.userType || 'member'
      const userEmail = user.email?.toLowerCase()
      
      // Check if user is admin (specific email)
      if (userEmail === 'gouravpanda2k04@gmail.com') {
        router.push("/admin-dashboard")
        return
      }
      
      // Redirect to role-specific dashboard
      if (userType === 'trainer') {
        router.push("/trainer-dashboard")
      } else {
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
      </div>
    </div>
  )
} 