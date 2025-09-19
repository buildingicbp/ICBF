import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch member's assigned trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberEmail = searchParams.get('email')

    if (!memberEmail) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // First get the member profile
    const { data: member, error: memberError } = await supabaseService
      .from('members')
      .select('id')
      .eq('email', memberEmail)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Member profile not found' },
        { status: 404 }
      )
    }

    // Get the active trainer assignment for this member from admin system
    const { data: assignment, error: assignmentError } = await supabaseService
      .from('trainer_member_assignments')
      .select(`
        id,
        assigned_date,
        notes,
        is_active,
        trainer:trainer_accounts(
          id,
          full_name,
          email,
          specialization,
          experience_years,
          bio,
          is_active
        )
      `)
      .eq('member_id', member.id)
      .eq('is_active', true)
      .single()

    if (assignmentError) {
      // Member might not have an assigned trainer yet
      return NextResponse.json({ 
        trainer: null,
        assignment: null,
        message: 'No trainer assigned yet'
      })
    }

    return NextResponse.json({ 
      trainer: assignment.trainer,
      assignment: {
        id: assignment.id,
        assigned_date: assignment.assigned_date,
        notes: assignment.notes
      }
    })
  } catch (error) {
    console.error('Error in GET /api/member-trainer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
