import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from '@/server/db/schema'
import { eq, and, lte, gte, or } from 'drizzle-orm'
import { settingsCache } from '@/app/api/settings/route'

const db = drizzle(neon(process.env.DB_URL!))

function nights(checkIn: string, checkOut: string) {
  return Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  )
}

function price(roomType: string, nightsCount: number) {
  const deluxPrice = parseInt(settingsCache.deluxPrice) || 5000
  const standardPrice = parseInt(settingsCache.standardPrice) || 2500
  const rate = roomType === 'Delux' ? deluxPrice : standardPrice
  return rate * nightsCount
}

function overlap(aIn: string, aOut: string, bIn: string, bOut: string) {
  return !(aOut <= bIn || aIn >= bOut)
}

export async function GET() {
  const data = await db
    .select()
    .from(booking)
    .where(eq(booking.status, 'active'))

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const roomNo = Number(body.roomNo)
  const checkIn = body.checkIn
  const checkOut = body.checkOut

  if (!roomNo || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.roomNo, roomNo))
    .then(r => r[0])

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  // 🔥 GET all bookings for this room
  const existingBookings = await db
    .select()
    .from(booking)
    .where(eq(booking.roomNo, roomNo))

  // 🔥 CHECK DATE CONFLICT
  const conflict = existingBookings.some(b =>
    overlap(b.checkIn!, b.checkOut!, checkIn, checkOut)
  )

  if (conflict) {
    return NextResponse.json(
      { error: 'Room already booked for selected dates' },
      { status: 409 }
    )
  }

  // Validate dates
  if (new Date(checkOut) <= new Date(checkIn)) {
    return NextResponse.json(
      { error: 'Check-out date must be after check-in date' },
      { status: 400 }
    )
  }

  const stay = nights(checkIn, checkOut)
  const totalPrice = price(room.roomType ?? 'Standard', stay)

  await db.insert(booking).values({
    name: body.name,
    no: body.no,
    roomNo,
    checkIn,
    checkOut,
    totalPrice,
  })

  // Mark room as unavailable after booking
  await db
    .update(rooms)
    .set({ availability: false })
    .where(eq(rooms.roomNo, roomNo))

  return NextResponse.json({ success: true })
}

