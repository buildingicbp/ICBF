"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Activity, 
  Heart,
  Scale,
  Dumbbell,
  Plus,
  Send,
  Clock,
  AlertCircle
} from "lucide-react"

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

interface TrainerAction {
  id: string
  action_type: string
  title: string
  description: string
  priority: string
  action_date: string
  created_at: string
  is_visible_to_member: boolean
}

interface MemberDetailsModalProps {
  member: Member | null
  isOpen: boolean
  onClose: () => void
  trainerEmail: string
}

export function MemberDetailsModal({ member, isOpen, onClose, trainerEmail }: MemberDetailsModalProps) {
  const [actions, setActions] = useState<TrainerAction[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newAction, setNewAction] = useState({
    action_type: 'other',
    title: '',
    description: '',
    priority: 'medium',
    is_visible_to_member: true
  })

  // Fetch existing actions for this member
  useEffect(() => {
    if (member && isOpen) {
      fetchMemberActions()
    }
  }, [member, isOpen])

  const fetchMemberActions = async () => {
    if (!member) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/trainer-actions?trainer_email=${encodeURIComponent(trainerEmail)}&member_id=${member.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setActions(data.actions || [])
      } else {
        console.error('Error fetching actions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching member actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAction = async () => {
    if (!member || !newAction.title.trim() || !newAction.description.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/trainer-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainer_email: trainerEmail,
          member_id: member.id,
          ...newAction
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        // Reset form
        setNewAction({
          action_type: 'other',
          title: '',
          description: '',
          priority: 'medium',
          is_visible_to_member: true
        })
        
        // Refresh actions list
        fetchMemberActions()
      } else {
        console.error('Error creating action:', data.error)
        alert('Failed to create action: ' + data.error)
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      alert('Failed to create action. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'workout_plan': return <Dumbbell className="w-4 h-4" />
      case 'diet_advice': return <Heart className="w-4 h-4" />
      case 'progress_note': return <Activity className="w-4 h-4" />
      case 'motivation': return <Target className="w-4 h-4" />
      case 'reminder': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{member.full_name || member.username}</span>
          </DialogTitle>
          <DialogDescription>
            Member details and training actions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Member Details</TabsTrigger>
            <TabsTrigger value="actions">Training Actions</TabsTrigger>
            <TabsTrigger value="new-action">Add Action</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  {member.contact && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{member.contact}</span>
                    </div>
                  )}
                  {member.date_of_birth && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {formatDate(member.date_of_birth)} ({calculateAge(member.date_of_birth)} years)
                      </span>
                    </div>
                  )}
                  {member.gender && (
                    <div className="text-sm">
                      <span className="font-medium">Gender: </span>
                      <span className="capitalize">{member.gender}</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium">Membership: </span>
                    <Badge variant="outline" className="capitalize">
                      {member.membership_type || 'Basic'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Experience: </span>
                    <Badge variant="outline" className="capitalize">
                      {member.experience_level || 'Beginner'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Physical Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.height && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Height</span>
                      <span className="text-sm">{member.height} cm</span>
                    </div>
                  )}
                  {member.weight && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weight</span>
                      <span className="text-sm">{member.weight} kg</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Workouts</span>
                    <span className="text-sm">{member.total_workouts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Streak</span>
                    <span className="text-sm">{member.current_streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Longest Streak</span>
                    <span className="text-sm">{member.longest_streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calories Burned</span>
                    <span className="text-sm">{member.total_calories_burned.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fitness Goals */}
              {member.fitness_goals && member.fitness_goals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fitness Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {member.fitness_goals.map((goal, index) => (
                        <Badge key={index} variant="secondary">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Medical Conditions */}
              {member.medical_conditions && member.medical_conditions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {member.medical_conditions.map((condition, index) => (
                        <Badge key={index} variant="destructive">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Training Actions</h3>
              <Badge variant="outline">{actions.length} actions</Badge>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading actions...</p>
              </div>
            ) : actions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {actions.map((action) => (
                  <Card key={action.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getActionTypeIcon(action.action_type)}
                          <h4 className="font-medium">{action.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority}
                          </Badge>
                          {!action.is_visible_to_member && (
                            <Badge variant="outline">Private</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Type: {action.action_type.replace('_', ' ')}</span>
                        <span>{formatDate(action.action_date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No actions recorded yet</p>
                <p className="text-sm">Add your first training action for this member</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new-action" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Training Action</span>
                </CardTitle>
                <CardDescription>
                  Record today's training notes, advice, or reminders for {member.full_name || member.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="action_type">Action Type</Label>
                    <Select
                      value={newAction.action_type}
                      onValueChange={(value) => setNewAction(prev => ({ ...prev, action_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workout_plan">Workout Plan</SelectItem>
                        <SelectItem value="diet_advice">Diet Advice</SelectItem>
                        <SelectItem value="progress_note">Progress Note</SelectItem>
                        <SelectItem value="motivation">Motivation</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newAction.priority}
                      onValueChange={(value) => setNewAction(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for this action"
                    value={newAction.title}
                    onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the action, advice, or notes"
                    value={newAction.description}
                    onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_visible_to_member"
                    checked={newAction.is_visible_to_member}
                    onChange={(e) => setNewAction(prev => ({ ...prev, is_visible_to_member: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is_visible_to_member" className="text-sm">
                    Visible to member (they will see this on their dashboard)
                  </Label>
                </div>

                <Button
                  onClick={handleSubmitAction}
                  disabled={submitting || !newAction.title.trim() || !newAction.description.trim()}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Action...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Action
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
