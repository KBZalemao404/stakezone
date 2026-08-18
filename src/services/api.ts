/**
 * StakeZone API Service
 * 
 * Integrates with official APIs for real betting data:
 * - The Odds API: Real-time odds from bookmakers (500 credits/month free)
 * - API-Football: Live scores, fixtures, standings (100 requests/day free)
 * 
 * Falls back to mock data when API keys are not configured.
 * Get your free API keys at:
 * - https://the-odds-api.com (The Odds API)
 * - https://www.api-football.com (API-Football)
 */

import type { Match, SportId } from '../data/types'

// ============ API Configuration ============
const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || ''
const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || ''
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'
const FOOTBALL_API_BASE = 'https://v3.football.api-sports.io'

// ============ Sport Key Mapping (The Odds API → StakeZone) ============
const ODDS_SPORT_MAP: Record<string, SportId> = {
  'soccer_brazil_campeonato': 'futebol',
  'soccer_uefa_champs_league': 'futebol',
  'soccer_epl': 'futebol',
  'soccer_spain_la_liga': 'futebol',
  'soccer_copa_libertadores': 'futebol',
  'soccer_brazil_serie_b': 'futebol',
  'basketball_nba': 'basquete',
  'basketball_nba_extras': 'basquete',
  'basketball_euroleague': 'basquete',
  'tennis_atp': 'tenis',
  'tennis_wta': 'tenis',
  'americanfootball_nfl': 'futebol-americano',
  'baseball_mlb': 'baseball',
  'mma_mixed_martial_arts': 'mma',
}

// ============ API-Football League Mapping ============
const FOOTBALL_LEAGUE_MAP: Record<number, { name: string; country: string; sport: SportId }> = {
  71: { name: 'Brasileirão Série A', country: 'Brasil', sport: 'futebol' },
  72: { name: 'Brasileirão Série B', country: 'Brasil', sport: 'futebol' },
  2: { name: 'Champions League', country: 'Europa', sport: 'futebol' },
  39: { name: 'Premier League', country: 'Inglaterra', sport: 'futebol' },
  140: { name: 'LaLiga', country: 'Espanha', sport: 'futebol' },
  13: { name: 'Copa Libertadores', country: 'América do Sul', sport: 'futebol' },
}

// ============ Types ============
export interface OddsApiResponse {
  id: string
  sport_key: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
}

export interface Bookmaker {
  key: string
  title: string
  last_update: string
  markets: Market[]
}

export interface Market {
  key: string
  outcomes: Outcome[]
}

export interface Outcome {
  name: string
  price: number
}

export interface FootballApiFixture {
  fixture: {
    id: number
    date: string
    timestamp: number
    status: {
      short: string
      elapsed: number | null
      long: string
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
  }
  teams: {
    home: { id: number; name: string; logo: string }
    away: { id: number; name: string; logo: string }
  }
  goals: {
    home: number | null
    away: number | null
  }
}

export interface FootballApiStanding {
  league: {
    id: number
    name: string
    country: string
  }
  standings:StandingTeam[][]
}

export interface StandingTeam {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: { for: number; against: number }
  }
}

// ============ API Helper ============
async function apiFetch<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ============ The Odds API ============
export async function fetchOddsFromAPI(sportKey: string): Promise<Match[]> {
  if (!ODDS_API_KEY) return []

  const url = `${ODDS_API_BASE}/sports/${sportKey}/odds?apiKey=${ODDS_API_KEY}&regions=eu,uk&oddsFormat=decimal&markets=h2h`
  const data = await apiFetch<OddsApiResponse[]>(url)
  if (!data) return []

  return data.map((event) => {
    const sportId = ODDS_SPORT_MAP[event.sport_key] || 'futebol'
    
    // Get best odds from all bookmakers
    const h2hMarket = event.bookmakers
      .flatMap((b) => b.markets)
      .find((m) => m.key === 'h2h')

    const homeOutcome = h2hMarket?.outcomes.find((o) => o.name === event.home_team)
    const awayOutcome = h2hMarket?.outcomes.find((o) => o.name === event.away_team)
    const drawOutcome = h2hMarket?.outcomes.find((o) => o.name === 'Draw')

    const isLive = new Date(event.commence_time) <= new Date()
    const diffMs = new Date(event.commence_time).getTime() - Date.now()
    const diffMin = Math.round(diffMs / 60000)

    return {
      id: `odds-${event.id}`,
      sport: sportId,
      championship: getChampionshipName(event.sport_key),
      country: getCountryFromSport(event.sport_key),
      home: event.home_team,
      away: event.away_team,
      live: isLive,
      startTime: isLive ? 'AO VIVO' : formatStartTime(event.commence_time),
      markets: {
        home: homeOutcome?.price || 2.0,
        draw: drawOutcome?.price || 3.0,
        away: awayOutcome?.price || 2.0,
        handicapHome: 1.9,
        handicapAway: 1.9,
        over: 1.85,
        under: 1.95,
      },
    }
  })
}

export async function fetchAllOdds(): Promise<Match[]> {
  if (!ODDS_API_KEY) return []

  const sports = [
    'soccer_brazil_campeonato',
    'soccer_uefa_champs_league',
    'soccer_epl',
    'soccer_spain_la_liga',
    'basketball_nba',
    'americanfootball_nfl',
    'baseball_mlb',
  ]

  const results = await Promise.allSettled(
    sports.map((sport) => fetchOddsFromAPI(sport))
  )

  return results
    .filter((r): r is PromiseFulfilledResult<Match[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}

// ============ API-Football ============
export async function fetchLiveFixtures(): Promise<Match[]> {
  if (!FOOTBALL_API_KEY) return []

  const url = `${FOOTBALL_API_BASE}/fixtures?live=all`
  const data = await apiFetch<{ response: FootballApiFixture[] }>(url, {
    'x-rapidapi-key': FOOTBALL_API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  })
  if (!data) return []

  return data.response.map((fixture) => {
    const league = FOOTBALL_LEAGUE_MAP[fixture.league.id]
    return {
      id: `fb-${fixture.fixture.id}`,
      sport: league?.sport || 'futebol',
      championship: league?.name || fixture.league.name,
      country: league?.country || fixture.league.country,
      home: fixture.teams.home.name,
      away: fixture.teams.away.name,
      homeScore: fixture.goals.home ?? undefined,
      awayScore: fixture.goals.away ?? undefined,
      live: true,
      minute: fixture.fixture.status.elapsed || undefined,
      startTime: 'AO VIVO',
      markets: {
        home: 2.0,
        draw: 3.3,
        away: 2.0,
        handicapHome: 1.9,
        handicapAway: 1.9,
        over: 1.85,
        under: 1.95,
      },
    }
  })
}

export async function fetchUpcomingFixtures(leagueId?: number): Promise<Match[]> {
  if (!FOOTBALL_API_KEY) return []

  const url = leagueId
    ? `${FOOTBALL_API_BASE}/fixtures?league=${leagueId}&next=10`
    : `${FOOTBALL_API_BASE}/fixtures?next=20`

  const data = await apiFetch<{ response: FootballApiFixture[] }>(url, {
    'x-rapidapi-key': FOOTBALL_API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  })
  if (!data) return []

  return data.response.map((fixture) => {
    const league = FOOTBALL_LEAGUE_MAP[fixture.league.id]
    return {
      id: `fb-${fixture.fixture.id}`,
      sport: league?.sport || 'futebol',
      championship: league?.name || fixture.league.name,
      country: league?.country || fixture.league.country,
      home: fixture.teams.home.name,
      away: fixture.teams.away.name,
      homeScore: fixture.goals.home ?? undefined,
      awayScore: fixture.goals.away ?? undefined,
      live: fixture.fixture.status.short === '1H' || fixture.fixture.status.short === '2H' || fixture.fixture.status.short === 'HT',
      minute: fixture.fixture.status.elapsed || undefined,
      startTime: formatStartTime(fixture.fixture.date),
      markets: {
        home: 2.0,
        draw: 3.3,
        away: 2.0,
        handicapHome: 1.9,
        handicapAway: 1.9,
        over: 1.85,
        under: 1.95,
      },
    }
  })
}

export async function fetchStandings(leagueId: number): Promise<FootballApiStanding | null> {
  if (!FOOTBALL_API_KEY) return null

  const url = `${FOOTBALL_API_BASE}/standings?league=${leagueId}`
  const data = await apiFetch<{ response: FootballApiStanding[] }>(url, {
    'x-rapidapi-key': FOOTBALL_API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  })
  if (!data?.response?.[0]) return null

  return data.response[0]
}

// ============ Combined Fetch ============
export async function fetchAllMatches(): Promise<Match[]> {
  const [oddsMatches, liveFixtures, upcomingFixtures] = await Promise.allSettled([
    fetchAllOdds(),
    fetchLiveFixtures(),
    fetchUpcomingFixtures(),
  ])

  const all: Match[] = []
  if (oddsMatches.status === 'fulfilled') all.push(...oddsMatches.value)
  if (liveFixtures.status === 'fulfilled') all.push(...liveFixtures.value)
  if (upcomingFixtures.status === 'fulfilled') all.push(...upcomingFixtures.value)

  // Deduplicate by home/away names
  const seen = new Set<string>()
  return all.filter((m) => {
    const key = `${m.home}-${m.away}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ============ Utility Functions ============
function formatStartTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  if (diffDays === 0) return `Hoje ${time}`
  if (diffDays === 1) return `Amanhã ${time}`
  if (diffDays < 7) {
    const day = date.toLocaleDateString('pt-BR', { weekday: 'short' })
    return `${day} ${time}`
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + time
}

function getChampionshipName(sportKey: string): string {
  const names: Record<string, string> = {
    'soccer_brazil_campeonato': 'Brasileirão Série A',
    'soccer_brazil_serie_b': 'Série B',
    'soccer_uefa_champs_league': 'Champions League',
    'soccer_epl': 'Premier League',
    'soccer_spain_la_liga': 'LaLiga',
    'soccer_copa_libertadores': 'Copa Libertadores',
    'basketball_nba': 'NBA',
    'basketball_euroleague': 'EuroLeague',
    'americanfootball_nfl': 'NFL',
    'baseball_mlb': 'MLB',
    'mma_mixed_martial_arts': 'UFC',
    'tennis_atp': 'ATP Tour',
    'tennis_wta': 'WTA Tour',
  }
  return names[sportKey] || sportKey
}

function getCountryFromSport(sportKey: string): string {
  if (sportKey.includes('brazil')) return 'Brasil'
  if (sportKey.includes('epl')) return 'Inglaterra'
  if (sportKey.includes('spain')) return 'Espanha'
  if (sportKey.includes('nba') || sportKey.includes('nfl') || sportKey.includes('mlb')) return 'EUA'
  if (sportKey.includes('uefa') || sportKey.includes('euroleague')) return 'Europa'
  return 'Mundial'
}

// ============ API Status Check ============
export function getApiStatus() {
  return {
    oddsApi: {
      configured: !!ODDS_API_KEY,
      key: ODDS_API_KEY ? `${ODDS_API_KEY.substring(0, 8)}...` : 'Não configurada',
      docs: 'https://the-odds-api.com',
      freeTier: '500 créditos/mês',
    },
    footballApi: {
      configured: !!FOOTBALL_API_KEY,
      key: FOOTBALL_API_KEY ? `${FOOTBALL_API_KEY.substring(0, 8)}...` : 'Não configurada',
      docs: 'https://www.api-football.com',
      freeTier: '100 requests/dia',
    },
  }
}
