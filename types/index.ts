export interface Booking {
  bookingId: number
  name: string | null
  no: string | null
  roomNo: number | null
  checkIn: string | null
  checkOut: string | null
  totalPrice: number | null
}

export interface Room {
  roomNo: number
  roomType: string | null
  availability: boolean | null
}

export interface RoomWithBookings extends Room {
  bookings: Booking[]
  bookedBy: string | null
}

export interface Metrics {
  totalBookings: number
  todayBookings: number
  occupiedRooms: number
  availableRooms: number
  totalRooms: number
  revenueMtd: number
  revenueAll: number
  bookingsThisWeek: number[]
  monthBookings: number
}

export type CallStatus =
  | 'resolved'
  | 'escalated'
  | 'missed'
  | 'completed'
  | 'ongoing'
  | 'active'
export interface Call {
  id: string
  caller: string
  status: CallStatus
  duration: number
  startedAt: string

  guestName?: string | null
  guestPhone?: string | null
  intent?: string | null
  durationSec?: number | null
  transcript?: string | null
  livekitRoomId?: string | null
}