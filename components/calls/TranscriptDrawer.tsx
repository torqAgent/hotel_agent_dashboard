'use client'
import { useTranscript } from '@/hooks/useTranscript'
import { Badge } from '@/components/ui/Badge'
import { X } from 'lucide-react'
import { fmtTime, dur } from '@/lib/formatters'

export function TranscriptDrawer({ callId, onClose }: { callId: string | null; onClose: () => void }) {
  const { call, loading } = useTranscript(callId)
  if (!callId) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-dark-card border-l border-dark-border h-full overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-medium text-white">{call?.guestName ?? 'Call transcript'}</h2>
            {call && <div className="text-xs text-gray-500 mt-0.5">{fmtTime(call.startedAt)} · {dur(call.durationSec)}</div>}
          </div>
          <div className="flex items-center gap-2">
            {call && <Badge status={call.status} />}
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        {loading && <div className="text-xs text-gray-500 animate-pulse">Loading transcript…</div>}
        {call?.transcript ? (
          <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed bg-dark-surface rounded-lg p-4 text-xs font-mono">
            {call.transcript}
          </div>
        ) : !loading && (
          <div className="text-xs text-gray-600">No transcript available.</div>
        )}
        {call && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ['Guest', call.guestName ?? '—'],
              ['Phone', call.guestPhone ?? '—'],
              ['Intent', call.intent ?? '—'],
              ['Room ID', call.livekitRoomId ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="bg-dark-surface rounded-lg p-2.5">
                <div className="text-[10px] text-gray-600 mb-0.5">{k}</div>
                <div className="text-xs text-white truncate">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
