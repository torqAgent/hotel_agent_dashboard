import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/server/db/queries'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.hotelName || !body.agentName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const settings = await updateSettings(body)
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings,
    })
  } catch (error) {
    console.error('POST /api/settings error:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
