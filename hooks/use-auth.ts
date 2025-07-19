import { useState, useEffect } from 'react'
import { supabase, createMemberProfile, createTrainerProfile } from '@/lib/supabase'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      })
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          error: null,
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    // Check if user has a profile in the database, create if not
    if (data.user) {
      try {
        // Check if user exists in members table
        const { data: memberData } = await supabase
          .from('members')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Check if user exists in trainers table
        const { data: trainerData } = await supabase
          .from('trainers')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // If user doesn't exist in either table, create profile based on userType
        if (!memberData && !trainerData) {
          const userType = data.user.user_metadata?.userType || 'member'
          const profileData = {
            user_id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
            email: data.user.email || '',
            contact: data.user.user_metadata?.contact || '',
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          }
          
          if (userType === 'trainer') {
            await createTrainerProfile(profileData)
            console.log('Created trainer profile for sign-in user')
          } else {
            await createMemberProfile(profileData)
            console.log('Created member profile for sign-in user')
          }
        }
      } catch (profileError) {
        console.error('Error checking/creating profile:', profileError)
        // Don't fail the signin if profile creation fails
      }
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: data.user,
    }))

    return { data }
  }

  const signUp = async (email: string, password: string, userData?: {
    username?: string
    contact?: string
    userType?: 'member' | 'trainer'
    full_name?: string
  }) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    // Create profile in appropriate table based on user type
    if (data.user && userData) {
      try {
        const profileData = {
          user_id: data.user.id,
          username: userData.username || '',
          email: email,
          contact: userData.contact || '',
          full_name: userData.full_name || userData.username || '',
        }

        if (userData.userType === 'trainer') {
          await createTrainerProfile(profileData)
        } else {
          await createMemberProfile(profileData)
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: data.user,
    }))

    return { data }
  }

  const signInWithOTP = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: null,
    }))

    return { data }
  }

  const verifyOTP = async (email: string, token: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    // Check if user has a profile in the database, create if not
    if (data.user) {
      try {
        // Check if user exists in members table
        const { data: memberData } = await supabase
          .from('members')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Check if user exists in trainers table
        const { data: trainerData } = await supabase
          .from('trainers')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // If user doesn't exist in either table, create profile based on userType
        if (!memberData && !trainerData) {
          const userType = data.user.user_metadata?.userType || 'member'
          const profileData = {
            user_id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
            email: data.user.email || '',
            contact: data.user.user_metadata?.contact || '',
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          }
          
          if (userType === 'trainer') {
            await createTrainerProfile(profileData)
            console.log('Created trainer profile for OTP user')
          } else {
            await createMemberProfile(profileData)
            console.log('Created member profile for OTP user')
          }
        }
      } catch (profileError) {
        console.error('Error checking/creating profile:', profileError)
        // Don't fail the OTP verification if profile creation fails
      }
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: data.user,
    }))

    return { data }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      user: null,
    }))

    return { success: true }
  }

  const signInWithGoogle = async (userType?: 'member' | 'trainer') => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?userType=${userType || 'member'}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    return { data }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signInWithOTP,
    verifyOTP,
    signOut,
    signInWithGoogle,
  }
} 