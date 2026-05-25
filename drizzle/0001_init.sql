CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  sip_status TEXT NOT NULL DEFAULT 'connected',
  pms_status TEXT NOT NULL DEFAULT 'live',
  mins_included INTEGER NOT NULL DEFAULT 300,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id),
  guest_name TEXT,
  guest_phone TEXT,
  intent TEXT,
  status TEXT NOT NULL DEFAULT 'resolved',
  duration_sec INTEGER,
  transcript TEXT,
  livekit_room_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID REFERENCES calls(id),
  hotel_id UUID NOT NULL REFERENCES hotels(id),
  guest_name TEXT,
  room_type TEXT,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  amount_inr INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hotels (id, name, plan, mins_included)
VALUES ('00000000-0000-0000-0000-000000000001', 'The Grand Heritage, Mysuru', 'growth', 600)
ON CONFLICT DO NOTHING;
