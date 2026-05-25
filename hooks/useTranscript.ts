'use client'
import { useEffect, useState } from 'react'
import type { Call } from '@/types'

export function useTranscript(callId: string | null) {
  const [call, setCall] = useState<Call | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!callId) { setCall(null); return }
    setLoading(true)
    fetch(`/api/transcripts/${callId}`)
      .then(r => r.json())
      .then(setCall)
      .finally(() => setLoading(false))
  }, [callId])
  return { call, loading }
}
