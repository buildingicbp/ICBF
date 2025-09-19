"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Target,
  Award,
  Activity,
  ArrowLeft,
  Eye,
  MessageSquare,
  User,
  Filter,
  RefreshCw
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

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

export default function TrainerMembersPage() {
  const router = useRouter()
  const [trainerSession, setTrainerSession] = useState<TrainerSession | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

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
          router.push('/trainer-login')
        }
      } else {
        router.push('/trainer-login')
      }
    }
  }, [router])

  // Fetch assigned members when trainer session is available
  useEffect(() => {
    if (trainerSession?.email) {
      fetchAssignedMembers()
    }
  }, [trainerSession])

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = assignedMembers.filter(member => 
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMembers(filtered)
    } else {
      setFilteredMembers(assignedMembers)
    }
  }, [searchTerm, assignedMembers])

  const fetchAssignedMembers = async () => {
    if (!trainerSession?.email) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/trainer-members/my-members?trainer_email=${encodeURIComponent(trainerSession.email)}`)
      const data = await response.json()
      
      if (response.ok) {
        setAssignedMembers(data.members || [])
        setFilteredMembers(data.members || [])
      } else {
        console.error('Error fetching assigned members:', data.error)
      }
    } catch (error) {
      console.error('Error fetching assigned members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMembershipBadgeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getExperienceBadgeColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'advanced': return 'bg-red-100 text-red-800'
      case 'intermediate': return 'bg-orange-100 text-orange-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your members...</p>
        </div>
      </div>
    )
  }

  if (!trainerSession) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar userType="trainer" activePage="members" />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-4 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/trainer-dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Members</h1>
                <p className="text-gray-600">Manage your assigned members</p>
              </div>
            </div>
            <Button onClick={fetchAssignedMembers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold">{assignedMembers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Members</p>
                    <p className="text-2xl font-bold">{assignedMembers.filter(m => m.total_workouts > 0).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Workouts</p>
                    <p className="text-2xl font-bold">
                      {assignedMembers.length > 0 
                        ? Math.round(assignedMembers.reduce((sum, m) => sum + m.total_workouts, 0) / assignedMembers.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Best Streak</p>
                    <p className="text-2xl font-bold">
                      {assignedMembers.length > 0 
                        ? Math.max(...assignedMembers.map(m => m.longest_streak))
                        : 0
                      } days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Members List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Assigned Members ({filteredMembers.length})</span>
              </CardTitle>
              <CardDescription>
                Members currently assigned to you for training
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Member</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Membership</th>
                        <th className="text-left p-3">Experience</th>
                        <th className="text-left p-3">Progress</th>
                        <th className="text-left p-3">Assigned Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{member.full_name || member.username}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {member.contact && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-sm">{member.contact}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{member.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getMembershipBadgeColor(member.membership_type)}`}>
                              {member.membership_type || 'Basic'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getExperienceBadgeColor(member.experience_level)}`}>
                              {member.experience_level || 'Beginner'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.total_workouts} workouts</p>
                              <p className="text-sm text-gray-500">{member.current_streak} day streak</p>
                              <p className="text-xs text-gray-400">{member.total_calories_burned} cal burned</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {member.assigned_date 
                                ? new Date(member.assigned_date).toLocaleDateString()
                                : 'N/A'
                              }
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMember(member)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Target className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? "No members match your search criteria." 
                      : "You don't have any assigned members yet."
                    }
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-gray-500">
                      Contact your admin to get members assigned to you.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
