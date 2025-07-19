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
    
    // Test 3: Check current session first
    addLog("3. Checking current session...")
    const {data: sessionData} = await supabase.auth.getSession()
    if (!sessionData.session) {
      addLog("❌ No active session - please log in first")
      setLoading(false)
      return
    }
    
    const currentUser = sessionData.session.user
    addLog(`✅ User logged in: ${currentUser.email}`)
    addLog(`User ID: ${currentUser.id}`)
    addLog(`User metadata: ${JSON.stringify(currentUser.user_metadata)}`)
    
    // Test 4: Check if user already has a profile
    addLog("4. Checking existing profiles...")
    try {
      const {data: memberData} = await supabase.from('members').select('id').eq('user_id', currentUser.id).single()
      const {data: trainerData} = await supabase.from('trainers').select('id').eq('user_id', currentUser.id).single()
      
      if (memberData) {
        addLog("✅ User has member profile")
      } else if (trainerData) {
        addLog("✅ User has trainer profile")
      } else {
        addLog("ℹ️ User has no profile yet")
      }
    } catch (err) {
      addLog("ℹ️ User has no profile yet")
    }
    
    // Test 5: RLS Policy Test (only if user has no profile)
    addLog("5. Testing RLS policies...")
    try {
      // Check if user already has a profile
      const {data: existingMember} = await supabase.from('members').select('id').eq('user_id', currentUser.id).single()
      const {data: existingTrainer} = await supabase.from('trainers').select('id').eq('user_id', currentUser.id).single()
      
      if (existingMember || existingTrainer) {
        addLog("ℹ️ User already has profile, skipping insert test")
      } else {
        // Test creating a member profile
        const testData = {
          user_id: currentUser.id,
          username: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'user',
          email: currentUser.email || '',
          contact: currentUser.user_metadata?.phone || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User'
        }
        
        const {data: insertData, error: insertError} = await supabase.from('members').insert(testData).select()
        
        if (insertError) {
          addLog(`❌ Insert failed: ${insertError.message}`)
          addLog(`Error details: ${JSON.stringify(insertError)}`)
        } else {
          addLog("✅ Insert successful")
          addLog(`Inserted data: ${JSON.stringify(insertData)}`)
          
          // Clean up
          await supabase.from('members').delete().eq('user_id', currentUser.id)
          addLog("🧹 Test data cleaned up")
        }
      }
    } catch (err) {
      addLog(`❌ Insert error: ${err}`)
    }
    
    // Test 6: Profile creation functions
    addLog("6. Testing profile creation functions...")
    try {
      // Check if user already has a profile
      const {data: existingMember} = await supabase.from('members').select('id').eq('user_id', currentUser.id).single()
      const {data: existingTrainer} = await supabase.from('trainers').select('id').eq('user_id', currentUser.id).single()
      
      if (existingMember || existingTrainer) {
        addLog("ℹ️ User already has profile, skipping creation test")
      } else {
        const testMemberData = {
          user_id: currentUser.id,
          username: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'user',
          email: currentUser.email || '',
          contact: currentUser.user_metadata?.phone || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User'
        }
        
        const memberResult = await createMemberProfile(testMemberData)
        if (memberResult.error) {
          addLog(`❌ Member profile creation failed: ${memberResult.error.message}`)
        } else {
          addLog("✅ Member profile creation successful")
          addLog(`Member data: ${JSON.stringify(memberResult.data)}`)
          
          // Clean up
          await supabase.from('members').delete().eq('user_id', currentUser.id)
          addLog("🧹 Member test data cleaned up")
        }
      }
    } catch (err) {
      addLog(`❌ Member profile creation error: ${err}`)
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