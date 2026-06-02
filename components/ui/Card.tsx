import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'bg-dark-card border border-dark-border rounded-xl p-4 transition-colors',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{children}</span>
      {right}
    </div>
  )
}
