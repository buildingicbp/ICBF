import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for admin operations (bypasses RLS)
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

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
  
  const { data, error } = await supabaseService
    .from('members')
    .insert({
      user_id: userData.user_id,
      username: userData.username,
      email: userData.email,
      contact: userData.contact,
      full_name: userData.full_name,
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
  } else {
    console.log("Member profile created successfully:", data)
  }

  return { data, error }
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
  
  const { data, error } = await supabaseService
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
  } else {
    console.log("Trainer profile created successfully:", data)
  }

  return { data, error }
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