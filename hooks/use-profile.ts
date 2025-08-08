import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { 
  getMemberProfile, 
  getTrainerProfile, 
  updateMemberProfile, 
  updateTrainerProfile,
  Member,
  Trainer
} from '@/lib/supabase'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Member | Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const userType = user.user_metadata?.userType || 'member'
        
        if (userType === 'trainer') {
          const { data, error } = await getTrainerProfile(user.id)
          if (error) throw error
          setProfile(data)
        } else {
          const { data, error } = await getMemberProfile(user.id)
          if (error) throw error
          setProfile(data)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Member> | Partial<Trainer>) => {
    if (!user || !profile) return { error: 'No user or profile found' }

    try {
      setLoading(true)
      setError(null)

      const userType = user.user_metadata?.userType || 'member'
      
      let result
      if (userType === 'trainer') {
        result = await updateTrainerProfile(user.id, updates as Partial<Trainer>)
      } else {
        result = await updateMemberProfile(user.id, updates as Partial<Member>)
      }

      if (result.error) throw result.error
      
      setProfile(result.data)
      return { data: result.data }
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const isMember = (profile: Member | Trainer): profile is Member => {
    return 'total_workouts' in profile
  }

  const isTrainer = (profile: Member | Trainer): profile is Trainer => {
    return 'total_clients' in profile
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    isMember,
    isTrainer,
  }
} 