import { getBookings, getMetrics, getRooms } from '@/server/db/queries'
import { StatGrid } from '@/components/dashboard/StatGrid'
import { CallVolumeChart } from '@/components/dashboard/CallVolumeChart'
import { RecentBookings } from '@/components/dashboard/RecentCalls'
import { RoomStatusBreakdown } from '@/components/dashboard/IntentBreakdown'
import { RevenueSnapshot } from '@/components/dashboard/RevenueSnapshot'
import { SystemHealth } from '@/components/dashboard/SystemHealth'
import { LiveCallsCard } from '@/components/dashboard/LiveCallsCard'
import { Card, CardTitle } from '@/components/ui/Card'
import type { Metrics, Booking, Room } from '@/types'

export const dynamic = 'force-dynamic'

const FALLBACK_METRICS: Metrics = {
  totalBookings: 0, todayBookings: 0, availableRooms: 0,
  totalRooms: 0, revenueMtd: 0, revenueAll: 0,
  bookingsThisWeek: [0,0,0,0,0,0,0], monthBookings: 0,
}

export default async function DashboardPage() {
  let metrics: Metrics = FALLBACK_METRICS
  let bookings: Booking[] = []
  let roomList: Room[] = []

  try {
    ;[metrics, bookings, roomList] = await Promise.all([
      getMetrics(),
      getBookings(),
      getRooms(),
    ])
  } catch (e) {
    console.error('DB fetch error:', e)
  }

  return (
    <div className="flex flex-col gap-5">
      <StatGrid m={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardTitle>Bookings — last 7 days</CardTitle>
          <CallVolumeChart data={metrics.bookingsThisWeek} />
        </Card>
        <Card>
          <CardTitle>Recent bookings</CardTitle>
          <RecentBookings bookings={bookings} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LiveCallsCard />
        <Card>
          <CardTitle>Room type breakdown</CardTitle>
          <RoomStatusBreakdown rooms={roomList} />
        </Card>
        <Card>
          <CardTitle>System health</CardTitle>
          <SystemHealth m={metrics} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Booking trend</CardTitle>
          <RevenueSnapshot weekData={metrics.bookingsThisWeek} />
        </Card>
      </div>
    </div>
  )
}
