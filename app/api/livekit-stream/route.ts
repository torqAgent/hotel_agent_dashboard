import { NextRequest } from 'next/server'
import { getRoomService } from '@/lib/livekit'

export const dynamic = 'force-dynamic'

async function fetchLiveKitStats() {
  const svc = getRoomService()
  const rooms = await svc.listRooms()

  let activeCalls = 0
  let totalParticipants = 0
  const roomDetails = []

  for (const room of rooms) {
    const participants = await svc.listParticipants(room.name)
    const guests = participants.filter(p => !p.identity.startsWith('dashboard-'))
    if (guests.length > 0) activeCalls++
    totalParticipants += guests.length
    roomDetails.push({
      name: room.name,
      participants: guests.length,
      participantNames: guests.map(p => p.identity),
      durationSec: room.creationTime
        ? Math.floor(Date.now() / 1000 - Number(room.creationTime))
        : 0,
    })
  }

  return { activeCalls, totalParticipants, totalRoomsActive: rooms.length, rooms: roomDetails, fetchedAt: Date.now() }
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  let isClosed = false
  
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = async () => {
        if (isClosed) return
        try {
          const data = await fetchLiveKitStats()
          ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch (e: any) {
          if (!isClosed) {
            ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e?.message })}\n\n`))
          }
        }
      }
      
      await send()
      const iv = setInterval(send, 5000)
      
      req.signal.addEventListener('abort', () => {
        isClosed = true
        clearInterval(iv)
        ctrl.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: { 
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
