import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { rooms, booking } from '@/server/db/schema'

const db = drizzle(neon(process.env.DB_URL!))

function isActive(checkIn: string, checkOut: string) {
  const today = new Date().toISOString().split('T')[0]
  return checkIn <= today && checkOut >= today
}

export async function GET() {
  const allRooms = await db.select().from(rooms)
  const allBookings = await db.select().from(booking)

  const result = allRooms.map(room => {
    const active = allBookings.find(
      b =>
        b.roomNo === room.roomNo &&
        b.checkIn &&
        b.checkOut &&
        isActive(b.checkIn, b.checkOut)
    )

    return {
      ...room,
      availability: !active,
      bookedBy: active?.name || null,
      bookedPhone: active?.no || null,
    }
  })

  return NextResponse.json(result)
}
