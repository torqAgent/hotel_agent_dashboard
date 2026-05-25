import { cn } from '@/lib/utils'
import type { CallStatus } from '@/types'

const map: Record<CallStatus, string> = {
  resolved: 'bg-emerald-950 text-emerald-400',
  escalated: 'bg-red-950 text-red-400',
  missed: 'bg-yellow-950 text-yellow-400',
  active: 'bg-blue-950 text-blue-400',
  completed: 'bg-green-950 text-green-400',
  ongoing: 'bg-purple-950 text-purple-400',
}

export function Badge({ status }: { status: CallStatus }) {
  return (
    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', map[status])}>
      {status}
    </span>
  )
}
