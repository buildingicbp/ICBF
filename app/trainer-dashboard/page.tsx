"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  Star,
  MessageSquare,
  Clock,
  Award,
  Target,
  DollarSign,
  LogOut
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function TrainerDashboardPage() {
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
      const userType = user.user_metadata?.userType || 'member'
      const userEmail = user.email?.toLowerCase()
      
      // Redirect if not a trainer
      if (userEmail === 'icanbefitter@gmail.com') {
        router.push("/admin-dashboard")
        return
      }
      
      if (userType !== 'trainer') {
        router.push("/member-dashboard")
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
      <DashboardSidebar userType="trainer" activePage="dashboard" />
      
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user.user_metadata?.username || 'Trainer'}! 🏋️‍♂️
            </h1>
            <p className="text-green-100">
              Ready to inspire and guide your clients to their fitness goals today?
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sessions Today</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold">4.9</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Monthly Earnings</p>
                    <p className="text-2xl font-bold">$3,240</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Today's Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Manage your training business efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  View All Clients
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Client Messages
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Target className="w-4 h-4 mr-2" />
                  Create Workout Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Today's Sessions</span>
                </CardTitle>
                <CardDescription>
                  Your scheduled training sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-gray-600">Strength Training</p>
                  </div>
                  <span className="text-sm text-blue-600">9:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Cardio HIIT</p>
                  </div>
                  <span className="text-sm text-green-600">11:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mike Davis</p>
                    <p className="text-sm text-gray-600">Weight Loss</p>
                  </div>
                  <span className="text-sm text-purple-600">2:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Lisa Wilson</p>
                    <p className="text-sm text-gray-600">Yoga & Stretching</p>
                  </div>
                  <span className="text-sm text-orange-600">4:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Client Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Client Progress Updates</span>
              </CardTitle>
              <CardDescription>
                Recent achievements and milestones from your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <p className="font-medium">John Smith</p>
                  </div>
                  <p className="text-sm text-gray-600">Lost 3kg this week</p>
                  <p className="text-xs text-green-600 mt-1">Goal: Weight Loss</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="font-medium">Sarah Johnson</p>
                  </div>
                  <p className="text-sm text-gray-600">Improved running pace by 15%</p>
                  <p className="text-xs text-blue-600 mt-1">Goal: Endurance</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <p className="font-medium">Mike Davis</p>
                  </div>
                  <p className="text-sm text-gray-600">Bench press: 120kg (new PR!)</p>
                  <p className="text-xs text-purple-600 mt-1">Goal: Strength</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <CardDescription>
                Your next few scheduled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Emma Thompson</p>
                      <p className="text-sm text-gray-600">Personal Training - Core Focus</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Tomorrow</p>
                    <p className="text-xs text-gray-600">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">David Brown</p>
                      <p className="text-sm text-gray-600">Group Fitness - HIIT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Wednesday</p>
                    <p className="text-xs text-gray-600">6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 