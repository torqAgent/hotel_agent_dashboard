import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { rooms } from '@/server/db/schema'
import { ilike, or } from 'drizzle-orm'

function getDb() {
  const client = neon(process.env.DB_URL!)
  return drizzle(client)
}

export async function GET() {
  try {
    const db = getDb()
    const databaseRooms = await db.select().from(rooms)

    const deluxeRoom = databaseRooms.find(r => r.roomType && /delux/i.test(r.roomType))
    const standardRoom = databaseRooms.find(r => r.roomType && /standard/i.test(r.roomType))

    const activeSettings = {
      hotelName: process.env.NEXT_PUBLIC_HOTEL_NAME || 'The Grand Heritage, Mysuru',
      agentName: process.env.NEXT_PUBLIC_AGENT_NAME || 'Aria',
      greeting: process.env.NEXT_PUBLIC_GREETING || 'Thank you for calling The Grand Heritage. How may I assist you?',
      tone: process.env.NEXT_PUBLIC_TONE || 'Formal',
      sipTrunk: process.env.NEXT_PUBLIC_SIP_TRUNK || '+91 821 000 0000',
      livekitRoom: process.env.NEXT_PUBLIC_LIVEKIT_ROOM || 'hotel-reception',
      managerSip: process.env.NEXT_PUBLIC_MANAGER_SIP || 'sip:manager@yourdomain.com',
      pmsProvider: process.env.NEXT_PUBLIC_PMS_PROVIDER || 'Google Calendar',
      deluxPrice: deluxeRoom?.roomPrice ? String(deluxeRoom.roomPrice) : '5000',
      standardPrice: standardRoom?.roomPrice ? String(standardRoom.roomPrice) : '2500',
    }

    return NextResponse.json(activeSettings)
  } catch (error) {
    console.error('Settings GET Error:', error)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb()
    const body = await req.json()
    
    // Convert strings from UI to integers for the DB
    const dPrice = parseInt(body.deluxPrice, 10) || 0
    const sPrice = parseInt(body.standardPrice, 10) || 0

    await Promise.all([
      db.update(rooms)
        .set({ roomPrice: dPrice }) // Ensure this matches schema property name exactly
        .where(or(ilike(rooms.roomType, 'delux'), ilike(rooms.roomType, 'deluxe'))),
      db.update(rooms)
        .set({ roomPrice: sPrice }) // Ensure this matches schema property name exactly
        .where(ilike(rooms.roomType, 'standard'))
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings POST Error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}