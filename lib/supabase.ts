import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for admin operations (bypasses RLS)
// Use service key if available, otherwise use regular client
export const supabaseService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
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
  
  try {
    // Use regular client directly - this should work with proper RLS policies
    const { data, error } = await supabase
      .from('members')
      .insert({
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email,
        contact: userData.contact,
        full_name: userData.full_name || userData.username,
        join_date: new Date().toISOString(),
        total_workouts: 0,
        current_streak: 0,
        longest_streak: 0,
        total_calories_burned: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating member profile:", error)
      return { data: null, error }
    } else {
      console.log("Member profile created successfully:", data)
      return { data, error: null }
    }
  } catch (err) {
    console.error("Unexpected error creating member profile:", err)
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

// Make debug function available globally
if (typeof window !== 'undefined') {
  (window as any).debugDatabase = debugDatabase
  ;(window as any).testDatabaseInsertion = testDatabaseInsertion
} 