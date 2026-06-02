// app/api/rooms/route.ts
import { NextResponse } from 'next/server';
import { getRooms } from '@/server/db/queries';

// FORCE NEXT.JS TO BYPASS THE CACHE AND RUN THIS ON EVERY REFRESH
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getRooms();
    return NextResponse.json(data); 
  } catch (error) {
    console.error("API Rooms Error:", error);
    return NextResponse.json([], { status: 500 }); 
  }
}