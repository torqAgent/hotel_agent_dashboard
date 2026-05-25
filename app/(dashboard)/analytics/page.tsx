'use client'
import { Card, CardTitle } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import { inr } from '@/lib/formatters'
import { useEffect, useState } from 'react'
import type { Metrics, Room } from '@/types'

const tt = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#9ca3af' }
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const COLORS = ['#c9a133','#4b5563','#374151','#1f2937','#6b7280','#9ca3af']

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/metrics-json').then(r => r.json()),
      fetch('/api/rooms').then(r => r.json()),
    ])
      .then(([m, r]) => { setMetrics(m); setRooms(r) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const weekData = metrics ? DAYS.map((day, i) => ({ day, bookings: metrics.bookingsThisWeek[i] ?? 0 })) : []

  const roomTypes = rooms.reduce((acc, r) => {
    const t = r.roomType ?? 'Unknown'
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(roomTypes).map(([name, value]) => ({ name, value }))

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500 text-sm animate-pulse">
      Loading analytics from Neon DB…
    </div>
  )

  if (error) return (
    <div className="bg-red-950 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-3">
      Failed to load analytics. Check DB_URL.
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-1">
        <h2 className="text-base font-medium text-white">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Live data from your Neon database</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total bookings', value: String(metrics?.totalBookings ?? 0) },
          { label: 'Revenue (all time)', value: inr(metrics?.revenueAll ?? 0) },
          { label: 'Revenue MTD', value: inr(metrics?.revenueMtd ?? 0) },
          { label: 'Available rooms', value: `${metrics?.availableRooms ?? 0} / ${metrics?.totalRooms ?? 0}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-dark-surface rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-2xl font-medium text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Bookings — last 7 days</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tt} itemStyle={{ color: '#F5C842' }} />
              <Bar dataKey="bookings" fill="rgba(245,200,66,0.2)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Booking trend</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a133" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c9a133" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tt} />
              <Area type="monotone" dataKey="bookings" stroke="#c9a133" strokeWidth={2} fill="url(#rg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Room types</CardTitle>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie data={pieData} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-2">
              {pieData.map(({ name, value }, i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-400">{name}</span>
                  <span className="text-xs text-white ml-auto pl-4">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Availability by type</CardTitle>
          <div className="flex flex-col gap-3 mt-2">
            {Object.entries(
              rooms.reduce((acc, r) => {
                const t = r.roomType ?? 'Unknown'
                if (!acc[t]) acc[t] = { total: 0, available: 0 }
                acc[t].total++
                if (r.availability) acc[t].available++
                return acc
              }, {} as Record<string, { total: number; available: number }>)
            ).map(([type, { total, available }]) => (
              <div key={type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{type}</span>
                  <span className="text-gray-500">{available}/{total} available</span>
                </div>
                <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${total ? (available/total)*100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
