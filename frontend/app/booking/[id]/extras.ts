export type Extra = { id: string; name: string; price: number; type: 'per_day' | 'one_time' }

// Fallback extras in case backend is not reachable (kept minimal)
export const fallbackExtras: Extra[] = [
  { id: '1', name: '1 seggiolino', price: 10, type: 'per_day' },
  { id: '2', name: '2 seggiolini', price: 15, type: 'per_day' },
]
