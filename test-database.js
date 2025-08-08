// Test script to verify database connectivity and profile creation
// Run this in your browser console or as a Node.js script

const testDatabaseConnection = async () => {
  console.log('Testing database connection...')
  
  try {
    // Test if we can access the supabase client
    const { supabase, supabaseService } = await import('./lib/supabase.js')
    
    console.log('✅ Supabase clients loaded successfully')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('members')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return false
    }
    
    console.log('✅ Database connection successful')
    
    // Test service role connection
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('members')
      .select('count')
      .limit(1)
    
    if (serviceError) {
      console.error('❌ Service role connection failed:', serviceError)
      console.log('⚠️  This might be due to missing service role key')
    } else {
      console.log('✅ Service role connection successful')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to load Supabase:', error)
    return false
  }
}

const testProfileCreation = async () => {
  console.log('Testing profile creation...')
  
  try {
    const { createMemberProfile, createTrainerProfile } = await import('./lib/supabase.js')
    
    // Test member profile creation
    const testMemberData = {
      user_id: 'test-member-id-' + Date.now(),
      username: 'test_member',
      email: 'test.member@example.com',
      contact: '+1234567890',
      full_name: 'Test Member'
    }
    
    const { data: memberData, error: memberError } = await createMemberProfile(testMemberData)
    
    if (memberError) {
      console.error('❌ Member profile creation failed:', memberError)
    } else {
      console.log('✅ Member profile created successfully:', memberData)
    }
    
    // Test trainer profile creation
    const testTrainerData = {
      user_id: 'test-trainer-id-' + Date.now(),
      username: 'test_trainer',
      email: 'test.trainer@example.com',
      contact: '+1234567890',
      full_name: 'Test Trainer'
    }
    
    const { data: trainerData, error: trainerError } = await createTrainerProfile(testTrainerData)
    
    if (trainerError) {
      console.error('❌ Trainer profile creation failed:', trainerError)
    } else {
      console.log('✅ Trainer profile created successfully:', trainerData)
    }
    
    return !memberError && !trainerError
    
  } catch (error) {
    console.error('❌ Profile creation test failed:', error)
    return false
  }
}

const testEnvironmentVariables = () => {
  console.log('Testing environment variables...')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  let allPresent = true
  
  requiredVars.forEach(varName => {
    const value = process.env[varName] || window[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`❌ ${varName}: Missing`)
      allPresent = false
    }
  })
  
  return allPresent
}

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting database tests...')
  console.log('=====================================')
  
  const envOk = testEnvironmentVariables()
  console.log('=====================================')
  
  if (envOk) {
    const dbOk = await testDatabaseConnection()
    console.log('=====================================')
    
    if (dbOk) {
      await testProfileCreation()
    }
  }
  
  console.log('=====================================')
  console.log('🏁 Tests completed!')
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.testDatabase = {
    testDatabaseConnection,
    testProfileCreation,
    testEnvironmentVariables,
    runAllTests
  }
  console.log('Database test functions available as window.testDatabase')
} else {
  // Node.js environment
  module.exports = {
    testDatabaseConnection,
    testProfileCreation,
    testEnvironmentVariables,
    runAllTests
  }
}

// Auto-run if this is the main module
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests()
} 