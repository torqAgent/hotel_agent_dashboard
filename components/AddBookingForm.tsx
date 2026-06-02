'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  onSuccess?: () => void
}

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  return Math.max(1, nights)
}

function calculatePrice(roomType: string, nights: number, deluxRate: number, standardRate: number): number {
  const rate = roomType === 'Delux' ? deluxRate : standardRate
  return rate * nights
}

export default function AddBookingForm({ onSuccess }: Props) {

  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [rates, setRates] = useState({ deluxPrice: 5000, standardPrice: 2500 })

  const fetchRooms = () => {
    fetch('/api/rooms')
      .then(r => r.json())
      .then(setRooms)
  }

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setRates({
          deluxPrice: parseInt(data.deluxPrice) || 5000,
          standardPrice: parseInt(data.standardPrice) || 2500,
        })
      }
    } catch (e) {
      console.error('Failed to fetch rates')
    }
  }

  const [form, setForm] = useState({
    name: '',
    no: '',
    roomType: '',
    roomNo: '',
    checkIn: '',
    checkOut: '',
    totalPrice: '',
  })

  // Auto-calculate price when room type, check-in, or check-out changes
  useEffect(() => {
    if (form.roomType && form.checkIn && form.checkOut) {
      const nights = calculateNights(form.checkIn, form.checkOut)
      const price = calculatePrice(form.roomType, nights, rates.deluxPrice, rates.standardPrice)
      setForm(prev => ({ ...prev, totalPrice: price.toString() }))
    }
  }, [form.roomType, form.checkIn, form.checkOut, rates.deluxPrice, rates.standardPrice])

  // Fetch rooms and rates on mount
  useEffect(() => {
    fetchRooms()
    fetchRates()
  }, [])

async function submit(e: React.FormEvent) {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (loading) return
    
    // Validation
    if (!form.name || !form.no || !form.roomType || !form.roomNo || !form.checkIn || !form.checkOut) {
      alert('Please fill in all fields')
      return
    }

    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      alert('Check-out date must be after check-in date')
      return
    }
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed')
        return
      }

      fetchRooms()
      
      if (onSuccess) {
        onSuccess()
      }

      setForm({
        name: '',
        no: '',
        roomType: '',
        roomNo: '',
        checkIn: '',
        checkOut: '',
        totalPrice: '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={submit}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
      <input
        placeholder="Guest Name"
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.name}
        onChange={e =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.no}
        onChange={e =>
          setForm({ ...form, no: e.target.value })
        }
      />

      <select
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.roomType}
        onChange={e =>
          setForm({
            ...form,
            roomType: e.target.value,
            roomNo: '',
          })
        }
      >
        <option value="">Room Type</option>
        <option value="Delux">Delux</option>
        <option value="Standard">Standard</option>
      </select>

      <select
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.roomNo}
        onChange={e =>
          setForm({
            ...form,
            roomNo: e.target.value,
          })
        }
      >
        <option value="">Select Room</option>

        {rooms
          .filter(
            r =>
              r.roomType === form.roomType &&
              r.availability === true
          )
          .map(r => (
            <option
              key={r.roomNo}
              value={r.roomNo}
            >
              Room {r.roomNo}
            </option>
          ))}
      </select>

      <input
        type="date"
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.checkIn}
        onChange={e =>
          setForm({
            ...form,
            checkIn: e.target.value,
          })
        }
      />

      <input
        type="date"
        disabled={loading}
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border disabled:opacity-60"
        value={form.checkOut}
        onChange={e =>
          setForm({
            ...form,
            checkOut: e.target.value,
          })
        }
      />

      <input
        placeholder="Price"
        type="number"
        readOnly
        className="p-2 rounded border bg-dark-card text-white placeholder:text-gray-500 border-dark-border opacity-75 cursor-not-allowed"
        value={form.totalPrice}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-60 text-white rounded px-4 py-2 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Adding...
          </>
        ) : (
          'Add Booking'
        )}
      </button>
    </form>
    {form.roomType && form.checkIn && form.checkOut && (
      <div className="mt-2 text-sm text-gray-400">
        {calculateNights(form.checkIn, form.checkOut)} nights @ ₹{form.roomType === 'Delux' ? rates.deluxPrice : rates.standardPrice}/night = ₹{form.totalPrice || '0'}
      </div>
    )}
  </>
  )
}


