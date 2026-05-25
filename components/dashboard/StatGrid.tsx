import { StatCard } from '@/components/ui/StatCard'
import type { Metrics } from '@/types'
import { inr } from '@/lib/formatters'

export function StatGrid({ m }: { m: Metrics }) {
  const occupancyPct = m.totalRooms ? Math.round((m.totalRooms - m.availableRooms) / m.totalRooms * 100) : 0
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Total bookings" value={m.totalBookings} delta="all time" />
      <StatCard label="Today's check-ins" value={m.todayBookings} delta="checking in today" deltaUp={m.todayBookings > 0} />
      <StatCard label="Available rooms" value={m.availableRooms} delta={`of ${m.totalRooms} total`} />
      <StatCard label="Occupancy" value={`${occupancyPct}%`} delta="rooms occupied" gold />
      <StatCard label="Revenue MTD" value={inr(m.revenueMtd)} delta="this month" deltaUp={m.revenueMtd > 0} gold />
      <StatCard label="This month" value={m.monthBookings} delta="bookings" deltaUp={m.monthBookings > 0} />
    </div>
  )
}
