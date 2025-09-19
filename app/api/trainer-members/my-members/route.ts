import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch members assigned to a specific trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainerEmail = searchParams.get('trainer_email')

    if (!trainerEmail) {
      return NextResponse.json(
        { error: 'trainer_email is required' },
        { status: 400 }
      )
    }

    // First, get the trainer ID from the email
    const { data: trainer, error: trainerError } = await supabaseService
      .from('trainer_accounts')
      .select('id, full_name, email')
      .eq('email', trainerEmail)
      .eq('is_active', true)
      .single()

    if (trainerError || !trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or inactive' },
        { status: 404 }
      )
    }

    // Get all active assignments for this trainer with member details
    const { data: assignments, error: assignmentsError } = await supabaseService
      .from('trainer_member_assignments')
      .select(`
        *,
        member:members(
          id,
          user_id,
          username,
          email,
          contact,
          full_name,
          date_of_birth,
          gender,
          height,
          weight,
          fitness_goals,
          experience_level,
          medical_conditions,
          emergency_contact,
          membership_type,
          join_date,
          last_workout,
          total_workouts,
          current_streak,
          longest_streak,
          total_calories_burned,
          created_at,
          updated_at
        )
      `)
      .eq('trainer_id', trainer.id)
      .eq('is_active', true)
      .order('assigned_date', { ascending: false })

    if (assignmentsError) {
      console.error('Error fetching trainer assignments:', assignmentsError)
      return NextResponse.json(
        { error: 'Failed to fetch assigned members' },
        { status: 500 }
      )
    }

    // Extract member data from assignments
    const members = assignments?.map(assignment => ({
      ...assignment.member,
      assignment_id: assignment.id,
      assigned_date: assignment.assigned_date,
      assignment_notes: assignment.notes
    })) || []

    return NextResponse.json({ 
      trainer: {
        id: trainer.id,
        name: trainer.full_name,
        email: trainer.email
      },
      members,
      total_members: members.length
    })
  } catch (error) {
    console.error('Error in GET /api/trainer-members/my-members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
