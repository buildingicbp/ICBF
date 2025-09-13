import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// WARNING: Using plain text passwords in production is not recommended
// This is only for development/demo purposes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔍 Trainer login API called with:", { email, password: "***" })

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log("🔍 Checking trainer_accounts table...")
    
    // First, find the trainer by email
    const { data: trainerAccount, error: findError } = await supabaseService
      .from('trainer_accounts')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    // If no trainer found or error occurred
    if (findError || !trainerAccount) {
      console.log("❌ No trainer account found with this email")
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // WARNING: Plain text password comparison - NOT RECOMMENDED FOR PRODUCTION
    if (password !== trainerAccount.password) {
      console.log("❌ Password does not match")
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log("✅ Login successful for trainer:", trainerAccount.email)

    // Return trainer data for session storage
    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerAccount.id,
        email: trainerAccount.email,
        full_name: trainerAccount.full_name,
        loginTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Trainer login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
