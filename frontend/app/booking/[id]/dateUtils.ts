export const parseDateString = (s: string) => {
  if (!s) return null
  const d = new Date(s + 'T00:00:00')
  d.setHours(0, 0, 0, 0)
  return d
}

export const parseTimeString = (s: string) => {
  if (!s) return null
  const [h, m] = s.split(':').map(Number)
  const d = new Date()
  d.setHours(h || 0, m || 0, 0, 0)
  return d
}

export const formatDate = (d: Date | null | undefined) => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const formatTime = (d: Date | null | undefined) => {
  if (!d) return ''
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
