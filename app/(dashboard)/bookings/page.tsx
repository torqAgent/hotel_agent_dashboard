'use client'

import { useEffect, useState } from 'react'
import { inr, fmtDate } from '@/lib/formatters'
import type { Booking } from '@/types'
import AddBookingForm from '@/components/AddBookingForm'
import { CheckoutButton } from '@/components/bookings/CheckoutButton'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBookings(data)
      setError(false)
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const total = bookings.reduce((a, b) => a + (b.totalPrice ?? 0), 0)

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-base font-medium text-white">Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">All bookings from your Neon database</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-right">
          <div className="text-xs text-gray-500">Total revenue</div>
          <div className="text-lg font-medium text-gold-dim">{inr(total)}</div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-950 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-3">
          Failed to connect to database. Check your DB_URL environment variable.
        </div>
      )}

      <AddBookingForm onSuccess={fetchBookings} />

      <div className="overflow-x-auto rounded-xl border border-dark-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-xs text-gray-500 uppercase tracking-wider">
              {['ID', 'Guest name', 'Phone', 'Room no', 'Check-in', 'Check-out', 'Total price', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 && !error ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-600">No bookings in database</td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr
                  key={b.bookingId}
                  className={`border-b border-dark-border hover:bg-dark-surface transition-colors ${
                    i % 2 === 0 ? '' : 'bg-dark-card'
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">#{b.bookingId}</td>
                  <td className="px-4 py-3 text-white font-medium">{b.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{b.no ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{b.roomNo ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {b.checkIn ? fmtDate(b.checkIn) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {b.checkOut ? fmtDate(b.checkOut) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gold-dim font-medium">
                    {b.totalPrice ? inr(b.totalPrice) : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <CheckoutButton 
                      bookingId={b.bookingId} 
                      guestName={b.name} 
                      roomNo={b.roomNo}
                      onSuccess={fetchBookings}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
