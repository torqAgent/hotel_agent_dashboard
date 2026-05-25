import { NextRequest, NextResponse } from 'next/server'
import { getCall } from '@/server/db/queries'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const call = await getCall(params.id)
  if (!call) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(call)
}
