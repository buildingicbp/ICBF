import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase'

// GET - Fetch actions for a specific member by email (used by member dashboard)
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const memberEmail = searchParams.get('email')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10

    if (!memberEmail) {
      return NextResponse.json(
        { error: 'Member email is required' },
        { status: 400 }
      )
    }

    // First get the member ID from email
    const { data: member, error: memberError } = await supabaseService
      .from('members')
      .select('id')
      .eq('email', memberEmail)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Fetch actions for this member that are visible to them
    const { data: actions, error: actionsError } = await supabaseService
      .from('trainer_actions')
      .select(`
        *,
        trainer:trainer_accounts(
          id,
          full_name,
          email
        )
      `)
      .eq('member_id', member.id)
      .eq('is_visible_to_member', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (actionsError) {
      console.error('Error fetching member actions:', actionsError)
      return NextResponse.json(
        { error: 'Failed to fetch actions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      actions: actions || [],
      total: actions?.length || 0
    })
  } catch (error) {
    console.error('Error in GET /api/trainer-actions/member/[memberId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
