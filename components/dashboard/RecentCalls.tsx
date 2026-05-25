import type { Booking } from '@/types'
import { inr, fmtDate } from '@/lib/formatters'
import { BedDouble } from 'lucide-react'

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="flex flex-col gap-2">
      {bookings.slice(0, 6).map(b => (
        <div key={b.bookingId} className="flex items-center gap-3 bg-dark-surface rounded-lg px-3 py-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gold-bg text-gold-dim">
            <BedDouble size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{b.name ?? 'Unknown guest'}</div>
            <div className="text-xs text-gray-500 truncate">
              Room {b.roomNo ?? '—'} · {b.checkIn ? fmtDate(b.checkIn) : '—'} → {b.checkOut ? fmtDate(b.checkOut) : '—'}
            </div>
          </div>
          <div className="text-sm font-medium text-gold-dim shrink-0">
            {b.totalPrice ? inr(b.totalPrice) : '—'}
          </div>
        </div>
      ))}
      {bookings.length === 0 && (
        <div className="text-xs text-gray-600 text-center py-6">No bookings yet</div>
      )}
    </div>
  )
}
