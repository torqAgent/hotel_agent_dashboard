'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { DAYS_OF_WEEK } from '@/lib/constants'

export function CallVolumeChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ day: DAYS_OF_WEEK[i], calls: v }))
  const max = Math.max(...data, 1)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barCategoryGap="30%">
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-secondary)',
            border: `1px solid var(--border-color)`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--text-secondary)' }}
          itemStyle={{ color: 'var(--gold-primary)' }}
        />
        <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
          {chartData.map((e, i) => (
            <Cell
              key={i}
              fill={
                e.calls === max
                  ? 'var(--gold-secondary)'
                  : 'var(--gold-bg)'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
