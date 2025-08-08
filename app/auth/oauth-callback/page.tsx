'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, createMemberProfile } from '@/lib/supabase'
import { toast } from 'sonner'

export default function OAuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log("🔄 ===== OAUTH CALLBACK START =====")
        setDebugInfo("Starting OAuth callback...")
        
        // Wait for client-side
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (typeof window === 'undefined') {
          console.log("❌ Not on client side")
          setDebugInfo("Not on client side")
          return
        }
        
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search)
        const userType = params.get('userType') || 'member'
        
        console.log("🎯 UserType from URL:", userType)
        console.log("🔗 Full URL:", window.location.href)
        console.log("🔗 Search params:", window.location.search)
        setDebugInfo(`UserType from URL: ${userType}`)
        
        // Get session
        console.log("🔄 Getting session...")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError)
          setDebugInfo(`Session error: ${sessionError.message}`)
          toast.error("Session error")
          router.push('/signin')
          return
        }
        
        if (!session?.user) {
          console.log("❌ No session found")
          setDebugInfo("No session found")
          toast.error("No user session found")
          router.push('/signin')
          return
        }
        
        console.log("✅ User authenticated:", session.user.email)
        console.log("📊 User metadata:", session.user.user_metadata)
        setDebugInfo(`User authenticated: ${session.user.email}`)
        
        // Update metadata with user type
        console.log("🔄 Updating user metadata...")
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            userType, 
            signupDate: new Date().toISOString(),
            username: session.user.email?.split('@')[0] || 'user',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
          }
        })
        
        if (updateError) {
          console.error("❌ Failed to update metadata:", updateError)
          setDebugInfo(`Metadata update failed: ${updateError.message}`)
        } else {
          console.log("✅ Metadata updated successfully")
          setDebugInfo("Metadata updated successfully")
        }
        
        // Create member profile for new users
        if (userType === 'member') {
          try {
            console.log("🆕 Creating member profile for OAuth user:", session.user.id)
            
            const profileData = {
              user_id: session.user.id,
              username: session.user.email?.split('@')[0] || 'user',
              email: session.user.email || '',
              contact: '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            }

            console.log("📝 Profile data:", profileData)

            const result = await createMemberProfile(profileData)
            if (result.error) {
              console.error("❌ Failed to create member profile:", result.error)
              // Don't fail the OAuth flow if profile creation fails
            } else {
              console.log("✅ Member profile created successfully:", result.data)
              setDebugInfo("Member profile created successfully")
            }
          } catch (profileError) {
            console.error('❌ Error creating member profile:', profileError)
            // Don't fail the OAuth flow if profile creation fails
          }
        }

        // Redirect based on user type
        console.log("🎯 Redirecting based on userType:", userType)
        setDebugInfo(`Redirecting to ${userType} dashboard...`)
        
        if (userType === 'trainer') {
          console.log("🎯 Redirecting to trainer dashboard...")
          router.push('/trainer-dashboard')
        } else {
          console.log("🎯 Redirecting to member dashboard...")
          router.push('/member-dashboard')
        }
        
      } catch (error) {
        console.error("💥 OAuth callback error:", error)
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        toast.error("Authentication failed")
        router.push('/signin')
      } finally {
        setIsProcessing(false)
      }
    }
    
    processAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Setting up your account...</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">{debugInfo}</p>
      </div>
    </div>
  )
} 