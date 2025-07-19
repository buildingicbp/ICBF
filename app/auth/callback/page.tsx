"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, createMemberProfile, createTrainerProfile, supabaseService } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback started")
        
        // Get userType from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const userType = urlParams.get('userType') || 'member'
        console.log("User type from URL:", userType)
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        console.log("Session data:", data)
        console.log("Session error:", error)
        
        if (error) {
          console.error("Auth callback error:", error)
          router.push("/signin?error=auth_callback_failed")
          return
        }

        if (data.session) {
          const user = data.session.user
          console.log("User authenticated:", user.email)
          console.log("Current user metadata:", user.user_metadata)
          
          // Always update user metadata with userType to ensure it's set correctly
          console.log("Updating user metadata with userType:", userType)
          const { error: updateError } = await supabase.auth.updateUser({
            data: { userType: userType }
          })
          
          if (updateError) {
            console.error("Error updating user metadata:", updateError)
          } else {
            console.log("User metadata updated successfully")
          }
          
          // Wait a moment for the metadata to be updated, then get the fresh session
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Get the updated session to ensure we have the latest metadata
          const { data: updatedSessionData } = await supabase.auth.getSession()
          const updatedUser = updatedSessionData.session?.user
          console.log("Updated user metadata:", updatedUser?.user_metadata)
          
          // Check if user has a profile in the database, create if not
          if (updatedUser) {
            try {
              console.log("Checking for existing profile...")
              // Check if user exists in members table
              const { data: memberData } = await supabaseService
                .from('members')
                .select('id')
                .eq('user_id', updatedUser.id)
                .single()
              
              // Check if user exists in trainers table
              const { data: trainerData } = await supabaseService
                .from('trainers')
                .select('id')
                .eq('user_id', updatedUser.id)
                .single()
              
              console.log("Member data:", memberData)
              console.log("Trainer data:", trainerData)
              
              // If user doesn't exist in either table, create profile
              if (!memberData && !trainerData) {
                console.log("Creating new profile for user")
                console.log("Creating profile for userType:", userType)
                
                const profileData = {
                  user_id: updatedUser.id,
                  username: updatedUser.user_metadata?.full_name || updatedUser.email?.split('@')[0] || 'user',
                  email: updatedUser.email || '',
                  contact: updatedUser.user_metadata?.phone || '',
                  full_name: updatedUser.user_metadata?.full_name || updatedUser.user_metadata?.name || updatedUser.email?.split('@')[0] || 'User',
                }
                
                console.log("Profile data to create:", profileData)
                
                if (userType === 'trainer') {
                  console.log("Creating trainer profile...")
                  const result = await createTrainerProfile(profileData)
                  if (result.error) {
                    console.error("Failed to create trainer profile:", result.error)
                  } else {
                    console.log('Created trainer profile for OAuth user:', result.data)
                  }
                } else {
                  console.log("Creating member profile...")
                  const result = await createMemberProfile(profileData)
                  if (result.error) {
                    console.error("Failed to create member profile:", result.error)
                  } else {
                    console.log('Created member profile for OAuth user:', result.data)
                  }
                }
              } else {
                console.log("User profile already exists")
              }
            } catch (profileError) {
              console.error('Error checking/creating profile:', profileError)
              // Don't fail the auth if profile creation fails
            }
          }
          
          // Successfully authenticated, redirect to dashboard
          console.log("Auth successful, redirecting to dashboard")
          
          // Add a small delay to ensure everything is processed
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          console.log("No session found, checking URL hash...")
          // Try to get the session from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          
          if (accessToken) {
            console.log("Found access token in URL hash")
            // Set the session manually if we have an access token
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            })
            
            if (sessionError) {
              console.error("Session error:", sessionError)
              router.push("/signin?error=auth_callback_failed")
              return
            }
            
            if (sessionData.session) {
              const user = sessionData.session.user
              console.log("Session set successfully for user:", user.email)
              
              // Update user metadata with userType if it's a new user
              if (user && !user.user_metadata?.userType) {
                const { error: updateError } = await supabase.auth.updateUser({
                  data: { userType: userType }
                })
                
                if (updateError) {
                  console.error("Error updating user metadata:", updateError)
                }
              }
              
              // Check if user has a profile in the database, create if not
              if (user) {
                try {
                  // Check if user exists in members table
                  const { data: memberData } = await supabaseService
                    .from('members')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()
                  
                  // Check if user exists in trainers table
                  const { data: trainerData } = await supabaseService
                    .from('trainers')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()
                  
                  // If user doesn't exist in either table, create profile
                  if (!memberData && !trainerData) {
                    const profileData = {
                      user_id: user.id,
                      username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'user',
                      email: user.email || '',
                      contact: user.user_metadata?.phone || '',
                      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                    }
                    
                    if (userType === 'trainer') {
                      await createTrainerProfile(profileData)
                      console.log('Created trainer profile for OAuth user')
                    } else {
                      await createMemberProfile(profileData)
                      console.log('Created member profile for OAuth user')
                    }
                  }
                } catch (profileError) {
                  console.error('Error checking/creating profile:', profileError)
                  // Don't fail the auth if profile creation fails
                }
              }
              
              console.log("Session set successfully, redirecting to dashboard")
              setTimeout(() => {
                router.push("/dashboard")
              }, 1000)
              return
            }
          }
          
          // No session found, redirect to signin
          console.log("No session found, redirecting to signin")
          router.push("/signin")
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error)
        router.push("/signin?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we set up your account</p>
      </div>
    </div>
  )
} 