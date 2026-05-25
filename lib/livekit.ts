import { AccessToken, RoomServiceClient } from 'livekit-server-sdk'

export function getRoomService() {
  return new RoomServiceClient(
    process.env.LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  )
}

export async function generateToken(room: string, identity: string) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity, ttl: '4h' }
  )
  at.addGrant({ roomJoin: true, room, canPublish: false, canSubscribe: true })
  return at.toJwt()
}
