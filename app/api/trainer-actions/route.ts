import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch trainer actions for a specific member or all actions by trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainerEmail = searchParams.get('trainer_email')
    const memberId = searchParams.get('member_id')
    const actionDate = searchParams.get('action_date')

    if (!trainerEmail) {
      return NextResponse.json(
        { error: 'trainer_email is required' },
        { status: 400 }
      )
    }

    // Get trainer ID from email
    const { data: trainer, error: trainerError } = await supabaseService
      .from('trainer_accounts')
      .select('id')
      .eq('email', trainerEmail)
      .eq('is_active', true)
      .single()

    if (trainerError || !trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or inactive' },
        { status: 404 }
      )
    }

    // Build query
    let query = supabaseService
      .from('trainer_actions')
      .select(`
        *,
        member:members(
          id,
          full_name,
          username,
          email
        )
      `)
      .eq('trainer_id', trainer.id)
      .order('created_at', { ascending: false })

    // Filter by member if specified
    if (memberId) {
      query = query.eq('member_id', memberId)
    }

    // Filter by date if specified
    if (actionDate) {
      query = query.eq('action_date', actionDate)
    }

    const { data: actions, error: actionsError } = await query

    if (actionsError) {
      console.error('Error fetching trainer actions:', actionsError)
      return NextResponse.json(
        { error: 'Failed to fetch trainer actions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      actions: actions || [],
      total: actions?.length || 0
    })
  } catch (error) {
    console.error('Error in GET /api/trainer-actions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new trainer action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      trainer_email, 
      member_id, 
      action_type, 
      title, 
      description, 
      priority = 'medium',
      is_visible_to_member = true,
      action_date 
    } = body

    // Validate required fields
    if (!trainer_email || !member_id || !title || !description) {
      return NextResponse.json(
        { error: 'trainer_email, member_id, title, and description are required' },
        { status: 400 }
      )
    }

    // Get trainer ID from email
    const { data: trainer, error: trainerError } = await supabaseService
      .from('trainer_accounts')
      .select('id')
      .eq('email', trainer_email)
      .eq('is_active', true)
      .single()

    if (trainerError || !trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or inactive' },
        { status: 404 }
      )
    }

    // Verify trainer is assigned to this member
    const { data: assignment, error: assignmentError } = await supabaseService
      .from('trainer_member_assignments')
      .select('id')
      .eq('trainer_id', trainer.id)
      .eq('member_id', member_id)
      .eq('is_active', true)
      .single()

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Trainer is not assigned to this member' },
        { status: 403 }
      )
    }

    // Create the action
    const { data: action, error: actionError } = await supabaseService
      .from('trainer_actions')
      .insert({
        trainer_id: trainer.id,
        member_id,
        action_type: action_type || 'other',
        title,
        description,
        priority,
        is_visible_to_member,
        action_date: action_date || new Date().toISOString().split('T')[0]
      })
      .select(`
        *,
        member:members(
          id,
          full_name,
          username,
          email
        )
      `)
      .single()

    if (actionError) {
      console.error('Error creating trainer action:', actionError)
      return NextResponse.json(
        { error: 'Failed to create trainer action' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      action,
      message: 'Trainer action created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/trainer-actions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
