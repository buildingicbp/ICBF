"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Dumbbell, 
  Heart, 
  Activity, 
  Target, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Calendar
} from "lucide-react"

interface TrainerAction {
  id: string
  action_type: string
  title: string
  description: string
  priority: string
  action_date: string
  created_at: string
  is_visible_to_member: boolean
  trainer: {
    id: string
    full_name: string
    email: string
  }
}

interface TrainerActionsCardProps {
  memberId: string
  userEmail: string
}

export function TrainerActionsCard({ memberId, userEmail }: TrainerActionsCardProps) {
  const [actions, setActions] = useState<TrainerAction[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchTrainerActions()
  }, [memberId])

  const fetchTrainerActions = async () => {
    if (!memberId || !userEmail) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/trainer-actions/member/${memberId}?email=${encodeURIComponent(userEmail)}&limit=${showAll ? 50 : 10}`)
      const data = await response.json()
      
      if (response.ok) {
        setActions(data.actions || [])
      } else {
        console.error('Error fetching trainer actions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching trainer actions:', error)
    } finally {
      setLoading(false)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatActionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Trainer Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Trainer Messages</span>
          </div>
          {actions.length > 0 && (
            <Badge variant="outline">{actions.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Latest updates and guidance from your trainer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length > 0 ? (
          <div className="space-y-3">
            {actions.slice(0, showAll ? actions.length : 5).map((action) => (
              <div key={action.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-full bg-blue-100">
                      {getActionTypeIcon(action.action_type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{action.title}</h4>
                      <p className="text-xs text-gray-500">
                        {formatActionType(action.action_type)} • {formatDate(action.action_date)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {action.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>From: {action.trainer.full_name}</span>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(action.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {actions.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAll(!showAll)
                  if (!showAll) fetchTrainerActions()
                }}
                className="w-full mt-2"
              >
                {showAll ? 'Show Less' : `View All ${actions.length} Messages`}
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">No messages from your trainer yet</p>
            <p className="text-xs text-gray-400">
              Your trainer will share workout plans, tips, and progress updates here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
