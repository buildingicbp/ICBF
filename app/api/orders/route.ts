import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { product_id, customer_name, customer_email } = body

    // Validate required fields
    if (!product_id || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Verify product exists and is active
    const { data: product, error: productError } = await supabase
      .from('digital_products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' }, 
        { status: 404 }
      )
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('product_orders')
      .insert([{
        product_id,
        customer_name,
        customer_email,
        order_status: 'completed' // Since no payment gateway, mark as completed
      }])
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' }, 
        { status: 400 }
      )
    }

    const { data: orders, error } = await supabase
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
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error in orders GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
