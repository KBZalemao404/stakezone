import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAllOdds, fetchAllMatches, getApiStatus, type OddsApiResponse } from '../services/api'
import type { Match, SportId } from '../data/types'
import { MATCHES as MOCK_MATCHES } from '../data/sports'

interface UseLiveOddsResult {
  matches: Match[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  isUsingRealData: boolean
  apiStatus: ReturnType<typeof getApiStatus>
  refresh: () => Promise<void>
  filterBySport: (sport: SportId | 'all') => Match[]
}

export function useLiveOdds(refreshInterval = 60000): UseLiveOddsResult {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isUsingRealData, setIsUsingRealData] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const apiStatus = getApiStatus()
  const hasApiKey = apiStatus.oddsApi.configured || apiStatus.footballApi.configured

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (hasApiKey) {
        const realMatches = await fetchAllMatches()
        if (realMatches.length > 0) {
          setMatches(realMatches)
          setIsUsingRealData(true)
          setLastUpdated(new Date())
        } else {
          // API returned empty, fall back to mock
          setMatches(MOCK_MATCHES)
          setIsUsingRealData(false)
          setLastUpdated(new Date())
        }
      } else {
        // No API key configured, use mock data
        setMatches(MOCK_MATCHES)
        setIsUsingRealData(false)
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error('Failed to fetch odds:', err)
      setError('Erro ao carregar dados. Usando dados de demonstração.')
      setMatches(MOCK_MATCHES)
      setIsUsingRealData(false)
    } finally {
      setLoading(false)
    }
  }, [hasApiKey])

  useEffect(() => {
    fetchData()

    // Auto-refresh when using real data
    if (hasApiKey) {
      intervalRef.current = setInterval(fetchData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData, hasApiKey, refreshInterval])

  const filterBySport = useCallback(
    (sport: SportId | 'all') => {
      if (sport === 'all') return matches
      return matches.filter((m) => m.sport === sport)
    },
    [matches]
  )

  return {
    matches,
    loading,
    error,
    lastUpdated,
    isUsingRealData,
    apiStatus,
    refresh: fetchData,
    filterBySport,
  }
}
