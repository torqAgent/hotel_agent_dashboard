'use client'
import { useEffect, useState } from 'react'
import type { Metrics } from '@/types'

export function useCallMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  useEffect(() => {
    const es = new EventSource('/api/metrics')
    es.onmessage = e => setMetrics(JSON.parse(e.data))
    return () => es.close()
  }, [])
  return metrics
}
