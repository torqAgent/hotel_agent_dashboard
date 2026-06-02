import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params

  const db = drizzle(neon(process.env.DB_URL!))

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

  if (existing.roomNo !== null && existing.roomNo !== undefined) {
    await db
      .update(rooms)
      .set({ availability: true })
      .where(eq(rooms.roomNo, existing.roomNo))
  }

  await db
    .delete(booking)
    .where(eq(booking.bookingId, Number(bookingId)))

  return NextResponse.json({ success: true })
}