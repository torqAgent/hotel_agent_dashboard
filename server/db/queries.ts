import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from './schema'
import { eq, desc, and } from 'drizzle-orm'

function getDb() {
  const client = neon(process.env.DB_URL!)
  return drizzle(client)
}

export async function getMetrics() {
  const db = getDb()
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  try {
    const [allBookings, allRooms] = await Promise.all([
      db.select().from(booking).orderBy(desc(booking.bookingId)),
      db.select().from(rooms),
    ])

    const todayBookings = allBookings.filter(b => b.checkIn === today)
    const monthBookings = allBookings.filter(b => b.checkIn && b.checkIn >= monthStart)
    
    // FIX: Trust the 'availability' column from the rooms table directly!
    const availableCount = allRooms.filter(r => r.availability === true).length
    const occupiedCount = allRooms.length - availableCount

    const totalRevenueMtd = monthBookings.reduce((a, b) => a + (b.totalPrice ?? 0), 0)
    const totalRevenueAll = allBookings.reduce((a, b) => a + (b.totalPrice ?? 0), 0)

    const dayBuckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 6 + i)
      const ds = d.toISOString().split('T')[0]
      return allBookings.filter(b => b.checkIn === ds).length
    })

    return {
      totalBookings: allBookings.length,
      todayBookings: todayBookings.length,
      availableRooms: availableCount,
      occupiedRooms: occupiedCount, 
      totalRooms: allRooms.length,
      revenueMtd: totalRevenueMtd,
      revenueAll: totalRevenueAll,
      bookingsThisWeek: dayBuckets,
      monthBookings: monthBookings.length,
    }
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
    throw error
  }
}

export async function getBookings() {
  const db = getDb()
  return db.select().from(booking).orderBy(desc(booking.bookingId))
}

export async function getRooms() {
  const db = getDb()
  const [allRooms, activeBookings] = await Promise.all([
    db.select().from(rooms),
    db.select().from(booking).where(eq(booking.status, 'active'))
  ])
  
  return allRooms.map(r => {
    const currentBooking = activeBookings.find(b => b.roomNo === r.roomNo)
    return {
      ...r,
      // FIX: Use the 'availability' column from the database
      availability: r.availability === true, 
      bookedBy: currentBooking ? currentBooking.name : null,
    }
  })
}

export async function getBookingById(id: number) {
  const db = getDb()
  return db.select().from(booking).where(eq(booking.bookingId, id)).then(r => r[0])
}

export async function getRoomWithBookings() {
  const db = getDb()
  try {
    const [allRooms, allBookings] = await Promise.all([
      db.select().from(rooms),
      db.select().from(booking),
    ]) // Ensure there is NO '{' here

    return allRooms.map(r => {
      const roomBookings = allBookings.filter(b => b.roomNo === r.roomNo)
      const currentBooking = roomBookings.find(b => b.status === 'active')

      return {
  ...r,
  availability: r.availability === true,
  bookings: roomBookings,
  bookedBy: currentBooking ? currentBooking.name : null,
    }
    })
  } catch (error) {
    console.error("Database fetch error:", error)
    throw error
  }
}