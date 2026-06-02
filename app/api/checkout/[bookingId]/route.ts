import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { rooms, booking } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const db = drizzle(neon(process.env.DB_URL!))

  const { bookingId } = await params
  const id = parseInt(bookingId)

  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid booking ID' },
      { status: 400 }
    )
  }

  const theBooking = await db
    .select()
    .from(booking)
    .where(eq(booking.bookingId, id))
    .then(r => r[0])

  if (!theBooking) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    )
  }

  // Free the room
  if (theBooking.roomNo) {
    await db
      .update(rooms)
      .set({ availability: true })
      .where(eq(rooms.roomNo, theBooking.roomNo))
  }

  // Mark booking as checked out
  await db
    .update(booking)
    .set({ status: 'checked_out' })
    .where(eq(booking.bookingId, id))

  return NextResponse.json({
    success: true,
    bookingId: id,
  })
}