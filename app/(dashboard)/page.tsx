import { Suspense } from 'react'
import { getBookings, getMetrics, getRooms } from '@/server/db/queries'
import { StatGrid } from '@/components/dashboard/StatGrid'
import { CallVolumeChart } from '@/components/dashboard/CallVolumeChart'
import { RecentBookings } from '@/components/dashboard/RecentCalls'
import { RoomStatusBreakdown } from '@/components/dashboard/IntentBreakdown'
import { RevenueSnapshot } from '@/components/dashboard/RevenueSnapshot'
import { SystemHealth } from '@/components/dashboard/SystemHealth'
import { LiveCallsCard } from '@/components/dashboard/LiveCallsCard'
import { Card, CardTitle } from '@/components/ui/Card'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import type { Metrics, Booking, Room } from '@/types'

// Force dynamic rendering - always fetch fresh data from database
export const dynamic = 'force-dynamic'
// ISR: Revalidate every 10 seconds for near real-time updates
export const revalidate = 10

const FALLBACK_METRICS: Metrics = {
  totalBookings: 0,
  todayBookings: 0,
  availableRooms: 0,
  totalRooms: 0,
  revenueMtd: 0,
  revenueAll: 0,
  bookingsThisWeek: [0, 0, 0, 0, 0, 0, 0],
  monthBookings: 0,
}

async function DashboardContent() {
  let metrics: Metrics = FALLBACK_METRICS
  let bookings: Booking[] = []
  let roomList: Room[] = []
  let error: string | null = null

  try {
    ;[metrics, bookings, roomList] = await Promise.all([
      getMetrics(),
      getBookings(),
      getRooms(),
    ])
  } catch (e) {
    error = 'Failed to load dashboard data. Please refresh the page.'
    console.error('Dashboard fetch error:', e)
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px] text-center"
        role="alert"
      >
        <div>
          <h2 className="text-lg font-semibold text-red-500 mb-2">Error loading data</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div role="region" aria-label="Key metrics">
        <StatGrid m={metrics} />
      </div>

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

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
