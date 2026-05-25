import { getRooms, getRoomWithBookings } from '@/server/db/queries'
import { fmtDate, inr } from '@/lib/formatters'
import type { RoomWithBookings } from '@/types'

export const dynamic = 'force-dynamic'

export default async function RoomsPage() {
  let rooms: RoomWithBookings[] = []
  let error = false
  try {
    rooms = await getRoomWithBookings()
  } catch (e) {
    console.error(e)
    error = true
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-medium text-white">Rooms</h2>
        <p className="text-sm text-gray-500 mt-0.5">All rooms with availability and booking history</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-950 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-3">
          Failed to connect to database. Check your DB_URL environment variable.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map(r => (
          <div key={r.roomNo} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-medium text-white">Room {r.roomNo}</div>
                <div className="text-xs text-gray-500 mt-0.5">{r.roomType ?? 'Unknown type'}</div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                r.availability ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
              }`}>
                {r.availability ? 'Available' : 'Occupied'}
              </span>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              {r.bookings.length} booking{r.bookings.length !== 1 ? 's' : ''}
            </div>

            {r.bookings.length > 0 && (
              <div className="border-t border-dark-border pt-2 flex flex-col gap-1.5">
                {r.bookings.slice(0, 3).map(b => (
                  <div key={b.bookingId} className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-white">{b.name ?? 'Unknown'}</div>
                      <div className="text-[10px] text-gray-600">
                        {b.checkIn ? fmtDate(b.checkIn) : '—'} → {b.checkOut ? fmtDate(b.checkOut) : '—'}
                      </div>
                    </div>
                    <div className="text-xs text-gold-dim">{b.totalPrice ? inr(b.totalPrice) : '—'}</div>
                  </div>
                ))}
                {r.bookings.length > 3 && (
                  <div className="text-[10px] text-gray-600">+{r.bookings.length - 3} more</div>
                )}
              </div>
            )}
          </div>
        ))}
        {rooms.length === 0 && !error && (
          <div className="col-span-3 text-center py-12 text-gray-600 text-sm">No rooms in database</div>
        )}
      </div>
    </div>
  )
}
