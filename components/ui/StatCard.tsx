import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  gold?: boolean
}

export function StatCard({ label, value, delta, deltaUp, gold }: Props) {
  return (
    <div className="bg-dark-surface rounded-lg p-4">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">{label}</div>
      <div className={cn('text-2xl font-medium leading-none', gold ? 'text-gold-dim' : 'text-white')}>
        {value}
      </div>
      {delta && (
        <div className={cn('text-[11px] mt-1.5', deltaUp ? 'text-emerald-400' : 'text-gray-500')}>
          {delta}
        </div>
      )}
    </div>
  )
}
