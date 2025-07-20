"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp, 
  Heart,
  Dumbbell,
  Clock,
  Award
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function MemberDashboardPage() {
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
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user.user_metadata?.username || 'Member'}! 💪
            </h1>
            <p className="text-blue-100">
              Ready to crush your fitness goals today? Let's track your progress and stay motivated!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Workouts This Week</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Goals Achieved</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold">7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Calories Burned</p>
                    <p className="text-2xl font-bold">2,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Start your fitness journey with these quick actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="lg">
                  <Activity className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Today's Schedule</span>
                </CardTitle>
                <CardDescription>
                  Your upcoming activities for today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Morning Cardio</p>
                    <p className="text-sm text-gray-600">30 min HIIT</p>
                  </div>
                  <span className="text-sm text-blue-600">9:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Strength Training</p>
                    <p className="text-sm text-gray-600">Upper Body</p>
                  </div>
                  <span className="text-sm text-green-600">6:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Yoga Session</p>
                    <p className="text-sm text-gray-600">Flexibility</p>
                  </div>
                  <span className="text-sm text-purple-600">8:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription>
                Celebrate your fitness milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-medium">7-Day Streak</p>
                  <p className="text-sm text-gray-600">Completed 7 workouts in a row</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Weight Goal</p>
                  <p className="text-sm text-gray-600">Lost 5kg this month</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Strength Milestone</p>
                  <p className="text-sm text-gray-600">Bench press: 100kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 