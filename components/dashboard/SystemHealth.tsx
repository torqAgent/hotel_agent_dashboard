import type { Metrics } from '@/types'

export function SystemHealth({ m }: { m: Metrics }) {
  const occupancy = m.totalRooms ? m.totalRooms - m.availableRooms : 0
  const pct = m.totalRooms ? Math.round(occupancy / m.totalRooms * 100) : 0

  const systemStatus = [
    ['Agent uptime', '99.97%', true],
    ['SIP status', 'Connected', true],
    ['PMS sync', 'Live', true],
    ['Neon DB', 'Connected', true],
    ['Avg latency', '1.4s', true],
  ] as const

  return (
    <div role="region" aria-label="System health status">
      <div className="divide-y divide-dark-border">
        {systemStatus.map(([label, value, ok]) => (
          <div
            key={label}
            className="flex items-center justify-between py-1.5"
            role="status"
            aria-label={`${label}: ${value}`}
          >
            <span className="text-xs text-gray-400">{label}</span>
            <span
              className={`text-xs font-medium ${ok ? 'text-emerald-400' : 'text-red-400'}`}
              role="img"
              aria-label={ok ? 'Online' : 'Offline'}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Room occupancy</span>
          <span role="status" aria-label={`${occupancy} out of ${m.totalRooms} rooms occupied`}>
            {occupancy} / {m.totalRooms} rooms
          </span>
        </div>
        <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-gold'
            }`}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Occupancy: ${pct}%`}
          />
        </div>
        <div className="text-[10px] text-gray-600 mt-1">{pct}% occupied</div>
      </div>
    </div>
  )
}
