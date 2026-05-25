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
}

export interface Metrics {
  totalBookings: number
  todayBookings: number
  availableRooms: number
  totalRooms: number
  revenueMtd: number
  revenueAll: number
  bookingsThisWeek: number[]
  monthBookings: number
}
