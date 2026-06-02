import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

// Match the PATCH method that CheckoutButton.tsx calls verbatim
export async function PATCH(
  _: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params

  const db = drizzle(neon(process.env.DB_URL!))

  // 1. Fetch the targeted booking record
  const existing = await db
    .select()
    .from(booking)
    .where(eq(booking.bookingId, Number(bookingId)))
    .then(r => r[0])

  if (!existing) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    )
  }

  // 2. Clear the room block by setting availability back to true
  if (existing.roomNo !== null && existing.roomNo !== undefined) {
    await db
      .update(rooms)
      .set({ availability: true })
      .where(eq(rooms.roomNo, existing.roomNo))
  }

  // 3. Mark the status as 'checked_out' so customer history stays preserved
  await db
    .update(booking)
    .set({ status: 'checked_out' })
    .where(eq(booking.bookingId, Number(bookingId)))

  return NextResponse.json({ success: true, message: "Successfully checked out." })
}