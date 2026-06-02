'use client'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { inr } from '@/lib/formatters'
import { DAYS_OF_WEEK } from '@/lib/constants'

export function RevenueSnapshot({ weekData }: { weekData: number[] }) {
  const data = weekData.map((v, i) => ({ day: DAYS_OF_WEEK[i], bookings: v }))
  return (
    <div>
      <div className="mb-3 text-xs text-gray-500">Bookings per day — last 7 days</div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold-secondary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--gold-secondary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: `1px solid var(--border-color)`,
              borderRadius: 8,
              fontSize: 11,
            }}
            formatter={(v: number) => [v, 'Bookings']}
          />
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="var(--gold-secondary)"
            strokeWidth={2}
            fill="url(#rv)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
