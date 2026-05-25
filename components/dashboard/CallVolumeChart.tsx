'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export function CallVolumeChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ day: DAYS[i], calls: v }))
  const max = Math.max(...data)
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barCategoryGap="30%">
        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#9ca3af' }}
          itemStyle={{ color: '#F5C842' }}
        />
        <Bar dataKey="calls" radius={[4,4,0,0]}>
          {chartData.map((e, i) => (
            <Cell key={i} fill={e.calls === max ? '#c9a133' : 'rgba(245,200,66,0.15)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
