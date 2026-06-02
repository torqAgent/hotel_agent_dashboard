import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  _: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params
  const db = drizzle(neon(process.env.DB_URL!))

  try {
    // 1. Find the booking
    const existing = await db
      .select()
      .from(booking)
      .where(eq(booking.bookingId, Number(bookingId)))
      .then(r => r[0])

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // 2. Update Room Availability
    if (existing.roomNo) {
      await db.update(rooms)
        .set({ availability: true })
        .where(eq(rooms.roomNo, existing.roomNo))
    }

    // 3. Update Booking Status to 'checked_out'
    await db.update(booking)
      .set({ status: 'checked_out' })
      .where(eq(booking.bookingId, Number(bookingId)))

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}