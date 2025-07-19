"use client"

import { useEffect, useState } from "react"
import { supabase, supabaseService, createMemberProfile, createTrainerProfile } from "@/lib/supabase"

export default function DebugPage() {
  const [debugResults, setDebugResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    setDebugResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runDebugTests = async () => {
    setLoading(true)
    setDebugResults([])
    
    addLog("🔍 Starting debug tests...")
    
    // Test 1: Check Supabase clients
    addLog("1. Checking Supabase clients...")
    if (typeof supabase !== 'undefined') {
      addLog("✅ Supabase client available")
    } else {
      addLog("❌ Supabase client not available")
      setLoading(false)
      return
    }
    
    if (typeof supabaseService !== 'undefined') {
      addLog("✅ Supabase service client available")
    } else {
      addLog("❌ Supabase service client not available")
    }
    
    // Test 2: Database connection
    addLog("2. Testing database connection...")
    try {
      const {data, error} = await supabase.from('members').select('count').limit(1)
      if (error) {
        addLog(`❌ Connection failed: ${error.message}`)
      } else {
        addLog("✅ Connection successful")
      }
    } catch (err) {
      addLog(`❌ Connection error: ${err}`)
    }
    
    // Test 3: RLS Policy Test
    addLog("3. Testing RLS policies...")
    try {
      // Generate a proper UUID
      const testUserId = crypto.randomUUID()
      const testData = {
        user_id: testUserId,
        username: 'testuser',
        email: 'test@example.com',
        contact: '+1234567890',
        full_name: 'Test User'
      }
      
      const {data: insertData, error: insertError} = await supabase.from('members').insert(testData).select()
      
      if (insertError) {
        addLog(`❌ Insert failed: ${insertError.message}`)
        addLog(`Error details: ${JSON.stringify(insertError)}`)
      } else {
        addLog("✅ Insert successful")
        addLog(`Inserted data: ${JSON.stringify(insertData)}`)
        
        // Clean up
        await supabase.from('members').delete().eq('user_id', testUserId)
        addLog("🧹 Test data cleaned up")
      }
    } catch (err) {
      addLog(`❌ Insert error: ${err}`)
    }
    
    // Test 4: Profile creation functions
    addLog("4. Testing profile creation functions...")
    try {
      // Generate a proper UUID
      const testMemberUserId = crypto.randomUUID()
      const testMemberData = {
        user_id: testMemberUserId,
        username: 'testmember',
        email: 'testmember@example.com',
        contact: '+1234567890',
        full_name: 'Test Member'
      }
      
      const memberResult = await createMemberProfile(testMemberData)
      if (memberResult.error) {
        addLog(`❌ Member profile creation failed: ${memberResult.error.message}`)
      } else {
        addLog("✅ Member profile creation successful")
        addLog(`Member data: ${JSON.stringify(memberResult.data)}`)
        
        // Clean up
        await supabase.from('members').delete().eq('user_id', testMemberUserId)
        addLog("🧹 Member test data cleaned up")
      }
    } catch (err) {
      addLog(`❌ Member profile creation error: ${err}`)
    }
    
    // Test 5: Check current session
    addLog("5. Checking current session...")
    const {data: sessionData} = await supabase.auth.getSession()
    if (sessionData.session) {
      addLog(`✅ User logged in: ${sessionData.session.user.email}`)
      addLog(`User metadata: ${JSON.stringify(sessionData.session.user.user_metadata)}`)
    } else {
      addLog("ℹ️ No active session")
    }
    
    addLog("✅ Debug tests completed")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Deployment Debug</h1>
        
        <button
          onClick={runDebugTests}
          disabled={loading}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running Tests..." : "Run Debug Tests"}
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Results:</h2>
          <div className="bg-gray-100 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {debugResults.length === 0 ? (
              <p className="text-gray-500">Click "Run Debug Tests" to start debugging...</p>
            ) : (
              debugResults.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Run the debug tests above</li>
            <li>Check the results for any errors</li>
            <li>If RLS policy errors appear, run the SQL fix in Supabase</li>
            <li>Try signing up a new user after fixing any issues</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 