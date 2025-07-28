import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create service client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking user existence for:', email)

    let userExists = false
    let userDetails = null

    // 1. Check auth.users table
    try {
      const { data: authUser, error: authError } = await supabaseService
        .from('auth.users')
        .select('id, email, email_confirmed_at, created_at')
        .eq('email', email.toLowerCase())
        .maybeSingle()

      if (authError) {
        console.error('Error checking auth.users:', authError)
      } else if (authUser) {
        userExists = true
        userDetails = {
          id: authUser.id,
          email: authUser.email,
          email_confirmed: !!authUser.email_confirmed_at,
          created_at: authUser.created_at,
          source: 'auth.users'
        }
        console.log('✅ User found in auth.users')
      }
    } catch (authErr) {
      console.error('Exception checking auth.users:', authErr)
    }

    // 2. Check members table (if not found in auth.users)
    if (!userExists) {
      try {
        const { data: memberUser, error: memberError } = await supabaseService
          .from('members')
          .select('id, user_id, email, username, full_name, created_at')
          .eq('email', email.toLowerCase())
          .maybeSingle()

        if (memberError) {
          console.error('Error checking members table:', memberError)
        } else if (memberUser) {
          userExists = true
          userDetails = {
            id: memberUser.id,
            user_id: memberUser.user_id,
            email: memberUser.email,
            username: memberUser.username,
            full_name: memberUser.full_name,
            created_at: memberUser.created_at,
            source: 'members'
          }
          console.log('✅ User found in members table')
        }
      } catch (memberErr) {
        console.error('Exception checking members table:', memberErr)
      }
    }

    // 3. Check trainers table (if not found in auth.users or members)
    if (!userExists) {
      try {
        const { data: trainerUser, error: trainerError } = await supabaseService
          .from('trainers')
          .select('id, user_id, email, username, full_name, created_at')
          .eq('email', email.toLowerCase())
          .maybeSingle()

        if (trainerError) {
          console.error('Error checking trainers table:', trainerError)
        } else if (trainerUser) {
          userExists = true
          userDetails = {
            id: trainerUser.id,
            user_id: trainerUser.user_id,
            email: trainerUser.email,
            username: trainerUser.username,
            full_name: trainerUser.full_name,
            created_at: trainerUser.created_at,
            source: 'trainers'
          }
          console.log('✅ User found in trainers table')
        }
      } catch (trainerErr) {
        console.error('Exception checking trainers table:', trainerErr)
      }
    }

    console.log('🔍 User exists:', userExists)
    if (userExists) {
      console.log('📋 User details:', userDetails)
    }

    return NextResponse.json({
      exists: userExists,
      user: userDetails
    })

  } catch (error) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 