import { useState, useEffect } from 'react'
import { supabase, createMemberProfile } from '@/lib/supabase'
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
      console.log("Getting initial session...")
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log("Initial session data:", session)
      console.log("Initial session error:", error)
      
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
        console.log("Auth state change event:", event)
        console.log("Auth state change session:", session)
        
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          error: null,
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, selectedUserType?: 'member' | 'trainer') => {
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

    // Update user metadata with the selected user type if provided
    if (data.user && selectedUserType && data.user.user_metadata?.userType !== selectedUserType) {
      console.log("Updating user metadata with userType:", selectedUserType)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { userType: selectedUserType }
      })
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError)
      } else {
        console.log("User metadata updated successfully")
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
    
    console.log("📝 SignUp called with userType:", userData?.userType)
    console.log("📝 Full userData:", userData)
    
    const userType = userData?.userType || 'member'
    console.log("🎯 Final userType for signup:", userType)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          userType: userType, // Ensure userType is included in metadata
        },
        emailRedirectTo: `${window.location.origin}/member-dashboard`,
      },
    })

    if (error) {
      console.error("❌ SignUp error:", error)
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    console.log("✅ SignUp successful, user data:", data.user)
    console.log("📧 User metadata after signup:", data.user?.user_metadata)

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

  const verifyOTP = async (email: string, token: string, selectedUserType?: 'member' | 'trainer') => {
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

    // Update user metadata with the selected user type if provided
    if (data.user && selectedUserType && data.user.user_metadata?.userType !== selectedUserType) {
      console.log("Updating user metadata with userType:", selectedUserType)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { userType: selectedUserType }
      })
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError)
      } else {
        console.log("User metadata updated successfully")
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

    // Redirect to main page after sign out
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }

    return { success: true }
  }

  const createMemberProfileForUser = async (userData: {
    username?: string
    contact?: string
    full_name?: string
    user_id?: string
    email?: string
  }) => {
    const userId = userData.user_id || authState.user?.id
    const userEmail = userData.email || authState.user?.email
    
    if (!userId) {
      console.error("No user ID found")
      return { error: new Error("No user ID found") }
    }

    try {
      console.log("🆕 Creating member profile for user:", userId)
      
      const profileData = {
        user_id: userId,
        username: userData.username || '',
        email: userEmail || '',
        contact: userData.contact || '',
        full_name: userData.full_name || userData.username || '',
      }

      console.log("📝 Profile data:", profileData)

      const result = await createMemberProfile(profileData)
      if (result.error) {
        console.error("❌ Failed to create member profile:", result.error)
        return { error: result.error }
      } else {
        console.log("✅ Member profile created successfully:", result.data)
        return { data: result.data }
      }
    } catch (profileError) {
      console.error('❌ Error creating member profile:', profileError)
      return { error: profileError as Error }
    }
  }

  const signInWithGoogle = async (userType?: 'member' | 'trainer') => {
    console.log("🔐 Starting Google OAuth sign-in with userType:", userType)
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const finalUserType = userType || 'member'
    console.log("🎯 Final userType for redirect:", finalUserType)
    
    const redirectUrl = `${window.location.origin}/auth/oauth-callback?userType=${finalUserType}`
    console.log("🔗 Redirect URL:", redirectUrl)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error("❌ Google OAuth error:", error)
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    console.log("✅ Google OAuth initiated successfully")
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
    createMemberProfileForUser,
  }
} 