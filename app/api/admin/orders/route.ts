import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/orders'

// Simple admin authentication
function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader) {
    return false
  }

  const password = authHeader.replace('Bearer ', '')
  return password === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  // Check admin authentication
  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    )
  }
}

