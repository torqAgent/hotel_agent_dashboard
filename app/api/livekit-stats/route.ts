import { NextResponse } from 'next/server'
import { getRoomService } from '@/lib/livekit'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const svc = getRoomService()
    const rooms = await svc.listRooms()

    let activeCalls = 0
    let totalParticipants = 0
    const roomDetails: {
      name: string
      participants: number
      duration: number
      createdAt: number
    }[] = []

    for (const room of rooms) {
      const participants = await svc.listParticipants(room.name)
      const guestCount = participants.filter(p => !p.identity.startsWith('dashboard-')).length

      if (guestCount > 0) activeCalls++
      totalParticipants += guestCount

      roomDetails.push({
        name: room.name,
        participants: guestCount,
        duration: room.creationTime
          ? Math.floor((Date.now() / 1000) - Number(room.creationTime))
          : 0,
        createdAt: Number(room.creationTime ?? 0),
      })
    }

    return NextResponse.json({
      activeCalls,
      totalParticipants,
      totalRoomsActive: rooms.length,
      rooms: roomDetails,
      fetchedAt: Date.now(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'LiveKit error' }, { status: 500 })
  }
}
