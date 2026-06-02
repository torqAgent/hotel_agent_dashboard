import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  boolean,
} from 'drizzle-orm/pg-core'

export const booking = pgTable('booking', {
  bookingId: serial('booking_id').primaryKey(),
  name: varchar('name'),
  no: varchar('no'),
  roomNo: integer('room_no'),
  checkIn: date('check_in'),
  checkOut: date('check_out'),
  totalPrice: integer('total_price'),
  status: varchar('status').default('active'),
})

export const rooms = pgTable('rooms', {
  roomNo: integer('room_no').primaryKey(),
  roomType: varchar('room_type'),
  availability: boolean('availability'),
})