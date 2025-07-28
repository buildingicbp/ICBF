'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log("🔄 ===== EMAIL CONFIRMATION CALLBACK START =====")
        setDebugInfo("Processing email confirmation...")
        
        // Wait for client-side
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (typeof window === 'undefined') {
          console.log("❌ Not on client side")
          setDebugInfo("Not on client side")
          return
        }
        
        // Parse URL parameters
        const userType = searchParams.get('userType') || 'member'
        
        console.log("🎯 UserType from URL:", userType)
        console.log("🔗 Full URL:", window.location.href)
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
        
        // Check if user is confirmed
        if (!session.user.email_confirmed_at) {
          console.log("❌ Email not confirmed")
          setDebugInfo("Email not confirmed")
          toast.error("Email not confirmed")
          router.push('/signin')
          return
        }
        
        console.log("✅ Email confirmed at:", session.user.email_confirmed_at)
        setDebugInfo("Email confirmed successfully")
        
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
        console.error("💥 Auth callback error:", error)
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        toast.error("Authentication failed")
        router.push('/signin')
      } finally {
        setIsProcessing(false)
      }
    }
    
    processAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Confirming your email...</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">{debugInfo}</p>
      </div>
    </div>
  )
} 