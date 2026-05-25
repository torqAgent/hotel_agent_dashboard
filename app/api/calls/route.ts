import { NextResponse } from 'next/server'
import { getBookings } from '@/server/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getBookings()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
