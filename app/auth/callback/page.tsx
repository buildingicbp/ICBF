"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, createMemberProfile, createTrainerProfile } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get userType from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const userType = urlParams.get('userType') || 'member'
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth callback error:", error)
          router.push("/signin?error=auth_callback_failed")
          return
        }

        if (data.session) {
          const user = data.session.user
          
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
              const { data: memberData } = await supabase
                .from('members')
                .select('id')
                .eq('user_id', user.id)
                .single()
              
              // Check if user exists in trainers table
              const { data: trainerData } = await supabase
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
          
          // Successfully authenticated, redirect to dashboard
          console.log("Auth successful, redirecting to dashboard")
          router.push("/dashboard")
        } else {
          // Try to get the session from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          
          if (accessToken) {
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
                  const { data: memberData } = await supabase
                    .from('members')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()
                  
                  // Check if user exists in trainers table
                  const { data: trainerData } = await supabase
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
              router.push("/dashboard")
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
      </div>
    </div>
  )
} 