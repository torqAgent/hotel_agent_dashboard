export const HOTEL_ID = process.env.NEXT_PUBLIC_HOTEL_ID ?? 'demo'

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
