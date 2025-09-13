"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  Calendar, 
  Heart,
  Dumbbell,
  Clock,
  Award,
  LogOut
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function MemberDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If loading is complete and no user, redirect to signin
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // If user exists and loading is complete
    if (!loading && user) {
      // Check if email is confirmed
      if (!user.email_confirmed_at) {
        router.push("/verification")
        return
      }

      const userType = user.user_metadata?.userType || 'member'
      const userEmail = user.email?.toLowerCase()
      
      // Redirect if not a member
      if (userEmail === 'icanbefitter@gmail.com') {
        router.push("/admin-dashboard")
        return
      }
      
      if (userType === 'trainer') {
        router.push("/trainer-dashboard")
        return
      }
    }
  }, [user, loading, router])

  // Add a separate effect to handle sign-out redirect
  useEffect(() => {
    // If user becomes null after being authenticated, redirect to home
    if (!loading && !user && typeof window !== 'undefined') {
      // Check if we're on a dashboard page
      if (window.location.pathname.includes('dashboard')) {
        window.location.href = '/'
      }
    }
  }, [user, loading])



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
      <DashboardSidebar userType="member" activePage="dashboard" />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-4 lg:p-8">
        {/* Sign Out Button - Top Right */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={async () => {
              try {
                await signOut()
                // Force redirect to home page
                window.location.href = '/'
              } catch (error) {
                console.error('Sign out error:', error)
                // Fallback redirect
                window.location.href = '/'
              }
            }}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-600"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Hello, Alex Johnson!</h1>
            <p className="text-blue-100">Ready for a great workout?</p>
          </div>

          {/* Stats Overview (mirrors the image, excluding Message Coach) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Program Dates</p>
                    <p className="text-lg font-semibold">Aug 1, 2025 - Nov 30, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Objective</p>
                    <p className="text-lg font-semibold">Weight Loss, Muscle Gain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Left</p>
                    <p className="text-2xl font-bold">1 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Start Weight</p>
                    <p className="text-2xl font-bold">150 lbs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Workouts Completed</p>
                    <p className="text-2xl font-bold">15 / 20</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Plan */}
          <Card id="today">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="w-5 h-5" />
                <span>Today's Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600 mb-2">Full-Body Strength</div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Squats</span>
                <span className="text-sm text-gray-600">5 sets x 5 reps</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Bench</span>
                <span className="text-sm text-gray-600">3 sets x 8 reps</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Deadlift</span>
                <span className="text-sm text-gray-600">5 sets x 5 reps</span>
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan note */}
          <Card id="meal">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Meal Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Focus on lean protein and vegetables.</p>
            </CardContent>
          </Card>

          {/* Progress Photos */}
          <Card id="photos">
            <CardHeader>
              <CardTitle>Progress Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="w-20 h-28 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">Week 1</div>
                <div className="w-20 h-32 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">Week 2</div>
                <div className="w-20 h-36 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">Week 3</div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card id="activity">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="flex items-center justify-between py-3">
                <span>Leg Day</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span>Logged Cardio</span>
                <span className="text-xs text-gray-500">4 days ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span>Cardio Session</span>
                <span className="text-xs text-gray-500">yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 