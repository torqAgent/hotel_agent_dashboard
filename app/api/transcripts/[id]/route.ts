import { NextRequest, NextResponse } from 'next/server'
import { getBookingById } from '@/server/db/queries'

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const call = await getBookingById(Number(id))

  if (!call) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(call)
}