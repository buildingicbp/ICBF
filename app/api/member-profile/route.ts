import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch current user's member profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('email')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Fetch member profile by email
    const { data: member, error: memberError } = await supabaseService
      .from('members')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (memberError) {
      console.error('Error fetching member profile:', memberError)
      return NextResponse.json(
        { error: 'Failed to fetch member profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      member
    })
  } catch (error) {
    console.error('Error in GET /api/member-profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
