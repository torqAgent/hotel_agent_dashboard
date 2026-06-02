import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const db = drizzle(neon(process.env.DB_URL!))

// In-memory cache for settings (in production, store in database)
export const settingsCache: any = {
  hotelName: 'The Grand Heritage, Mysuru',
  agentName: 'Aria',
  greeting: 'Thank you for calling The Grand Heritage. How may I assist you?',
  tone: 'Formal',
  sipTrunk: '+91 821 000 0000',
  livekitRoom: 'hotel-reception',
  managerSip: 'sip:manager@yourdomain.com',
  pmsProvider: 'Google Calendar',
  deluxPrice: '5000',
  standardPrice: '2500',
}

export async function GET() {
  return NextResponse.json(settingsCache)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Update cache with new settings
    Object.assign(settingsCache, body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      settings: settingsCache 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 400 }
    )
  }
}
