"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabaseService } from "@/lib/supabase"
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
  Award,
  UserPlus,
  X,
  Check
} from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  user_id: string
  username?: string  // Made optional to match the actual data structure
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
  email: string
  password: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Assignment {
  id: string
  trainer_id: string
  member_id: string
  assigned_date: string
  is_active: boolean
  notes?: string
  trainer?: Trainer
  member?: Member
}

export default function AdminDashboardPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  
  const [adminUser, setAdminUser] = useState<any>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'trainers' | 'assignments'>('overview')
  const [dataLoading, setDataLoading] = useState(true)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<string>('')
  const [assignmentNotes, setAssignmentNotes] = useState('')
  const [assignmentLoading, setAssignmentLoading] = useState(false)

  useEffect(() => {
    // Check for admin session in localStorage
    const adminSession = localStorage.getItem('adminSession')
    
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.isAdmin && session.user.email === 'icanbefitter@gmail.com') {
          // Admin session exists and is valid
          setAdminUser(session.user)
          return
        }
      } catch (error) {
        console.error('Error parsing admin session:', error)
      }
    }
    
    // If no valid admin session, redirect to admin login
    router.push("/admin-login")
  }, [router])

  useEffect(() => {
    if (adminUser?.email === 'icanbefitter@gmail.com') {
      fetchAllData()
    }
  }, [adminUser])

  useEffect(() => {
    // Filter data based on search term
    if (searchTerm) {
      const filteredM = members.filter(member => 
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const filteredT = trainers.filter(trainer => 
        (trainer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMembers(filteredM)
      setFilteredTrainers(filteredT)
    } else {
      setFilteredMembers(members)
      setFilteredTrainers(trainers)
    }
  }, [searchTerm, members, trainers])

  const fetchAllData = async () => {
    setDataLoading(true)
    try {
      // Fetch members using service client to bypass RLS
      const { data: membersData, error: membersError } = await supabaseService
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (membersError) {
        console.error('Error fetching members:', membersError)
        toast.error('Failed to fetch members data')
      } else {
        console.log('Fetched members:', membersData)
        setMembers(membersData || [])
        setFilteredMembers(membersData || [])
      }

      // Fetch trainers using service client to bypass RLS
      const { data: trainersData, error: trainersError } = await supabaseService
        .from('trainer_accounts')
        .select('*')
        .order('created_at', { ascending: false })
        .filter('is_active', 'eq', true)

      if (trainersError) {
        console.error('Error fetching trainers:', trainersError)
        toast.error('Failed to fetch trainers data')
      } else {
        setTrainers(trainersData || [])
        setFilteredTrainers(trainersData || [])
      }

      // Fetch assignments
      await fetchAssignments()
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setDataLoading(false)
    }
  }

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/trainer-member-assignments')
      const data = await response.json()
      
      if (response.ok) {
        setAssignments(data.assignments || [])
      } else {
        console.error('Error fetching assignments:', data.error)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const handleAssignTrainer = async () => {
    if (!selectedMember || !selectedTrainer) {
      toast.error('Please select both member and trainer')
      return
    }

    setAssignmentLoading(true)
    try {
      const response = await fetch('/api/trainer-member-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainer_id: selectedTrainer,
          member_id: selectedMember.id,
          notes: assignmentNotes
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setAssignDialogOpen(false)
        setSelectedMember(null)
        setSelectedTrainer('')
        setAssignmentNotes('')
        await fetchAssignments()
      } else {
        toast.error(data.error || 'Failed to assign trainer')
      }
    } catch (error) {
      console.error('Error assigning trainer:', error)
      toast.error('Failed to assign trainer')
    } finally {
      setAssignmentLoading(false)
    }
  }

  const getMemberAssignment = (memberId: string) => {
    return assignments.find(a => a.member_id === memberId && a.is_active)
  }

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/trainer-member-assignments?assignment_id=${assignmentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        await fetchAssignments()
      } else {
        toast.error(data.error || 'Failed to remove assignment')
      }
    } catch (error) {
      console.error('Error removing assignment:', error)
      toast.error('Failed to remove assignment')
    }
  }

  const handleSignOut = async () => {
    // Clear admin session
    localStorage.removeItem('adminSession')
    setAdminUser(null)
    router.push('/admin-login')
  }

  const getStats = () => {
    const totalMembers = members.length
    const totalTrainers = trainers.length
    const activeMembers = members.filter(m => m.total_workouts > 0).length
    const activeTrainers = trainers.filter(t => t.is_active).length
    
    // Simplified stats since we don't have all the trainer details
    return {
      totalMembers,
      totalTrainers,
      activeMembers,
      activeTrainers,
      totalRevenue: 0, // Not available in current data
      avgRating: 'N/A' // Not available in current data
    }
  }

  const stats = getStats()

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
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
                  {adminUser.email} (Admin)
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
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'assignments' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assignments ({assignments.filter(a => a.is_active).length})
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
                              Status: {trainer.is_active ? 'Active' : 'Inactive'}
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
                        <th className="text-left p-3">Trainer</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{member.full_name || member.username}</p>
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
                            {(() => {
                              const assignment = getMemberAssignment(member.id)
                              return assignment ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-600">
                                    {assignment.trainer?.full_name}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemoveAssignment(assignment.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">No trainer assigned</span>
                              )
                            })()
                            }
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Dialog open={assignDialogOpen && selectedMember?.id === member.id} onOpenChange={(open) => {
                                setAssignDialogOpen(open)
                                if (!open) {
                                  setSelectedMember(null)
                                  setSelectedTrainer('')
                                  setAssignmentNotes('')
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedMember(member)
                                      setAssignDialogOpen(true)
                                    }}
                                    disabled={!!getMemberAssignment(member.id)}
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Assign Trainer</DialogTitle>
                                    <DialogDescription>
                                      Assign a trainer to {member.full_name || member.username}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Select Trainer</label>
                                      <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose a trainer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {trainers.map((trainer) => (
                                            <SelectItem key={trainer.id} value={trainer.id}>
                                              {trainer.full_name} ({trainer.email})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Notes (Optional)</label>
                                      <Textarea
                                        placeholder="Add any notes about this assignment..."
                                        value={assignmentNotes}
                                        onChange={(e) => setAssignmentNotes(e.target.value)}
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={handleAssignTrainer}
                                        disabled={assignmentLoading || !selectedTrainer}
                                        className="flex-1"
                                      >
                                        {assignmentLoading ? 'Assigning...' : 'Assign Trainer'}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => setAssignDialogOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{trainer.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              trainer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {trainer.is_active ? 'Active' : 'Inactive'}
                            </span>
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

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  <span>Trainer-Member Assignments ({assignments.filter(a => a.is_active).length})</span>
                </CardTitle>
                <CardDescription>
                  Active trainer-member assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Member</th>
                        <th className="text-left p-3">Trainer</th>
                        <th className="text-left p-3">Assigned Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Notes</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.filter(a => a.is_active).map((assignment) => (
                        <tr key={assignment.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{assignment.member?.full_name || assignment.member?.username}</p>
                              <p className="text-sm text-gray-500">{assignment.member?.email}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{assignment.trainer?.full_name}</p>
                              <p className="text-sm text-gray-500">{assignment.trainer?.email}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {new Date(assignment.assigned_date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {assignment.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {assignment.notes || 'No notes'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRemoveAssignment(assignment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {assignments.filter(a => a.is_active).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active assignments found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 