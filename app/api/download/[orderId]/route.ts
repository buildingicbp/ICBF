import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('product_orders')
      .select(`
        *,
        digital_products (
          file_path,
          file_name
        )
      `)
      .eq('id', params.orderId)
      .eq('order_status', 'completed')
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found or not completed' }, { status: 404 })
    }

    // Check download limits
    if (order.download_count >= order.max_downloads) {
      return NextResponse.json({ error: 'Download limit exceeded' }, { status: 403 })
    }

    // Check if order has expired
    const now = new Date()
    const expiresAt = new Date(order.expires_at)
    if (now > expiresAt) {
      return NextResponse.json({ error: 'Download link has expired' }, { status: 403 })
    }

    try {
      // Read the PDF file
      const safeRelPath = (order.digital_products.file_path || '').replace(/^[/\\]+/, '')
      const filePath = join(process.cwd(), 'public', safeRelPath)
      const fileBuffer = await readFile(filePath)

      // Update download count
      await supabase
        .from('product_orders')
        .update({ download_count: order.download_count + 1 })
        .eq('id', params.orderId)

      // Log the download
      await supabase
        .from('download_logs')
        .insert([{
          order_id: params.orderId,
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        }])

      // Return the file
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${order.digital_products.file_name}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('Error reading file:', fileError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error in download API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
