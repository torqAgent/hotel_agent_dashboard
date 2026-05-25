'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { TranscriptDrawer } from './TranscriptDrawer'
import type { Call, CallStatus } from '@/types'
import { fmtTime, fmtDate, dur } from '@/lib/formatters'

const FILTERS: { label: string; value: CallStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Missed', value: 'missed' },
]

export function CallTable({ calls }: { calls: Call[] }) {
  const [filter, setFilter] = useState<CallStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = filter === 'all' ? calls : calls.filter(c => c.status === filter)

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === f.value
                ? 'border-gold-dim text-gold-dim bg-gold-bg'
                : 'border-dark-border text-gray-400 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600 self-center">{filtered.length} calls</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dark-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-xs text-gray-500 uppercase tracking-wider">
              {['Time','Guest','Phone','Intent','Duration','Status',''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}
                className={`border-b border-dark-border hover:bg-dark-surface transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-dark-card'}`}
                onClick={() => setSelectedId(c.id)}>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  <div>{fmtDate(c.startedAt)}</div>
                  <div className="text-xs text-gray-600">{fmtTime(c.startedAt)}</div>
                </td>
                <td className="px-4 py-3 text-white">{c.guestName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400">{c.guestPhone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400 capitalize">{c.intent ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400">{dur(c.durationSec ?? null)}</td>
                <td className="px-4 py-3"><Badge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-gold-dim hover:underline">Transcript</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">No calls found</div>
        )}
      </div>

      <TranscriptDrawer callId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}
