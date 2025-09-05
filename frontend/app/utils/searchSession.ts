// Search session utilities
export function generateSearchId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export interface SearchSession {
  id: string
  pickupDate: string
  dropoffDate: string
  pickupLocation: string
  dropoffLocation: string
  timestamp: number
}

export function saveSearchSession(searchParams: Omit<SearchSession, 'id' | 'timestamp'>): string {
  const searchId = generateSearchId()
  const session: SearchSession = {
    ...searchParams,
    id: searchId,
    timestamp: Date.now()
  }
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`search_${searchId}`, JSON.stringify(session))
  }
  
  return searchId
}

export function getSearchSession(searchId: string): SearchSession | null {
  if (typeof window === 'undefined') return null
  
  const sessionData = sessionStorage.getItem(`search_${searchId}`)
  if (!sessionData) return null
  
  try {
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

export function clearExpiredSessions(): void {
  if (typeof window === 'undefined') return
  
  const now = Date.now()
  const expiredTime = 24 * 60 * 60 * 1000 // 24 hours
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith('search_')) {
      const sessionData = sessionStorage.getItem(key)
      if (sessionData) {
        try {
          const session: SearchSession = JSON.parse(sessionData)
          if (now - session.timestamp > expiredTime) {
            sessionStorage.removeItem(key)
          }
        } catch {
          sessionStorage.removeItem(key)
        }
      }
    }
  }
}