"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  LogOut, 
  User, 
  Settings, 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield,
  BarChart3,
  Database,
  AlertTriangle,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  Target,
  Award
} from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  user_id: string
  username: string
  email: string
  contact: string
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
  created_at: string
  updated_at: string
}

interface Trainer {
  id: string
  user_id: string
  username: string
  email: string
  contact: string
  full_name: string
  date_of_birth?: string
  gender?: string
  specialization: string[]
  certifications: string[]
  experience_years: number
  bio?: string
  hourly_rate: number
  rating: number
  total_reviews: number
  total_clients: number
  active_clients: number
  total_sessions: number
  join_date: string
  is_verified: boolean
  is_available: boolean
  working_hours?: string
  location?: string
  created_at: string
  updated_at: string
}

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  
  const [members, setMembers] = useState<Member[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'trainers'>('overview')
  const [dataLoading, setDataLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Load supabase dynamically
    const loadSupabase = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        setSupabase(supabase)
      } catch (error) {
        console.error('Error loading Supabase:', error)
      }
    }
    loadSupabase()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    if (!loading && user) {
      const userEmail = user.email?.toLowerCase()
      
      // Only allow gouravpanda2k04@gmail.com to access admin dashboard
      if (userEmail !== 'gouravpanda2k04@gmail.com') {
        // Redirect based on user type
        const userType = user.user_metadata?.userType || 'member'
        if (userType === 'trainer') {
          router.push("/trainer-dashboard")
        } else {
          router.push("/member-dashboard")
        }
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.email === 'gouravpanda2k04@gmail.com' && supabase) {
      fetchAllData()
    }
  }, [user, supabase])

  useEffect(() => {
    // Filter data based on search term
    if (searchTerm) {
      const filteredM = members.filter(member => 
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const filteredT = trainers.filter(trainer => 
        trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMembers(filteredM)
      setFilteredTrainers(filteredT)
    } else {
      setFilteredMembers(members)
      setFilteredTrainers(trainers)
    }
  }, [searchTerm, members, trainers])

  const fetchAllData = async () => {
    if (!supabase) {
      console.log('Supabase not loaded yet')
      return
    }

    setDataLoading(true)
    try {
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (membersError) {
        console.error('Error fetching members:', membersError)
        toast.error('Failed to fetch members data')
      } else {
        setMembers(membersData || [])
        setFilteredMembers(membersData || [])
      }

      // Fetch trainers
      const { data: trainersData, error: trainersError } = await supabase
        .from('trainers')
        .select('*')
        .order('created_at', { ascending: false })

      if (trainersError) {
        console.error('Error fetching trainers:', trainersError)
        toast.error('Failed to fetch trainers data')
      } else {
        setTrainers(trainersData || [])
        setFilteredTrainers(trainersData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setDataLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    // No need for manual redirect - signOut function handles it
  }

  const getStats = () => {
    const totalMembers = members.length
    const totalTrainers = trainers.length
    const activeMembers = members.filter(m => m.total_workouts > 0).length
    const verifiedTrainers = trainers.filter(t => t.is_verified).length
    const totalRevenue = trainers.reduce((sum, t) => sum + (t.hourly_rate * t.total_sessions), 0)
    const avgRating = trainers.length > 0 
      ? (trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1)
      : '0.0'

    return {
      totalMembers,
      totalTrainers,
      activeMembers,
      verifiedTrainers,
      totalRevenue,
      avgRating
    }
  }

  const stats = getStats()

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/logo.png" alt="ICBF Logo" width={120} height={30} />
              <span className="ml-4 text-sm text-gray-500 bg-red-100 px-2 py-1 rounded-full">
                Admin Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">
                  {user.email} (Admin)
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-lg shadow p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, Administrator! 👨‍💼
            </h1>
            <p className="text-red-100">
              Manage your ICBF fitness platform and monitor system performance.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'members' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members ({stats.totalMembers})
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'trainers' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trainers ({stats.totalTrainers})
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={fetchAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalMembers + stats.totalTrainers}</p>
                        <p className="text-xs text-gray-500">Members: {stats.totalMembers} | Trainers: {stats.totalTrainers}</p>
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
                        <p className="text-2xl font-bold">{stats.activeMembers}</p>
                        <p className="text-xs text-gray-500">{((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)}% of total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">From all trainers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Avg. Trainer Rating</p>
                        <p className="text-2xl font-bold">{stats.avgRating}</p>
                        <p className="text-xs text-gray-500">Out of 5 stars</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Recent Members</span>
                    </CardTitle>
                    <CardDescription>
                      Latest member registrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{member.full_name || member.username}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined: {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <span>Recent Trainers</span>
                    </CardTitle>
                    <CardDescription>
                      Latest trainer registrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trainers.slice(0, 5).map((trainer) => (
                      <div key={trainer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{trainer.full_name}</p>
                            <p className="text-sm text-gray-600">{trainer.email}</p>
                            <p className="text-xs text-gray-500">
                              Rating: {trainer.rating} ⭐ | ${trainer.hourly_rate}/hr
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>All Members ({filteredMembers.length})</span>
                </CardTitle>
                <CardDescription>
                  Complete list of registered members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Membership</th>
                        <th className="text-left p-3">Workouts</th>
                        <th className="text-left p-3">Streak</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.full_name || member.username}</p>
                              <p className="text-sm text-gray-500">@{member.username}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{member.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{member.contact || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              member.membership_type === 'premium' ? 'bg-purple-100 text-purple-800' :
                              member.membership_type === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {member.membership_type || 'basic'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.total_workouts}</p>
                              <p className="text-sm text-gray-500">{member.total_calories_burned} cal</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.current_streak} days</p>
                              <p className="text-sm text-gray-500">Best: {member.longest_streak}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {new Date(member.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trainers Tab */}
          {activeTab === 'trainers' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>All Trainers ({filteredTrainers.length})</span>
                </CardTitle>
                <CardDescription>
                  Complete list of registered trainers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Specialization</th>
                        <th className="text-left p-3">Rating</th>
                        <th className="text-left p-3">Rate</th>
                        <th className="text-left p-3">Clients</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrainers.map((trainer) => (
                        <tr key={trainer.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{trainer.full_name}</p>
                              <p className="text-sm text-gray-500">@{trainer.username}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{trainer.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {trainer.specialization.slice(0, 2).map((spec, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {spec}
                                </span>
                              ))}
                              {trainer.specialization.length > 2 && (
                                <span className="text-xs text-gray-500">+{trainer.specialization.length - 2} more</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{trainer.rating}</span>
                              <span className="text-sm text-gray-500">({trainer.total_reviews})</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">${trainer.hourly_rate}/hr</span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{trainer.active_clients}</p>
                              <p className="text-sm text-gray-500">Total: {trainer.total_clients}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                trainer.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {trainer.is_verified ? 'Verified' : 'Pending'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                trainer.is_available ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {trainer.is_available ? 'Available' : 'Busy'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {new Date(trainer.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 