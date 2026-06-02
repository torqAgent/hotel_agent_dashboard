import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  boolean,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core'

export const booking = pgTable('booking', {
  bookingId: serial('booking_id').primaryKey(),
  name: varchar('name'),
  no: varchar('no'),
  roomNo: integer('room_no'),
  checkIn: date('check_in'),
  checkOut: date('check_out'), // When customer actually checks out
  totalPrice: integer('total_price'),
  status: varchar('status').default('active'), // active, checked_out, cancelled
  createdAt: timestamp('created_at').defaultNow(),
})

export const rooms = pgTable('rooms', {
  roomNo: integer('room_no').primaryKey(),
  roomType: varchar('room_type'),
  availability: boolean('availability'),
})

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  hotelName: varchar('hotel_name').default('The Grand Heritage, Mysuru'),
  agentName: varchar('agent_name').default('Aria'),
  greeting: varchar('greeting').default('Thank you for calling The Grand Heritage. How may I assist you?'),
  tone: varchar('tone').default('Formal'),
  sipTrunk: varchar('sip_trunk').default('+91 821 000 0000'),
  livekitRoom: varchar('livekit_room').default('hotel-reception'),
  managerSip: varchar('manager_sip').default('sip:manager@yourdomain.com'),
  pmsProvider: varchar('pms_provider').default('Google Calendar'),
  deluxPrice: varchar('delux_price').default('5000'),
  standardPrice: varchar('standard_price').default('2500'),
  updatedAt: timestamp('updated_at').defaultNow(),
})
