import { NextRequest } from 'next/server'
import { getMetrics } from '@/server/db/queries'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = async () => {
        try {
          const data = await getMetrics()
          ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {}
      }
      await send()
      const iv = setInterval(send, 10000)
      req.signal.addEventListener('abort', () => { clearInterval(iv); ctrl.close() })
    }
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
