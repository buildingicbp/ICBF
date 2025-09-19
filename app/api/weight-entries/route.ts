import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get weight entries for the current user, ordered by date
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('member_id', user.id)
      .order('recorded_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weight entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { weight, notes } = await request.json()

    // Validate input
    if (!weight || isNaN(weight)) {
      return NextResponse.json(
        { error: 'Valid weight is required' },
        { status: 400 }
      )
    }

    // First, check if we have a valid date
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split('T')[0]

    // Insert new weight entry
    const { data, error } = await supabase
      .from('weight_entries')
      .upsert(
        {
          member_id: user.id,
          weight: parseFloat(weight),
          notes: notes || null,
          recorded_at: currentDate.toISOString()
        },
        {
          onConflict: 'member_id,recorded_at',
          ignoreDuplicates: false
        }
      )
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(error.message || 'Failed to save weight entry')
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from database')
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error in weight entries API:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process weight entry',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
