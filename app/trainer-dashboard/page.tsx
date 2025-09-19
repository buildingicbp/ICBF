"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
  LogOut,
  Mail,
  Phone,
  User,
  Eye
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MemberDetailsModal } from "@/components/member-details-modal"

interface TrainerSession {
  id: string
  email: string
  full_name: string
  loginTime: string
}

interface Member {
  id: string
  user_id: string
  username?: string
  email: string
  contact?: string
  full_name?: string
  date_of_birth?: string
  gender?: string
  height?: number
  weight?: number
  fitness_goals?: string[]
  experience_level?: string
  medical_conditions?: string[]
  emergency_contact?: string
  membership_type?: string
  join_date: string
  last_workout?: string
  total_workouts: number
  current_streak: number
  longest_streak: number
  total_calories_burned: number
  assignment_id?: string
  assigned_date?: string
  assignment_notes?: string
}

export default function TrainerDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [trainerSession, setTrainerSession] = useState<TrainerSession | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [stats, setStats] = useState({
    activeClients: 0,
    sessionsToday: 0,
    rating: 4.9,
    monthlyEarnings: 3240
  })
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showMemberModal, setShowMemberModal] = useState(false)

  // Check for trainer session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('trainerSession')
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession)
          setTrainerSession(session)
        } catch (error) {
          console.error('Error parsing trainer session:', error)
          localStorage.removeItem('trainerSession')
        }
      }
    }
  }, [])

  // Fetch assigned members when trainer session is available
  useEffect(() => {
    if (trainerSession?.email) {
      fetchAssignedMembers()
    }
  }, [trainerSession])

  const fetchAssignedMembers = async () => {
    if (!trainerSession?.email) return
    
    setMembersLoading(true)
    try {
      const response = await fetch(`/api/trainer-members/my-members?trainer_email=${encodeURIComponent(trainerSession.email)}`)
      const data = await response.json()
      
      if (response.ok) {
        setAssignedMembers(data.members || [])
        setStats(prev => ({
          ...prev,
          activeClients: data.total_members || 0
        }))
      } else {
        console.error('Error fetching assigned members:', data.error)
      }
    } catch (error) {
      console.error('Error fetching assigned members:', error)
    } finally {
      setMembersLoading(false)
    }
  }

  // Handle auth redirects
  useEffect(() => {
    // If loading is complete and no user and no trainer session, redirect to signin
    if (!loading && !user && !trainerSession) {
      router.push("/signin")
      return
    }

    // If user exists and loading is complete (regular Supabase auth)
    if (!loading && user && !trainerSession) {
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
  }, [user, loading, router, trainerSession])

  // Add a separate effect to handle sign-out redirect
  useEffect(() => {
    // If user becomes null after being authenticated and no trainer session, redirect to home
    if (!loading && !user && !trainerSession && typeof window !== 'undefined') {
      // Check if we're on a dashboard page
      if (window.location.pathname.includes('dashboard')) {
        window.location.href = '/'
      }
    }
  }, [user, loading, trainerSession])



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

  if (!user && !trainerSession) {
    return null
  }

  const handleSignOut = async () => {
    if (trainerSession) {
      // Clear trainer session
      localStorage.removeItem('trainerSession')
      window.location.href = '/'
    } else {
      // Regular Supabase sign out
      try {
        await signOut()
        window.location.href = '/'
      } catch (error) {
        console.error('Sign out error:', error)
        window.location.href = '/'
      }
    }
  }

  const displayName = trainerSession ? trainerSession.full_name : (user?.user_metadata?.username || user?.email || 'Trainer')

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member)
    setShowMemberModal(true)
  }

  const handleCloseMemberModal = () => {
    setShowMemberModal(false)
    setSelectedMember(null)
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
              Welcome back, {displayName}! 🏋️‍♂️
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
                    <p className="text-2xl font-bold">{stats.activeClients}</p>
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
                    <p className="text-2xl font-bold">{stats.sessionsToday}</p>
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
                    <p className="text-2xl font-bold">{stats.rating}</p>
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
                    <p className="text-2xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
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
                <Button 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => window.location.href = '/trainer-members'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Clients ({stats.activeClients})
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
                  <Users className="w-5 h-5" />
                  <span>My Assigned Members</span>
                </CardTitle>
                <CardDescription>
                  Members currently assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {membersLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading members...</p>
                  </div>
                ) : assignedMembers.length > 0 ? (
                  assignedMembers.slice(0, 4).map((member, index) => (
                    <div 
                      key={member.id} 
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${
                        index % 4 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 
                        index % 4 === 1 ? 'bg-green-50 hover:bg-green-100' : 
                        index % 4 === 2 ? 'bg-purple-50 hover:bg-purple-100' : 'bg-orange-50 hover:bg-orange-100'
                      }`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index % 4 === 0 ? 'bg-blue-100' : 
                          index % 4 === 1 ? 'bg-green-100' : 
                          index % 4 === 2 ? 'bg-purple-100' : 'bg-orange-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            index % 4 === 0 ? 'text-blue-600' : 
                            index % 4 === 1 ? 'text-green-600' : 
                            index % 4 === 2 ? 'text-purple-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{member.full_name || member.username}</p>
                          <p className="text-sm text-gray-600">{member.membership_type || 'Basic'} Member</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.total_workouts} workouts</p>
                        <p className={`text-xs ${
                          index % 4 === 0 ? 'text-blue-600' : 
                          index % 4 === 1 ? 'text-green-600' : 
                          index % 4 === 2 ? 'text-purple-600' : 'text-orange-600'
                        }`}>{member.current_streak} day streak</p>
                        <div className="flex items-center mt-1">
                          <Eye className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-xs text-gray-500">Click to view</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No members assigned yet</p>
                    <p className="text-sm">Contact your admin to get members assigned</p>
                  </div>
                )}
                {assignedMembers.length > 4 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/trainer-members'}
                    >
                      View All {assignedMembers.length} Members
                    </Button>
                  </div>
                )}
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
      
      {/* Member Details Modal */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={showMemberModal}
        onClose={handleCloseMemberModal}
        trainerEmail={trainerSession?.email || user?.email || ''}
      />
    </div>
  )
} 