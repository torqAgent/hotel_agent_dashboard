import { NextResponse } from 'next/server'
import { getMetrics } from '@/server/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getMetrics()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
