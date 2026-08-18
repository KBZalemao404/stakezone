import { useState, useEffect, useCallback } from 'react'
import { fetchStandings, type FootballApiStanding, type StandingTeam } from '../services/api'

// League IDs for API-Football
export const LEAGUES = {
  BRASILEIRAO: 71,
  SERIE_B: 72,
  CHAMPIONS: 2,
  PREMIER: 39,
  LA_LIGA: 140,
  LIBERTADORES: 13,
} as const

interface LeagueInfo {
  id: number
  name: string
  country: string
  flag: string
}

export const LEAGUE_INFO: Record<number, LeagueInfo> = {
  [LEAGUES.BRASILEIRAO]: { id: 71, name: 'Brasileirão Série A', country: 'Brasil', flag: '🇧🇷' },
  [LEAGUES.SERIE_B]: { id: 72, name: 'Brasileirão Série B', country: 'Brasil', flag: '🇧🇷' },
  [LEAGUES.CHAMPIONS]: { id: 2, name: 'Champions League', country: 'Europa', flag: '🇪🇺' },
  [LEAGUES.PREMIER]: { id: 39, name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  [LEAGUES.LA_LIGA]: { id: 140, name: 'LaLiga', country: 'Espanha', flag: '🇪🇸' },
  [LEAGUES.LIBERTADORES]: { id: 13, name: 'Copa Libertadores', country: 'América do Sul', flag: '🌎' },
}

interface UseStandingsResult {
  standings: StandingTeam[] | null
  loading: boolean
  error: string | null
  isUsingRealData: boolean
  leagueInfo: LeagueInfo | null
  refresh: () => Promise<void>
}

export function useStandings(leagueId: number): UseStandingsResult {
  const [standings, setStandings] = useState<StandingTeam[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingRealData, setIsUsingRealData] = useState(false)

  const leagueInfo = LEAGUE_INFO[leagueId] || null

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchStandings(leagueId)
      if (data?.standings?.[0]) {
        setStandings(data.standings[0])
        setIsUsingRealData(true)
      } else {
        setStandings(null)
        setIsUsingRealData(false)
      }
    } catch (err) {
      console.error('Failed to fetch standings:', err)
      setError('Erro ao carregar classificação')
      setStandings(null)
      setIsUsingRealData(false)
    } finally {
      setLoading(false)
    }
  }, [leagueId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    standings,
    loading,
    error,
    isUsingRealData,
    leagueInfo,
    refresh: fetchData,
  }
}

// Mock standings for when API is not configured
export function getMockStandings(leagueId: number): StandingTeam[] {
  const mockData: Record<number, StandingTeam[]> = {
    [LEAGUES.BRASILEIRAO]: [
      { rank: 1, team: { id: 1, name: 'Palmeiras', logo: '' }, points: 68, goalsDiff: 28, group: '', form: 'WWWW', status: '', all: { played: 32, win: 21, draw: 5, lose: 6, goals: { for: 58, against: 30 } } },
      { rank: 2, team: { id: 2, name: 'Botafogo', logo: '' }, points: 65, goalsDiff: 25, group: '', form: 'WWDWW', status: '', all: { played: 32, win: 20, draw: 5, lose: 7, goals: { for: 55, against: 30 } } },
      { rank: 3, team: { id: 3, name: 'Flamengo', logo: '' }, points: 63, goalsDiff: 22, group: '', form: 'LWWWW', status: '', all: { played: 32, win: 19, draw: 6, lose: 7, goals: { for: 52, against: 30 } } },
      { rank: 4, team: { id: 4, name: 'Fortaleza', logo: '' }, points: 60, goalsDiff: 18, group: '', form: 'WWDLW', status: '', all: { played: 32, win: 18, draw: 6, lose: 8, goals: { for: 48, against: 30 } } },
      { rank: 5, team: { id: 5, name: 'São Paulo', logo: '' }, points: 57, goalsDiff: 15, group: '', form: 'WDLWW', status: '', all: { played: 32, win: 17, draw: 6, lose: 9, goals: { for: 45, against: 30 } } },
      { rank: 6, team: { id: 6, name: 'Internacional', logo: '' }, points: 55, goalsDiff: 12, group: '', form: 'WWLWD', status: '', all: { played: 32, win: 16, draw: 7, lose: 9, goals: { for: 44, against: 32 } } },
      { rank: 7, team: { id: 7, name: 'Bahia', logo: '' }, points: 53, goalsDiff: 10, group: '', form: 'DWLWW', status: '', all: { played: 32, win: 15, draw: 8, lose: 9, goals: { for: 42, against: 32 } } },
      { rank: 8, team: { id: 8, name: 'Athletico-PR', logo: '' }, points: 50, goalsDiff: 8, group: '', form: 'WLWDW', status: '', all: { played: 32, win: 14, draw: 8, lose: 10, goals: { for: 40, against: 32 } } },
      { rank: 9, team: { id: 9, name: 'Grêmio', logo: '' }, points: 48, goalsDiff: 5, group: '', form: 'LDWWL', status: '', all: { played: 32, win: 13, draw: 9, lose: 10, goals: { for: 38, against: 33 } } },
      { rank: 10, team: { id: 10, name: 'Cruzeiro', logo: '' }, points: 46, goalsDiff: 3, group: '', form: 'WLWWL', status: '', all: { played: 32, win: 12, draw: 10, lose: 10, goals: { for: 36, against: 33 } } },
      { rank: 11, team: { id: 11, name: 'Corinthians', logo: '' }, points: 44, goalsDiff: 1, group: '', form: 'WLLWW', status: '', all: { played: 32, win: 12, draw: 8, lose: 12, goals: { for: 35, against: 34 } } },
      { rank: 12, team: { id: 12, name: 'Vasco', logo: '' }, points: 42, goalsDiff: -2, group: '', form: 'LWWDL', status: '', all: { played: 32, win: 11, draw: 9, lose: 12, goals: { for: 33, against: 35 } } },
      { rank: 13, team: { id: 13, name: 'Santos', logo: '' }, points: 40, goalsDiff: -4, group: '', form: 'DLLWW', status: '', all: { played: 32, win: 11, draw: 7, lose: 14, goals: { for: 32, against: 36 } } },
      { rank: 14, team: { id: 14, name: 'Juventude', logo: '' }, points: 38, goalsDiff: -6, group: '', form: 'WLLDL', status: '', all: { played: 32, win: 10, draw: 8, lose: 14, goals: { for: 30, against: 36 } } },
      { rank: 15, team: { id: 15, name: 'Criciúma', logo: '' }, points: 36, goalsDiff: -8, group: '', form: 'LWLDL', status: '', all: { played: 32, win: 9, draw: 9, lose: 14, goals: { for: 28, against: 36 } } },
      { rank: 16, team: { id: 16, name: 'Vitória', logo: '' }, points: 34, goalsDiff: -10, group: '', form: 'DLLWL', status: '', all: { played: 32, win: 9, draw: 7, lose: 16, goals: { for: 27, against: 37 } } },
      { rank: 17, team: { id: 17, name: 'Cuiabá', logo: '' }, points: 32, goalsDiff: -14, group: '', form: 'LWLLL', status: '', all: { played: 32, win: 8, draw: 8, lose: 16, goals: { for: 25, against: 39 } } },
      { rank: 18, team: { id: 18, name: 'Atlético-GO', logo: '' }, points: 30, goalsDiff: -18, group: '', form: 'LLLDL', status: '', all: { played: 32, win: 7, draw: 9, lose: 16, goals: { for: 24, against: 42 } } },
      { rank: 19, team: { id: 19, name: 'Athletico-GO', logo: '' }, points: 28, goalsDiff: -20, group: '', form: 'LLWLL', status: '', all: { played: 32, win: 7, draw: 7, lose: 18, goals: { for: 22, against: 42 } } },
      { rank: 20, team: { id: 20, name: 'Criciúma', logo: '' }, points: 26, goalsDiff: -22, group: '', form: 'LLLLL', status: '', all: { played: 32, win: 6, draw: 8, lose: 18, goals: { for: 21, against: 43 } } },
    ],
    [LEAGUES.PREMIER]: [
      { rank: 1, team: { id: 1, name: 'Liverpool', logo: '' }, points: 72, goalsDiff: 35, group: '', form: 'WWWW', status: '', all: { played: 32, win: 23, draw: 3, lose: 6, goals: { for: 65, against: 30 } } },
      { rank: 2, team: { id: 2, name: 'Arsenal', logo: '' }, points: 68, goalsDiff: 30, group: '', form: 'WWDWW', status: '', all: { played: 32, win: 21, draw: 5, lose: 6, goals: { for: 60, against: 30 } } },
      { rank: 3, team: { id: 3, name: 'Manchester City', logo: '' }, points: 65, goalsDiff: 28, group: '', form: 'LWWWW', status: '', all: { played: 32, win: 20, draw: 5, lose: 7, goals: { for: 58, against: 30 } } },
      { rank: 4, team: { id: 4, name: 'Chelsea', logo: '' }, points: 58, goalsDiff: 18, group: '', form: 'WWDLW', status: '', all: { played: 32, win: 17, draw: 7, lose: 8, goals: { for: 50, against: 32 } } },
      { rank: 5, team: { id: 5, name: 'Aston Villa', logo: '' }, points: 55, goalsDiff: 12, group: '', form: 'WDLWW', status: '', all: { played: 32, win: 16, draw: 7, lose: 9, goals: { for: 48, against: 36 } } },
    ],
    [LEAGUES.CHAMPIONS]: [
      { rank: 1, team: { id: 1, name: 'Real Madrid', logo: '' }, points: 18, goalsDiff: 10, group: '', form: 'WWWW', status: '', all: { played: 6, win: 6, draw: 0, lose: 0, goals: { for: 18, against: 8 } } },
      { rank: 2, team: { id: 2, name: 'Bayern München', logo: '' }, points: 15, goalsDiff: 8, group: '', form: 'WWDWW', status: '', all: { played: 6, win: 5, draw: 0, lose: 1, goals: { for: 16, against: 8 } } },
      { rank: 3, team: { id: 3, name: 'Manchester City', logo: '' }, points: 12, goalsDiff: 5, group: '', form: 'LWWWW', status: '', all: { played: 6, win: 4, draw: 0, lose: 2, goals: { for: 14, against: 9 } } },
      { rank: 4, team: { id: 4, name: 'Barcelona', logo: '' }, points: 10, goalsDiff: 3, group: '', form: 'WWDLW', status: '', all: { played: 6, win: 3, draw: 1, lose: 2, goals: { for: 12, against: 9 } } },
      { rank: 5, team: { id: 5, name: 'Arsenal', logo: '' }, points: 9, goalsDiff: 1, group: '', form: 'WDLWW', status: '', all: { played: 6, win: 3, draw: 0, lose: 3, goals: { for: 10, against: 9 } } },
    ],
  }

  return mockData[leagueId] || mockData[LEAGUES.BRASILEIRAO]
}
