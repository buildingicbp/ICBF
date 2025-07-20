"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import AIDietPlanner from "@/components/ai-diet-planner"

export default function TrainerAIDietPlannerPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    if (!loading && user) {
      const userType = user.user_metadata?.userType || 'member'
      const userEmail = user.email?.toLowerCase()
      
      // Redirect if not a trainer
      if (userEmail === 'icanbefitter@gmail.com') {
        router.push("/admin-dashboard")
        return
      }
      
      if (userType === 'member') {
        router.push("/member-dashboard")
        return
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar userType="trainer" activePage="ai-diet-planner" />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-4 lg:p-8">
        <AIDietPlanner />
      </main>
    </div>
  )
} 