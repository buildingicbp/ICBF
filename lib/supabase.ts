import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

// Clean up service key (remove any whitespace or newlines)
const cleanServiceKey = supabaseServiceKey?.trim()

// Log environment variables (without exposing sensitive data)
console.log("Environment check:", {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey,
  urlLength: supabaseUrl?.length || 0,
  anonKeyLength: supabaseAnonKey?.length || 0,
  serviceKeyLength: supabaseServiceKey?.length || 0
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for admin operations (bypasses RLS)
// Use service key if available, otherwise use regular client
export const supabaseService = cleanServiceKey 
  ? createClient(supabaseUrl, cleanServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase

// Database table types
export interface Member {
  id: string
  user_id: string
  username: string
  email: string
  contact: string
  full_name?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  height?: number
  weight?: number
  fitness_goals?: string[]
  experience_level?: 'beginner' | 'intermediate' | 'advanced'
  medical_conditions?: string[]
  emergency_contact?: string
  membership_type?: 'basic' | 'premium' | 'vip'
  join_date: string
  last_workout?: string
  total_workouts: number
  current_streak: number
  longest_streak: number
  total_calories_burned: number
  created_at: string
  updated_at: string
}

export interface Trainer {
  id: string
  user_id: string
  username: string
  email: string
  contact: string
  full_name: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  specialization: string[]
  certifications: string[]
  experience_years: number
  bio?: string
  hourly_rate: number
  rating: number
  total_reviews: number
  total_clients: number
  active_clients: number
  total_sessions: number
  join_date: string
  is_verified: boolean
  is_available: boolean
  working_hours?: string
  location?: string
  created_at: string
  updated_at: string
}

// Database functions
export const createMemberProfile = async (userData: {
  user_id: string
  username: string
  email: string
  contact: string
  full_name?: string
}) => {
  console.log("Creating member profile with data:", userData)
  console.log("Data validation:", {
    user_id: userData.user_id ? 'present' : 'missing',
    username: userData.username ? 'present' : 'missing',
    email: userData.email ? 'present' : 'missing',
    contact: userData.contact ? 'present' : 'missing',
    full_name: userData.full_name ? 'present' : 'missing'
  })
  
  try {
    // Use service role client for reliable database operations
    const insertData = {
      user_id: userData.user_id,
      username: userData.username,
      email: userData.email,
      contact: userData.contact,
      full_name: userData.full_name || userData.username,
      join_date: new Date().toISOString(),
    }
    
    console.log("Inserting data:", insertData)
    console.log("Service client available:", !!supabaseService)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Service key present:", !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    console.log("Service key starts with:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "...")
    
    // Test basic connection first
    console.log("Testing basic connection...")
    const { data: testData, error: testError } = await supabaseService
      .from('members')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error("Basic connection test failed:", testError)
      return { data: null, error: testError }
    } else {
      console.log("Basic connection test passed")
    }
    
    const { data, error } = await supabaseService
      .from('members')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Service client error creating member profile:", error)
      console.error("Error type:", typeof error)
      console.error("Error keys:", Object.keys(error))
      console.error("Error stringified:", JSON.stringify(error, null, 2))
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Try with regular client as fallback
      console.log("Trying with regular client as fallback...")
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('members')
        .insert(insertData)
        .select()
        .single()
      
      if (fallbackError) {
        console.error("Regular client also failed:", fallbackError)
        return { data: null, error: fallbackError }
      } else {
        console.log("Regular client succeeded:", fallbackData)
        return { data: fallbackData, error: null }
      }
    } else {
      console.log("Member profile created successfully:", data)
      return { data, error: null }
    }
  } catch (err) {
    console.error("Unexpected error creating member profile:", err)
    console.error("Error type:", typeof err)
    console.error("Error stringified:", JSON.stringify(err, null, 2))
    return { data: null, error: err as Error }
  }
}

export const createTrainerProfile = async (userData: {
  user_id: string
  username: string
  email: string
  contact: string
  full_name: string
  specialization?: string[]
  hourly_rate?: number
}) => {
  console.log("Creating trainer profile with data:", userData)
  
  try {
    // Use regular client directly - this should work with proper RLS policies
    const { data, error } = await supabase
      .from('trainers')
      .insert({
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email,
        contact: userData.contact,
        full_name: userData.full_name,
        specialization: userData.specialization || [],
        hourly_rate: userData.hourly_rate || 50,
        experience_years: 0,
        rating: 0,
        total_reviews: 0,
        total_clients: 0,
        active_clients: 0,
        total_sessions: 0,
        join_date: new Date().toISOString(),
        is_verified: false,
        is_available: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating trainer profile:", error)
      return { data: null, error }
    } else {
      console.log("Trainer profile created successfully:", data)
      return { data, error: null }
    }
  } catch (err) {
    console.error("Unexpected error creating trainer profile:", err)
    return { data: null, error: err as Error }
  }
}

export const getMemberProfile = async (userId: string) => {
  const { data, error } = await supabaseService
    .from('members')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export const getTrainerProfile = async (userId: string) => {
  const { data, error } = await supabaseService
    .from('trainers')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export const updateMemberProfile = async (userId: string, updates: Partial<Member>) => {
  const { data, error } = await supabase
    .from('members')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export const updateTrainerProfile = async (userId: string, updates: Partial<Trainer>) => {
  const { data, error } = await supabase
    .from('trainers')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export const getAllMembers = async () => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getAllTrainers = async () => {
  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

// Test function to directly test database insertion
export const testDatabaseInsertion = async () => {
  console.log("Testing direct database insertion...")
  
  const testData = {
    user_id: 'test-' + Date.now(),
    username: 'testuser',
    email: 'test@example.com',
    contact: '+1234567890',
    full_name: 'Test User'
  }
  
  try {
    // Test with service client
    const { data, error } = await supabaseService
      .from('members')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.error("Service client insertion failed:", error)
      
      // Test with regular client
      const { data: regData, error: regError } = await supabase
        .from('members')
        .insert(testData)
        .select()
        .single()
      
      if (regError) {
        console.error("Regular client insertion also failed:", regError)
        return { success: false, error: regError }
      } else {
        console.log("Regular client insertion succeeded:", regData)
        return { success: true, data: regData }
      }
    } else {
      console.log("Service client insertion succeeded:", data)
      return { success: true, data }
    }
  } catch (err) {
    console.error("Unexpected error in test insertion:", err)
    return { success: false, error: err }
  }
}

// Debug function for browser console
export const debugDatabase = () => {
  console.log("🔍 Database Debug Info:")
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Service Key Present:", !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
  console.log("Service Key Length:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.length || 0)
  
  // Test basic connection
  supabase.from('members').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.error("❌ Basic connection failed:", error)
    } else {
      console.log("✅ Basic connection successful")
    }
  })
  
  // Test service connection
  supabaseService.from('members').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.error("❌ Service connection failed:", error)
    } else {
      console.log("✅ Service connection successful")
    }
  })
}

// Test RLS policies
export const testRLSPolicies = async () => {
  console.log("🧪 Testing RLS Policies...")
  
  try {
    // Test if we can insert a member
    const testMemberData = {
      user_id: 'test-rls-' + Date.now(),
      username: 'test_rls_user',
      email: 'test.rls@example.com',
      contact: '+1234567890',
      full_name: 'Test RLS User'
    }
    
    const { data, error } = await supabase
      .from('members')
      .insert(testMemberData)
      .select()
      .single()
    
    if (error) {
      console.error("❌ RLS policy test failed:", error)
      return false
    } else {
      console.log("✅ RLS policy test passed:", data)
      
      // Clean up test data
      await supabase.from('members').delete().eq('user_id', testMemberData.user_id)
      console.log("🧹 Test data cleaned up")
      return true
    }
  } catch (err) {
    console.error("❌ RLS policy test error:", err)
    return false
  }
}

// Make debug function available globally
if (typeof window !== 'undefined') {
  (window as any).debugDatabase = debugDatabase
  ;(window as any).testDatabaseInsertion = testDatabaseInsertion
  ;(window as any).testRLSPolicies = testRLSPolicies
  ;(window as any).testSimpleConnection = async () => {
    try {
      console.log("Testing simple connection...")
      console.log("Service key present:", !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
      console.log("Service key starts with:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "...")
      
      const { data, error } = await supabaseService.from('members').select('count').limit(1)
      if (error) {
        console.error("❌ Connection failed:", error)
        console.error("Error details:", error)
        return false
      } else {
        console.log("✅ Connection successful:", data)
        return true
      }
    } catch (err) {
      console.error("❌ Connection error:", err)
      return false
    }
  }
} 