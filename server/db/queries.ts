import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { booking, rooms, settings } from './schema'
import { eq, desc, sql, and } from 'drizzle-orm'

function getDb() {
  const client = neon(process.env.DB_URL!)
  return drizzle(client)
}

/**
 * Check if two date ranges overlap
 */
function isDateRangeOverlap(
  start1: string | null,
  end1: string | null,
  start2: string | null,
  end2: string | null
): boolean {
  if (!start1 || !end1 || !start2 || !end2) return false
  return new Date(start1) <= new Date(end2) && new Date(start2) <= new Date(end1)
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get month start date in YYYY-MM-DD format
 */
function getMonthStartDate(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
}

export async function getMetrics() {
  try {
    const db = getDb()
    const today = getTodayDate()
    const monthStart = getMonthStartDate()

    const [allBookings, allRooms] = await Promise.all([
      db.select().from(booking).orderBy(desc(booking.bookingId)),
      db.select().from(rooms),
    ])

    // Filter only ACTIVE bookings with valid data
    const activeBookings = allBookings.filter(
      b => b.checkIn && b.checkOut && b.roomNo && b.name && b.status === 'active'
    )
    
    // Filter bookings for today (check-in today)
    const todayBookings = activeBookings.filter(b => b.checkIn === today)

    // Filter bookings for this month
    const monthBookings = activeBookings.filter(b => b.checkIn && b.checkIn >= monthStart)

    // Find currently occupied rooms (active bookings overlapping today)
    const occupiedRooms = activeBookings.filter(b =>
      isDateRangeOverlap(b.checkIn, b.checkOut, today, today)
    ).length

    // Find available rooms
    const availableRooms = allRooms.filter(r => {
      const hasOverlappingBooking = activeBookings.some(b =>
        b.roomNo === r.roomNo &&
        isDateRangeOverlap(b.checkIn, b.checkOut, today, today)
      )
      return !hasOverlappingBooking
    })

    // Calculate revenue
    const totalRevenueMtd = monthBookings.reduce((acc, b) => acc + (b.totalPrice ?? 0), 0)
    const totalRevenueAll = activeBookings.reduce((acc, b) => acc + (b.totalPrice ?? 0), 0)

    // Calculate bookings per day for last 7 days
    const dayBuckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 6 + i)
      const dateStr = d.toISOString().split('T')[0]
      return activeBookings.filter(b => b.checkIn === dateStr).length
    })

    console.log(`[Metrics] Active bookings: ${activeBookings.length}, Occupied rooms: ${occupiedRooms}`)

    return {
      totalBookings: activeBookings.length,
      todayBookings: todayBookings.length,
      occupiedRooms: occupiedRooms,
      availableRooms: availableRooms.length,
      totalRooms: allRooms.length,
      revenueMtd: totalRevenueMtd,
      revenueAll: totalRevenueAll,
      bookingsThisWeek: dayBuckets,
      monthBookings: monthBookings.length,
    }
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return {
      totalBookings: 0,
      todayBookings: 0,
      occupiedRooms: 0,
      availableRooms: 0,
      totalRooms: 0,
      revenueMtd: 0,
      revenueAll: 0,
      bookingsThisWeek: [0, 0, 0, 0, 0, 0, 0],
      monthBookings: 0,
    }
  }
}

export async function getBookings() {
  try {
    const db = getDb()
    // Only return active bookings that have valid dates
    const allBookings = await db.select().from(booking).orderBy(desc(booking.bookingId))
    
    // Filter out invalid bookings with null dates
    return allBookings.filter(b => b.checkIn && b.checkOut)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function getRooms() {
  try {
    const db = getDb()
    const today = getTodayDate()
    
    // Fetch all rooms
    let allRooms = await db.select().from(rooms)
    
    // If rooms table is empty, create default rooms
    if (allRooms.length === 0) {
      const defaultRooms = [
        { roomNo: 101, roomType: 'Delux', availability: true },
        { roomNo: 102, roomType: 'Delux', availability: true },
        { roomNo: 103, roomType: 'Delux', availability: true },
        { roomNo: 104, roomType: 'Standard', availability: true },
        { roomNo: 105, roomType: 'Standard', availability: true },
        { roomNo: 106, roomType: 'Standard', availability: true },
        { roomNo: 107, roomType: 'Standard', availability: true },
        { roomNo: 108, roomType: 'Delux', availability: true },
        { roomNo: 109, roomType: 'Standard', availability: true },
        { roomNo: 110, roomType: 'Delux', availability: true },
      ]
      
      // Insert default rooms
      for (const room of defaultRooms) {
        await db.insert(rooms).values(room).catch(() => {}) // Ignore if already exists
      }
      
      allRooms = defaultRooms
    }
    
    // Fetch all bookings for availability calculation
    const allBookings = await db.select().from(booking)
    
    // Only use VALID bookings for availability calculation
    const validBookings = allBookings.filter(b => b.checkIn && b.checkOut && b.roomNo)

    // Map rooms with accurate availability based on overlapping VALID bookings
    return allRooms.map(r => {
      const hasOverlappingBooking = validBookings.some(b =>
        b.roomNo === r.roomNo &&
        isDateRangeOverlap(b.checkIn, b.checkOut, today, today)
      )
      return {
        ...r,
        availability: !hasOverlappingBooking,
      }
    })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    // Return default rooms on error
    return [
      { roomNo: 101, roomType: 'Delux', availability: true },
      { roomNo: 102, roomType: 'Delux', availability: true },
      { roomNo: 103, roomType: 'Delux', availability: true },
      { roomNo: 104, roomType: 'Standard', availability: true },
      { roomNo: 105, roomType: 'Standard', availability: true },
      { roomNo: 106, roomType: 'Standard', availability: true },
      { roomNo: 107, roomType: 'Standard', availability: true },
      { roomNo: 108, roomType: 'Delux', availability: true },
      { roomNo: 109, roomType: 'Standard', availability: true },
      { roomNo: 110, roomType: 'Delux', availability: true },
    ]
  }
}

export async function getBookingById(id: number) {
  try {
    const db = getDb()
    return db.select().from(booking).where(eq(booking.bookingId, id)).then(r => r[0] || null)
  } catch (error) {
    console.error('Error fetching booking by id:', error)
    return null
  }
}

export async function getRoomWithBookings() {
  try {
    const db = getDb()
    const [allRooms, allBookings] = await Promise.all([
      db.select().from(rooms),
      db.select().from(booking),
    ])
    return allRooms.map(r => {
      const roomBookings = allBookings.filter(b => b.roomNo === r.roomNo)
      return {
        ...r,
        bookings: roomBookings,
        // bookedBy is for display purposes - guest name of current/latest booking if any
        bookedBy: roomBookings.length > 0 ? roomBookings[0].name : null,
      }
    })
  } catch (error) {
    console.error('Error fetching rooms with bookings:', error)
    return []
  }
}

/**
 * Get settings from database
 */
export async function getSettings() {
  try {
    const db = getDb()
    let result = await db.select().from(settings).limit(1)
    
    // If no settings exist, create default ones
    if (result.length === 0) {
      const defaultSettings = {
        hotelName: 'The Grand Heritage, Mysuru',
        agentName: 'Aria',
        greeting: 'Thank you for calling The Grand Heritage. How may I assist you?',
        tone: 'Formal',
        sipTrunk: '+91 821 000 0000',
        livekitRoom: 'hotel-reception',
        managerSip: 'sip:manager@yourdomain.com',
        pmsProvider: 'Google Calendar',
        deluxPrice: '5000',
        standardPrice: '2500',
      }
      
      await db.insert(settings).values(defaultSettings).catch(() => {}) // Ignore if already exists
      result = [defaultSettings]
    }
    
    if (result.length > 0) {
      const s = result[0]
      return {
        hotelName: s.hotelName || 'The Grand Heritage, Mysuru',
        agentName: s.agentName || 'Aria',
        greeting: s.greeting || 'Thank you for calling The Grand Heritage. How may I assist you?',
        tone: s.tone || 'Formal',
        sipTrunk: s.sipTrunk || '+91 821 000 0000',
        livekitRoom: s.livekitRoom || 'hotel-reception',
        managerSip: s.managerSip || 'sip:manager@yourdomain.com',
        pmsProvider: s.pmsProvider || 'Google Calendar',
        deluxPrice: s.deluxPrice || '5000',
        standardPrice: s.standardPrice || '2500',
      }
    }

    // Return defaults if no settings found
    return {
      hotelName: 'The Grand Heritage, Mysuru',
      agentName: 'Aria',
      greeting: 'Thank you for calling The Grand Heritage. How may I assist you?',
      tone: 'Formal',
      sipTrunk: '+91 821 000 0000',
      livekitRoom: 'hotel-reception',
      managerSip: 'sip:manager@yourdomain.com',
      pmsProvider: 'Google Calendar',
      deluxPrice: '5000',
      standardPrice: '2500',
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {
      hotelName: 'The Grand Heritage, Mysuru',
      agentName: 'Aria',
      greeting: 'Thank you for calling The Grand Heritage. How may I assist you?',
      tone: 'Formal',
      sipTrunk: '+91 821 000 0000',
      livekitRoom: 'hotel-reception',
      managerSip: 'sip:manager@yourdomain.com',
      pmsProvider: 'Google Calendar',
      deluxPrice: '5000',
      standardPrice: '2500',
    }
  }
}

/**
 * Update settings in database
 */
export async function updateSettings(newSettings: any) {
  try {
    const db = getDb()
    
    // Try to update existing record
    const existing = await db.select().from(settings).limit(1)
    
    if (existing.length > 0) {
      // Update existing
      await db
        .update(settings)
        .set({
          hotelName: newSettings.hotelName,
          agentName: newSettings.agentName,
          greeting: newSettings.greeting,
          tone: newSettings.tone,
          sipTrunk: newSettings.sipTrunk,
          livekitRoom: newSettings.livekitRoom,
          managerSip: newSettings.managerSip,
          pmsProvider: newSettings.pmsProvider,
          deluxPrice: newSettings.deluxPrice,
          standardPrice: newSettings.standardPrice,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing[0].id))
    } else {
      // Insert new
      await db.insert(settings).values({
        hotelName: newSettings.hotelName,
        agentName: newSettings.agentName,
        greeting: newSettings.greeting,
        tone: newSettings.tone,
        sipTrunk: newSettings.sipTrunk,
        livekitRoom: newSettings.livekitRoom,
        managerSip: newSettings.managerSip,
        pmsProvider: newSettings.pmsProvider,
        deluxPrice: newSettings.deluxPrice,
        standardPrice: newSettings.standardPrice,
      })
    }

    return newSettings
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}

/**
 * Checkout a booking - marks it as checked_out and frees the room
 */
export async function checkoutBooking(bookingId: number) {
  try {
    const db = getDb()
    
    // Get booking details
    const bookingRecord = await db
      .select()
      .from(booking)
      .where(eq(booking.bookingId, bookingId))
      .then(r => r[0])
    
    if (!bookingRecord) {
      throw new Error('Booking not found')
    }

    const today = getTodayDate()

    // Mark booking as checked_out
    await db
      .update(booking)
      .set({
        status: 'checked_out',
        actualCheckout: today,
      })
      .where(eq(booking.bookingId, bookingId))

    // Free the room - check if there are other active bookings
    const activeBookingsForRoom = await db
      .select()
      .from(booking)
      .where(
        and(
          eq(booking.roomNo, bookingRecord.roomNo!),
          eq(booking.status, 'active')
        )
      )

    // If no other active bookings, mark room as available
    if (activeBookingsForRoom.length === 0) {
      await db
        .update(rooms)
        .set({ availability: true })
        .where(eq(rooms.roomNo, bookingRecord.roomNo!))
    }

    return { success: true, booking: bookingRecord }
  } catch (error) {
    console.error('Error checking out booking:', error)
    throw error
  }
}

/**
 * Get all bookings for a room
 */
export async function getBookingsByRoom(roomNo: number) {
  try {
    const db = getDb()
    return await db
      .select()
      .from(booking)
      .where(eq(booking.roomNo, roomNo))
  } catch (error) {
    console.error('Error fetching bookings for room:', error)
    return []
  }
}

/**
 * Get active bookings only
 */
export async function getActiveBookings() {
  try {
    const db = getDb()
    return await db
      .select()
      .from(booking)
      .where(eq(booking.status, 'active'))
      .orderBy(desc(booking.bookingId))
  } catch (error) {
    console.error('Error fetching active bookings:', error)
    return []
  }
}

