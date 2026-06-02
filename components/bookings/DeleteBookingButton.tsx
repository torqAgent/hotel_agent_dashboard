'use client'

interface Props {
  bookingId: number
  onSuccess?: () => void
}

export default function DeleteBookingButton({
  bookingId,
  onSuccess,
}: Props) {
  async function handleDelete() {
    if (!confirm(`Delete booking #${bookingId}?`)) return

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      if (onSuccess) {
        onSuccess()
      }
    } else {
      alert('Failed to delete booking')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs"
    >
      Delete
    </button>
  )
}