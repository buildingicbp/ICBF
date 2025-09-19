"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  Calendar, 
  Heart,
  Dumbbell,
  Clock,
  Award,
  LogOut,
  Scale,
  Activity,
  Utensils,
  MessageSquare
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TrainerActionsCard } from "@/components/trainer-actions-card"

export default function MemberDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [memberProfile, setMemberProfile] = useState<any>(null)
  const [assignedTrainer, setAssignedTrainer] = useState<any>(null)
  const [todaysActions, setTodaysActions] = useState<any[]>([])

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

  // Fetch member profile and trainer info
  useEffect(() => {
    if (user && !loading) {
      fetchMemberProfile()
      fetchAssignedTrainer()
    }
  }, [user, loading])

  // Fetch today's actions when member profile is loaded
  useEffect(() => {
    if (memberProfile?.id && user?.email) {
      fetchTodaysActions()
    }
  }, [memberProfile, user])

  const fetchMemberProfile = async () => {
    try {
      const userEmail = user?.email
      if (!userEmail) return
      
      const response = await fetch(`/api/member-profile?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setMemberProfile(data.member)
      }
    } catch (error) {
      console.error('Error fetching member profile:', error)
    }
  }

  const fetchAssignedTrainer = async () => {
    try {
      const userEmail = user?.email
      if (!userEmail) return
      
      const response = await fetch(`/api/member-trainer?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setAssignedTrainer(data.trainer)
      }
    } catch (error) {
      console.error('Error fetching assigned trainer:', error)
    }
  }

  const fetchTodaysActions = async () => {
    try {
      const userEmail = user?.email
      if (!userEmail || !memberProfile?.id) return
      
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/trainer-actions/member/${memberProfile.id}?email=${encodeURIComponent(userEmail)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        // Filter for today's actions or recent workout-related actions
        const relevantActions = data.actions?.filter((action: any) => 
          action.action_type === 'workout_plan' || 
          action.action_date === today ||
          action.action_type === 'motivation'
        ) || []
        setTodaysActions(relevantActions)
      }
    } catch (error) {
      console.error('Error fetching today\'s actions:', error)
    }
  }



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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-1">Hello, {memberProfile?.full_name || memberProfile?.username || user?.user_metadata?.username || 'Member'}!</h1>
                <p className="text-blue-100">You're <span className="font-medium">28 days</span> into your <span className="font-medium">16-week</span> plan. Keep up the great work!</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Your Coach:</p>
                <p className="font-medium">{assignedTrainer?.full_name || 'Not assigned yet'}</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Weight</p>
                    <p className="text-2xl font-bold">68.5 kg</p>
                    <p className="text-xs text-green-500">↓ 1.2 kg (Last Month)</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Body Fat %</p>
                    <p className="text-2xl font-bold">18.2%</p>
                    <p className="text-xs text-green-500">↓ 2.1% (Last Month)</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Workouts This Week</p>
                    <p className="text-2xl font-bold">3/5</p>
                    <p className="text-xs text-gray-500">2 more to reach goal</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Dumbbell className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Daily Calories</p>
                    <p className="text-2xl font-bold">1,850</p>
                    <p className="text-xs text-gray-500">Target: 2,100</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Utensils className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workout Plan */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Today's Workout</CardTitle>
                  <CardDescription className="text-sm">Upper Body Strength</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Bench Press</span>
                      <span className="text-sm text-gray-500">4 sets × 8-10 reps</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500">Last: 60kg × 8</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pull-ups</span>
                      <span className="text-sm text-gray-500">3 sets × 8-12 reps</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500">Last: BW × 10</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overhead Press</span>
                      <span className="text-sm text-gray-500">3 sets × 10-12 reps</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500">Last: 30kg × 10</div>
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Start Workout
                  </Button>
                  
                  {/* Today's Trainer Actions */}
                  {todaysActions.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                        Today's Instructions from {assignedTrainer?.full_name || 'Your Trainer'}
                      </h4>
                      <div className="space-y-2">
                        {todaysActions.slice(0, 2).map((action) => (
                          <div key={action.id} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{action.title}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                action.priority === 'high' ? 'bg-red-100 text-red-800' :
                                action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {action.priority}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{action.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {/* This would be a chart in a real implementation */}
                      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Weight & Body Fat % Chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Progress Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{memberProfile?.total_workouts || 0}</div>
                        <div className="text-sm text-gray-600">Total Workouts</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{memberProfile?.current_streak || 0}</div>
                        <div className="text-sm text-gray-600">Current Streak</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{memberProfile?.longest_streak || 0}</div>
                        <div className="text-sm text-gray-600">Best Streak</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{Math.floor((memberProfile?.total_calories_burned || 0) / 1000)}k</div>
                        <div className="text-sm text-gray-600">Calories Burned</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Trainer Messages - Priority Position */}
              {memberProfile?.id && user?.email && (
                <TrainerActionsCard memberId={memberProfile.id} userEmail={user.email} />
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Meal Plan</CardTitle>
                  <CardDescription className="text-sm">Today's Nutrition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calories</span>
                        <span>1,450/2,100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '69%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-medium">Protein</p>
                        <p>120g</p>
                      </div>
                      <div>
                        <p className="font-medium">Carbs</p>
                        <p>180g</p>
                      </div>
                      <div>
                        <p className="font-medium">Fats</p>
                        <p>50g</p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium">Next Meal</p>
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dinner</p>
                          <p className="text-xs text-gray-500">Grilled Chicken & Veggies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Upcoming Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-center">
                      <p className="text-sm font-medium">TUE</p>
                      <p className="text-2xl font-bold text-blue-600">14</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Leg Day</p>
                      <p className="text-sm text-gray-500">6:00 PM - 7:00 PM</p>
                      <p className="text-xs text-gray-400">With Trainer John</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-sm font-medium">THU</p>
                      <p className="text-2xl font-bold text-gray-400">16</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-400">Upper Body</p>
                      <p className="text-sm text-gray-400">6:00 PM - 7:00 PM</p>
                      {assignedTrainer && (
                        <p className="text-xs text-gray-400">With Trainer {assignedTrainer.full_name}</p>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-2" size="sm">
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 