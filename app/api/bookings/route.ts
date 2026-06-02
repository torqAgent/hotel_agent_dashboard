import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from '@/server/db/schema'
import { eq, and, lte, gte, or } from 'drizzle-orm'

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

function price(roomType: string, nightsCount: number, deluxPrice: number, standardPrice: number) {
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
  try {
    const body = await req.json()

    const roomNo = Number(body.roomNo)
    const checkIn = body.checkIn
    const checkOut = body.checkOut

    if (!roomNo || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Fetch settings from database
    const deluxPrice =  5000
    const standardPrice = 2500

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
    const totalPrice = price(room.roomType ?? 'Standard', stay, deluxPrice, standardPrice)

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
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const bookingId = Number(body.bookingId)

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    // Get booking to find room number
    const bookingRecord = await db
      .select()
      .from(booking)
      .where(eq(booking.bookingId, bookingId))
      .then(r => r[0])

    if (!bookingRecord) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0]
    await db
  .update(booking)
  .set({
    status: 'checked_out', // Keep only the status change
  })
  .where(eq(booking.bookingId, bookingId));

// 2. Room availability logic remains the same to free the room
const activeBookingsForRoom = await db
  .select()
  .from(booking)
  .where(
    and(
      eq(booking.roomNo, bookingRecord.roomNo!),
      eq(booking.status, 'active')
    )
  );

if (activeBookingsForRoom.length === 0) {
  await db
    .update(rooms)
    .set({ availability: true })
    .where(eq(rooms.roomNo, bookingRecord.roomNo!));
}
    // Mark booking as checked_out
    
    // If no other active bookings, mark room as available
    

    return NextResponse.json({ success: true, booking: bookingRecord })
  } catch (error) {
    console.error('DELETE /api/bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to checkout booking' },
      { status: 500 }
    )
  }
}
