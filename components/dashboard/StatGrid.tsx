import { StatCard } from '@/components/ui/StatCard'
import type { Metrics } from '@/types'
import { inr } from '@/lib/formatters'

export function StatGrid({ m }: { m: Metrics }) {
  const occupancyPct = m.totalRooms ? Math.round((m.occupiedRooms / m.totalRooms) * 100) : 0

  const stats = [
    { label: 'Total bookings', value: m.totalBookings, delta: 'all time', gold: false, deltaUp: false },
    { label: "Today's check-ins", value: m.todayBookings, delta: 'checking in today', gold: false, deltaUp: m.todayBookings > 0 },
    { label: 'Currently occupied', value: m.occupiedRooms, delta: `of ${m.totalRooms} rooms`, gold: false, deltaUp: false },
    { label: 'Available rooms', value: m.availableRooms, delta: 'ready to book', gold: false, deltaUp: false },
    { label: 'Occupancy', value: `${occupancyPct}%`, delta: 'rooms occupied', gold: true, deltaUp: false },
    { label: 'Revenue MTD', value: inr(m.revenueMtd), delta: 'this month', gold: true, deltaUp: m.revenueMtd > 0 },
  ]

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      role="region"
      aria-label="Dashboard statistics summary"
    >
      {stats.map((stat) => (
        <div key={stat.label} role="status" aria-label={`${stat.label}: ${stat.value}`}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  )
}
