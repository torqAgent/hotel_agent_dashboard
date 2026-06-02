import type { Booking } from '@/types'
import { inr, fmtDate } from '@/lib/formatters'
import { BedDouble } from 'lucide-react'

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  // Filter valid bookings with required data
  const validBookings = bookings.filter(
    b => b.checkIn && b.checkOut && b.roomNo && b.name
  )

  return (
    <div className="flex flex-col gap-2" role="list" aria-label="Recent bookings">
      {validBookings.slice(0, 6).map(b => (
        <div
          key={b.bookingId}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            border: '1px solid',
          }}
          role="listitem"
          aria-label={`Booking for ${b.name} in room ${b.roomNo}`}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'var(--gold-bg)',
              color: 'var(--gold-primary)',
            }}
          >
            <BedDouble size={14} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div 
              className="text-sm truncate font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {b.name}
            </div>
            <div 
              className="text-xs truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              Room {b.roomNo} · {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
            </div>
          </div>
          <div 
            className="text-sm font-semibold shrink-0"
            style={{ color: 'var(--gold-primary)' }}
          >
            {b.totalPrice ? inr(b.totalPrice) : '—'}
          </div>
        </div>
      ))}
      {validBookings.length === 0 && (
        <div 
          className="text-xs text-center py-8"
          role="status"
          style={{ color: 'var(--text-secondary)' }}
        >
          No active bookings
        </div>
      )}
    </div>
  )
}
