// components/bookings/CheckoutButton.tsx
'use client'
import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'

interface Props {
  bookingId: number
  guestName: string | null
  roomNo: number | null
  onSuccess: () => void
}

export function CheckoutButton({ bookingId, guestName, roomNo, onSuccess }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/checkout/${bookingId}`, { method: 'PATCH' })
      if (res.ok) {
        setDone(true)
        setShowModal(false)
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <span className="text-[10px] text-gray-500 px-2 py-1 rounded-full bg-dark-surface">
        Checked out
      </span>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg 
                   bg-gold text-black font-medium hover:bg-gold-dim transition-colors"
      >
        <LogOut size={12} />
        Check out
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowModal(false)}>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-80"
            onClick={e => e.stopPropagation()}>
            
            <h3 className="text-base font-semibold text-white mb-1">Confirm checkout</h3>
            <p className="text-sm text-gray-400 mb-4">
              This will mark the room as available. Booking record is kept.
            </p>

            <div className="bg-dark-surface rounded-xl p-3 mb-5 flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Guest</span>
                <span className="text-white font-medium">{guestName ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Room</span>
                <span className="text-white font-medium">Room {roomNo ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="text-gray-400">#{bookingId}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-sm text-gray-400 border border-dark-border 
                           rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 py-2 text-sm bg-gold text-black font-medium 
                           rounded-lg hover:bg-gold-dim transition-colors 
                           flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading 
                  ? <><Loader2 size={13} className="animate-spin" />Processing…</>
                  : <><LogOut size={13} />Confirm</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}