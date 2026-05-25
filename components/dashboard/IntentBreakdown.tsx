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
    <div className="flex flex-col gap-3">
      {entries.map(([type, { total, available }]) => (
        <div key={type}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{type}</span>
            <span className="text-gray-500">{available} avail / {total} total</span>
          </div>
          <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gold" style={{ width: `${(total / max) * 100}%` }} />
          </div>
          <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden mt-0.5">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${(available / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {entries.length === 0 && <div className="text-xs text-gray-600 text-center py-4">No room data</div>}
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-gold" /><span className="text-[11px] text-gray-500">Total</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-600" /><span className="text-[11px] text-gray-500">Available</span></div>
      </div>
    </div>
  )
}
