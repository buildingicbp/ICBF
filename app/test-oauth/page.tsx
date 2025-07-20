'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TestOAuth() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testOAuthFlow = async () => {
    try {
      addResult("🔄 Testing OAuth flow...")
      
      // Test 1: Check current URL
      addResult(`🔗 Current URL: ${window.location.href}`)
      addResult(`🔗 Search params: ${window.location.search}`)
      
      // Test 2: Parse userType
      const params = new URLSearchParams(window.location.search)
      const userType = params.get('userType')
      addResult(`🎯 UserType from URL: ${userType}`)
      addResult(`🎯 UserType type: ${typeof userType}`)
      addResult(`🎯 UserType === 'trainer': ${userType === 'trainer'}`)
      addResult(`🎯 UserType === 'member': ${userType === 'member'}`)
      
      // Test 3: Check session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        addResult(`✅ User authenticated: ${session.user.email}`)
        addResult(`📊 User metadata: ${JSON.stringify(session.user.user_metadata)}`)
      } else {
        addResult("❌ No session found")
      }
      
      // Test 4: Simulate OAuth redirect
      const testUrl = `${window.location.origin}/auth/oauth-callback?userType=trainer`
      addResult(`🔗 Test OAuth URL: ${testUrl}`)
      
    } catch (error) {
      addResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    testOAuthFlow()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth Flow Test</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Test Results:</h2>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/auth/oauth-callback?userType=trainer'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Trainer OAuth Callback
          </button>
          
          <button 
            onClick={() => window.location.href = '/auth/oauth-callback?userType=member'}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
          >
            Test Member OAuth Callback
          </button>
          
          <button 
            onClick={() => router.push('/signin')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  )
} 