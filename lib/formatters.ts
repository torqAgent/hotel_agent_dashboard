export const inr = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`

export const dur = (sec: number | null) => {
  if (!sec) return '—'
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}m ${s}s`
}

export const fmtDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtTime = (dateStr: string | null) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export const ago = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m / 60)}h ago`
  return `${Math.floor(m / 1440)}d ago`
}
