'use client'
import { useEffect, useState, useRef } from 'react'
import { Room, RoomEvent } from 'livekit-client'

export function useLiveKitRoom(room: string) {
  const [connected, setConnected] = useState(false)
  const [activeCall, setActiveCall] = useState(false)
  const roomRef = useRef<Room | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/livekit-token?room=${room}`)
      .then(r => r.json())
      .then(async ({ token }) => {
        if (cancelled) return
        const r = new Room()
        roomRef.current = r
        r.on(RoomEvent.ParticipantConnected, () => setActiveCall(true))
        r.on(RoomEvent.ParticipantDisconnected, () => setActiveCall(r.remoteParticipants.size > 0))
        r.on(RoomEvent.Disconnected, () => setConnected(false))
        await r.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token)
        setConnected(true)
        setActiveCall(r.remoteParticipants.size > 0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      roomRef.current?.disconnect()
    }
  }, [room])

  return { connected, activeCall }
}
