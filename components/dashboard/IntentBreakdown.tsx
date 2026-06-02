import type { Room } from '@/types'

export function RoomStatusBreakdown({ rooms }: { rooms: Room[] }) {
  const byType = rooms.reduce((acc, r) => {
    const t = r.roomType ?? 'Unknown'
    if (!acc[t]) acc[t] = { total: 0, available: 0 }
    acc[t].total++
    if (r.availability) acc[t].available++
    return acc
  }, {} as Record<string, { total: number; available: number }>)

  const entries = Object.entries(byType)
  const max = Math.max(...entries.map(([, v]) => v.total), 1)

  return (
    <div className="flex flex-col gap-3" role="region" aria-label="Room availability by type">
      {entries.map(([type, { total, available }]) => (
        <div key={type}>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>{type}</span>
            <span
              style={{ color: 'var(--text-tertiary)' }}
              role="status"
              aria-label={`${available} available of ${total} total`}
            >
              {available} avail / {total} total
            </span>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${(total / max) * 100}%`,
                backgroundColor: 'var(--gold-primary)'
              }}
              role="progressbar"
              aria-valuenow={total}
              aria-valuemax={max}
              aria-label={`Total: ${total}`}
            />
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden mt-0.5"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${(available / max) * 100}%`,
                backgroundColor: '#10b981'
              }}
              role="progressbar"
              aria-valuenow={available}
              aria-valuemax={max}
              aria-label={`Available: ${available}`}
            />
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-xs text-gray-600 text-center py-4" role="status">
          No room data
        </div>
      )}
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-gold" aria-hidden="true" />
          <span className="text-[11px] text-gray-500">Total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-600" aria-hidden="true" />
          <span className="text-[11px] text-gray-500">Available</span>
        </div>
      </div>
    </div>
  )
}
