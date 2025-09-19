import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: order, error } = await supabase
      .from('product_orders')
      .select(`
        *,
        digital_products (
          title,
          description,
          file_name,
          download_password
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in order API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
