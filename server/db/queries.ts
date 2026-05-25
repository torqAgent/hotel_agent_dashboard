import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms } from './schema'
import { eq, desc, sql } from 'drizzle-orm'

function getDb() {
  const client = neon(process.env.DB_URL!)
  return drizzle(client)
}

export async function getMetrics() {
  const db = getDb()
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [allBookings, allRooms] = await Promise.all([
    db.select().from(booking).orderBy(desc(booking.bookingId)),
    db.select().from(rooms),
  ])

  const todayBookings = allBookings.filter(b => b.checkIn === today)
  const monthBookings = allBookings.filter(b => b.checkIn && b.checkIn >= monthStart)
  const availableRooms = allRooms.filter(r => r.availability)
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
    availableRooms: availableRooms.length,
    totalRooms: allRooms.length,
    revenueMtd: totalRevenueMtd,
    revenueAll: totalRevenueAll,
    bookingsThisWeek: dayBuckets,
    monthBookings: monthBookings.length,
  }
}

export async function getBookings() {
  const db = getDb()
  return db.select().from(booking).orderBy(desc(booking.bookingId))
}

export async function getRooms() {
  const db = getDb()
  return db.select().from(rooms)
}

export async function getBookingById(id: number) {
  const db = getDb()
  return db.select().from(booking).where(eq(booking.bookingId, id)).then(r => r[0])
}

export async function getRoomWithBookings() {
  const db = getDb()
  const [allRooms, allBookings] = await Promise.all([
    db.select().from(rooms),
    db.select().from(booking),
  ])
  return allRooms.map(r => ({
    ...r,
    bookings: allBookings.filter(b => b.roomNo === r.roomNo),
  }))
}
