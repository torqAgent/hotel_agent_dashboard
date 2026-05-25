import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/livekit'

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room') ?? 'hotel-reception'
  const token = await generateToken(room, `dashboard-${Date.now()}`)
  return NextResponse.json({ token })
}
