import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch all trainer-member assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainerId = searchParams.get('trainer_id')
    const memberId = searchParams.get('member_id')
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabaseService
      .from('trainer_member_assignments')
      .select(`
        *,
        trainer:trainer_accounts(id, email, full_name, is_active),
        member:members(id, email, full_name, username, contact, membership_type)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (trainerId) {
      query = query.eq('trainer_id', trainerId)
    }
    
    if (memberId) {
      query = query.eq('member_id', memberId)
    }
    
    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assignments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch assignments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ assignments: data || [] })
  } catch (error) {
    console.error('Error in GET /api/trainer-member-assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new trainer-member assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trainer_id, member_id, notes } = body

    if (!trainer_id || !member_id) {
      return NextResponse.json(
        { error: 'trainer_id and member_id are required' },
        { status: 400 }
      )
    }

    // Check if trainer exists and is active
    const { data: trainer, error: trainerError } = await supabaseService
      .from('trainer_accounts')
      .select('id, full_name, is_active')
      .eq('id', trainer_id)
      .eq('is_active', true)
      .single()

    if (trainerError || !trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or inactive' },
        { status: 404 }
      )
    }

    // Check if member exists
    const { data: member, error: memberError } = await supabaseService
      .from('members')
      .select('id, full_name, email')
      .eq('id', member_id)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Create the assignment (the trigger will handle deactivating existing assignments)
    const { data: assignment, error: assignmentError } = await supabaseService
      .from('trainer_member_assignments')
      .insert({
        trainer_id,
        member_id,
        notes,
        is_active: true
      })
      .select(`
        *,
        trainer:trainer_accounts(id, email, full_name, is_active),
        member:members(id, email, full_name, username, contact, membership_type)
      `)
      .single()

    if (assignmentError) {
      console.error('Error creating assignment:', assignmentError)
      return NextResponse.json(
        { error: 'Failed to create assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      assignment,
      message: `Successfully assigned ${trainer.full_name} to ${member.full_name || member.email}`
    })
  } catch (error) {
    console.error('Error in POST /api/trainer-member-assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update assignment (e.g., deactivate, add notes)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignment_id, is_active, notes } = body

    if (!assignment_id) {
      return NextResponse.json(
        { error: 'assignment_id is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (typeof is_active === 'boolean') {
      updateData.is_active = is_active
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data: assignment, error } = await supabaseService
      .from('trainer_member_assignments')
      .update(updateData)
      .eq('id', assignment_id)
      .select(`
        *,
        trainer:trainer_accounts(id, email, full_name, is_active),
        member:members(id, email, full_name, username, contact, membership_type)
      `)
      .single()

    if (error) {
      console.error('Error updating assignment:', error)
      return NextResponse.json(
        { error: 'Failed to update assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      assignment,
      message: 'Assignment updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/trainer-member-assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove assignment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('assignment_id')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'assignment_id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseService
      .from('trainer_member_assignments')
      .delete()
      .eq('id', assignmentId)

    if (error) {
      console.error('Error deleting assignment:', error)
      return NextResponse.json(
        { error: 'Failed to delete assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Assignment deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/trainer-member-assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
