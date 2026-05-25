'use client'
import { useEffect, useState } from 'react'

export interface LiveKitRoom {
  name: string
  participants: number
  participantNames: string[]
  durationSec: number
}

export interface LiveKitStats {
  activeCalls: number
  totalParticipants: number
  totalRoomsActive: number
  rooms: LiveKitRoom[]
  fetchedAt: number
  error?: string
}

export function useLiveKitStats() {
  const [stats, setStats] = useState<LiveKitStats | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const es = new EventSource('/api/livekit-stream')
    es.onopen = () => setConnected(true)
    es.onmessage = e => {
      const data = JSON.parse(e.data) as LiveKitStats
      setStats(data)
    }
    es.onerror = () => setConnected(false)
    return () => es.close()
  }, [])

  return { stats, connected }
}
