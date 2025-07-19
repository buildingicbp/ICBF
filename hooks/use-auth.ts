import { useState, useEffect } from 'react'
import { supabase, createMemberProfile, createTrainerProfile, supabaseService } from '@/lib/supabase'
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

    // Check if user has a profile in the database, create if not
    if (data.user) {
      try {
        // Check if user exists in members table
        const { data: memberData } = await supabaseService
          .from('members')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Check if user exists in trainers table
        const { data: trainerData } = await supabaseService
          .from('trainers')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Determine user type - prioritize database over metadata
        let userType = 'member'
        
        if (trainerData) {
          // User exists in trainers table
          userType = 'trainer'
        } else if (memberData) {
          // User exists in members table
          userType = 'member'
        } else {
          // New user - use the selected user type
          userType = selectedUserType || 'member'
        }
        
        // Update user metadata with the correct userType
        if (data.user.user_metadata?.userType !== userType) {
          console.log("Updating user metadata with userType:", userType)
          const { error: updateError } = await supabase.auth.updateUser({
            data: { userType: userType }
          })
          
          if (updateError) {
            console.error("Error updating user metadata:", updateError)
          } else {
            console.log("User metadata updated successfully")
            // Refresh the session to get updated metadata
            const { data: refreshData } = await supabase.auth.getSession()
            if (refreshData.session) {
              console.log("Session refreshed with updated metadata:", refreshData.session.user.user_metadata)
            }
          }
        }
        
        // If user doesn't exist in either table, create profile based on userType
        if (!memberData && !trainerData) {
          console.log("User doesn't exist in any table, creating new profile")
          console.log("Creating profile for userType:", userType)
          
          const profileData = {
            user_id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
            email: data.user.email || '',
            contact: data.user.user_metadata?.contact || '',
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          }
          
          console.log("Profile data to create:", profileData)
          
          let profileCreated = false
          
          if (userType === 'trainer') {
            console.log("Creating trainer profile...")
            const result = await createTrainerProfile(profileData)
            if (result.error) {
              console.error("Failed to create trainer profile:", result.error)
            } else {
              console.log('Created trainer profile for sign-in user:', result.data)
              profileCreated = true
            }
          } else {
            console.log("Creating member profile...")
            const result = await createMemberProfile(profileData)
            if (result.error) {
              console.error("Failed to create member profile:", result.error)
            } else {
              console.log('Created member profile for sign-in user:', result.data)
              profileCreated = true
            }
          }
          
          // If profile creation failed, try one more time with different approach
          if (!profileCreated) {
            console.log("Profile creation failed, trying alternative approach...")
            try {
              // Try direct insertion without the wrapper function
              const { data: directData, error: directError } = await supabaseService
                .from(userType === 'trainer' ? 'trainers' : 'members')
                .insert({
                  user_id: profileData.user_id,
                  username: profileData.username,
                  email: profileData.email,
                  contact: profileData.contact,
                  full_name: profileData.full_name,
                  join_date: new Date().toISOString(),
                  ...(userType === 'trainer' ? {
                    specialization: [],
                    hourly_rate: 50,
                    experience_years: 0,
                    rating: 0,
                    total_reviews: 0,
                    total_clients: 0,
                    active_clients: 0,
                    total_sessions: 0,
                    is_verified: false,
                    is_available: true,
                  } : {
                    total_workouts: 0,
                    current_streak: 0,
                    longest_streak: 0,
                    total_calories_burned: 0,
                  })
                })
                .select()
                .single()
              
              if (directError) {
                console.error("Direct insertion also failed:", directError)
              } else {
                console.log("Direct insertion succeeded:", directData)
                profileCreated = true
              }
            } catch (directErr) {
              console.error("Direct insertion error:", directErr)
            }
          }
          
          if (!profileCreated) {
            console.error("All profile creation attempts failed!")
          }
        } else {
          console.log("User already has a profile in database")
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
    
    console.log("📝 SignUp called with userType:", userData?.userType)
    console.log("📝 Full userData:", userData)
    
    const userType = userData?.userType || 'member'
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          userType: userType, // Ensure userType is included in metadata
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?userType=${userType}`,
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

    // Create profile in appropriate table based on user type
    if (data.user && userData) {
      try {
        console.log("🆕 Creating profile for user:", data.user.id)
        console.log("🎯 UserType for profile creation:", userType)
        
        const profileData = {
          user_id: data.user.id,
          username: userData.username || '',
          email: email,
          contact: userData.contact || '',
          full_name: userData.full_name || userData.username || '',
        }

        console.log("📝 Profile data:", profileData)

        if (userType === 'trainer') {
          console.log("🏋️ Creating trainer profile...")
          const result = await createTrainerProfile(profileData)
          if (result.error) {
            console.error("❌ Failed to create trainer profile:", result.error)
          } else {
            console.log("✅ Trainer profile created successfully:", result.data)
          }
        } else {
          console.log("👤 Creating member profile...")
          const result = await createMemberProfile(profileData)
          if (result.error) {
            console.error("❌ Failed to create member profile:", result.error)
          } else {
            console.log("✅ Member profile created successfully:", result.data)
          }
        }
      } catch (profileError) {
        console.error('❌ Error creating profile:', profileError)
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

    // Check if user has a profile in the database, create if not
    if (data.user) {
      try {
        // Check if user exists in members table
        const { data: memberData } = await supabaseService
          .from('members')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Check if user exists in trainers table
        const { data: trainerData } = await supabaseService
          .from('trainers')
          .select('id')
          .eq('user_id', data.user.id)
          .single()
        
        // Determine user type - prioritize database over metadata
        let userType = 'member'
        
        if (trainerData) {
          // User exists in trainers table
          userType = 'trainer'
        } else if (memberData) {
          // User exists in members table
          userType = 'member'
        } else {
          // New user - use the selected user type
          userType = selectedUserType || 'member'
        }
        
        // Update user metadata with the correct userType
        if (data.user.user_metadata?.userType !== userType) {
          console.log("Updating user metadata with userType:", userType)
          const { error: updateError } = await supabase.auth.updateUser({
            data: { userType: userType }
          })
          
          if (updateError) {
            console.error("Error updating user metadata:", updateError)
          } else {
            console.log("User metadata updated successfully")
            // Refresh the session to get updated metadata
            const { data: refreshData } = await supabase.auth.getSession()
            if (refreshData.session) {
              console.log("Session refreshed with updated metadata:", refreshData.session.user.user_metadata)
            }
          }
        }
        
        // If user doesn't exist in either table, create profile based on userType
        if (!memberData && !trainerData) {
          console.log("User doesn't exist in any table, creating new profile")
          console.log("Creating profile for userType:", userType)
          
          const profileData = {
            user_id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
            email: data.user.email || '',
            contact: data.user.user_metadata?.contact || '',
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          }
          
          console.log("Profile data to create:", profileData)
          
          let profileCreated = false
          
          if (userType === 'trainer') {
            console.log("Creating trainer profile...")
            const result = await createTrainerProfile(profileData)
            if (result.error) {
              console.error("Failed to create trainer profile:", result.error)
            } else {
              console.log('Created trainer profile for OTP user:', result.data)
              profileCreated = true
            }
          } else {
            console.log("Creating member profile...")
            const result = await createMemberProfile(profileData)
            if (result.error) {
              console.error("Failed to create member profile:", result.error)
            } else {
              console.log('Created member profile for OTP user:', result.data)
              profileCreated = true
            }
          }
          
          // If profile creation failed, try one more time with different approach
          if (!profileCreated) {
            console.log("Profile creation failed, trying alternative approach...")
            try {
              // Try direct insertion without the wrapper function
              const { data: directData, error: directError } = await supabaseService
                .from(userType === 'trainer' ? 'trainers' : 'members')
                .insert({
                  user_id: profileData.user_id,
                  username: profileData.username,
                  email: profileData.email,
                  contact: profileData.contact,
                  full_name: profileData.full_name,
                  join_date: new Date().toISOString(),
                  ...(userType === 'trainer' ? {
                    specialization: [],
                    hourly_rate: 50,
                    experience_years: 0,
                    rating: 0,
                    total_reviews: 0,
                    total_clients: 0,
                    active_clients: 0,
                    total_sessions: 0,
                    is_verified: false,
                    is_available: true,
                  } : {
                    total_workouts: 0,
                    current_streak: 0,
                    longest_streak: 0,
                    total_calories_burned: 0,
                  })
                })
                .select()
                .single()
              
              if (directError) {
                console.error("Direct insertion also failed:", directError)
              } else {
                console.log("Direct insertion succeeded:", directData)
                profileCreated = true
              }
            } catch (directErr) {
              console.error("Direct insertion error:", directErr)
            }
          }
          
          if (!profileCreated) {
            console.error("All profile creation attempts failed!")
          }
        } else {
          console.log("User already has a profile in database")
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
    console.log("Starting Google OAuth sign-in with userType:", userType)
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const redirectUrl = `${window.location.origin}/auth/callback?userType=${userType || 'member'}`
    console.log("Redirect URL:", redirectUrl)
    
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

    console.log("OAuth response data:", data)
    console.log("OAuth response error:", error)

    if (error) {
      console.error("Google OAuth error:", error)
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
      return { error }
    }

    console.log("Google OAuth initiated successfully")
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