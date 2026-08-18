import type { Match, SportMeta } from './types'

export const SPORTS: SportMeta[] = [
  { id: 'futebol', label: 'Futebol', icon: 'football', color: '#22ff88' },
  { id: 'basquete', label: 'Basquete', icon: 'basketball', color: '#ff9f43' },
  { id: 'tenis', label: 'Tênis', icon: 'tennis', color: '#ffd166' },
  { id: 'esports', label: 'eSports', icon: 'esports', color: '#00d4ff' },
  { id: 'futebol-americano', label: 'Futebol Americano', icon: 'american-football', color: '#ff4d6d' },
  { id: 'baseball', label: 'Baseball', icon: 'baseball', color: '#7aa2ff' },
  { id: 'mma', label: 'MMA / Boxe', icon: 'boxing', color: '#c792ff' },
]

export const MATCHES: Match[] = [
  // ============ Futebol ============
  {
    id: 'f1', sport: 'futebol', championship: 'Brasileirão Série A', country: 'Brasil',
    home: 'Flamengo', away: 'Palmeiras', live: true, minute: 67, homeScore: 2, awayScore: 1, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 1.85, draw: 3.6, away: 4.2, handicapHome: 2.1, handicapAway: 1.75, over: 1.62, under: 2.3 }
  },
  {
    id: 'f2', sport: 'futebol', championship: 'Brasileirão Série A', country: 'Brasil',
    home: 'São Paulo', away: 'Corinthians', live: true, minute: 23, homeScore: 0, awayScore: 0,
    startTime: 'AO VIVO',
    markets: { home: 2.2, draw: 3.1, away: 3.5, handicapHome: 1.9, handicapAway: 1.9, over: 2.4, under: 1.55 }
  },
  {
    id: 'f3', sport: 'futebol', championship: 'Brasileirão Série A', country: 'Brasil',
    home: 'Grêmio', away: 'Internacional', live: false, startTime: 'Hoje 20:30',
    markets: { home: 2.35, draw: 3.2, away: 3.1, handicapHome: 2.05, handicapAway: 1.8, over: 2.15, under: 1.72 }
  },
  {
    id: 'f4', sport: 'futebol', championship: 'Champions League', country: 'Europa',
    home: 'Real Madrid', away: 'Bayern de Munique', live: true, minute: 54, homeScore: 1, awayScore: 1, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 2.4, draw: 3.4, away: 2.9, handicapHome: 1.95, handicapAway: 1.85, over: 1.7, under: 2.1 }
  },
  {
    id: 'f5', sport: 'futebol', championship: 'Premier League', country: 'Inglaterra',
    home: 'Manchester City', away: 'Arsenal', live: false, startTime: 'Hoje 17:00',
    markets: { home: 1.75, draw: 3.9, away: 4.6, handicapHome: 1.95, handicapAway: 1.85, over: 1.65, under: 2.25 }
  },
  {
    id: 'f6', sport: 'futebol', championship: 'LaLiga', country: 'Espanha',
    home: 'Barcelona', away: 'Atlético de Madrid', live: false, startTime: 'Amanhã 16:30',
    markets: { home: 2.05, draw: 3.4, away: 3.6, handicapHome: 1.85, handicapAway: 1.95, over: 1.9, under: 1.9 }
  },
  {
    id: 'f7', sport: 'futebol', championship: 'Série B', country: 'Brasil',
    home: 'Santos', away: 'Vitória', live: false, startTime: 'Hoje 19:00',
    markets: { home: 1.9, draw: 3.3, away: 4.1, handicapHome: 1.95, handicapAway: 1.85, over: 1.85, under: 1.95 }
  },
  {
    id: 'f8', sport: 'futebol', championship: 'Copa Libertadores', country: 'América do Sul',
    home: 'River Plate', away: 'Boca Juniors', live: false, startTime: 'Hoje 21:30', hot: true,
    markets: { home: 2.25, draw: 3.1, away: 3.2, handicapHome: 1.9, handicapAway: 1.9, over: 2.0, under: 1.8 }
  },
  // ============ Basquete ============
  {
    id: 'b1', sport: 'basquete', championship: 'NBA', country: 'EUA',
    home: 'Los Angeles Lakers', away: 'Golden State Warriors', live: true, minute: 32, homeScore: 98, awayScore: 94, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 1.55, draw: 15, away: 2.5, handicapHome: 1.9, handicapAway: 1.9, over: 1.68, under: 2.1 }
  },
  {
    id: 'b2', sport: 'basquete', championship: 'NBB', country: 'Brasil',
    home: 'Flamengo', away: 'Franca', live: false, startTime: 'Hoje 20:00',
    markets: { home: 2.1, draw: 13, away: 1.75, handicapHome: 1.95, handicapAway: 1.85, over: 1.8, under: 2.0 }
  },
  {
    id: 'b3', sport: 'basquete', championship: 'EuroLeague', country: 'Europa',
    home: 'Real Madrid', away: 'Olympiacos', live: false, startTime: 'Hoje 15:30',
    markets: { home: 1.9, draw: 14, away: 1.95, handicapHome: 1.85, handicapAway: 1.95, over: 1.75, under: 2.1 }
  },
  {
    id: 'b4', sport: 'basquete', championship: 'NBA', country: 'EUA',
    home: 'Boston Celtics', away: 'Miami Heat', live: true, minute: 18, homeScore: 56, awayScore: 49,
    startTime: 'AO VIVO',
    markets: { home: 1.62, draw: 16, away: 2.35, handicapHome: 1.88, handicapAway: 1.92, over: 1.72, under: 2.1 }
  },
  // ============ Tênis ============
  {
    id: 't1', sport: 'tenis', championship: 'ATP Finals', country: 'Itália',
    home: 'Carlos Alcaraz', away: 'Jannik Sinner', live: true, minute: 71, homeScore: 1, awayScore: 1, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 1.72, draw: 10, away: 2.1, handicapHome: 1.85, handicapAway: 1.95, over: 1.6, under: 2.3 }
  },
  {
    id: 't2', sport: 'tenis', championship: 'Grand Slam — Roland Garros', country: 'França',
    home: 'Novak Djokovic', away: 'Alexander Zverev', live: false, startTime: 'Hoje 12:00',
    markets: { home: 1.45, draw: 12, away: 2.8, handicapHome: 1.9, handicapAway: 1.9, over: 1.55, under: 2.4 }
  },
  {
    id: 't3', sport: 'tenis', championship: 'WTA 1000', country: 'EUA',
    home: 'Iga Swiatek', away: 'Aryna Sabalenka', live: false, startTime: 'Amanhã 14:00',
    markets: { home: 1.9, draw: 11, away: 1.85, handicapHome: 1.8, handicapAway: 2.0, over: 1.7, under: 2.1 }
  },
  // ============ eSports ============
  {
    id: 'e1', sport: 'esports', championship: 'CS2 Major', country: 'Mundial',
    home: 'FaZe Clan', away: 'Natus Vincere', live: true, minute: 14, homeScore: 6, awayScore: 8, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 2.0, draw: 9, away: 1.8, handicapHome: 1.9, handicapAway: 1.9, over: 1.7, under: 2.1 }
  },
  {
    id: 'e2', sport: 'esports', championship: 'League of Legends — Worlds', country: 'Mundial',
    home: 'T1', away: 'Gen.G', live: false, startTime: 'Hoje 13:00',
    markets: { home: 2.3, draw: 8, away: 1.6, handicapHome: 1.85, handicapAway: 1.95, over: 1.65, under: 2.2 }
  },
  {
    id: 'e3', sport: 'esports', championship: 'VALORANT Champions', country: 'Mundial',
    home: 'Fnatic', away: 'LOUD', live: false, startTime: 'Hoje 18:00',
    markets: { home: 1.7, draw: 9, away: 2.15, handicapHome: 1.9, handicapAway: 1.9, over: 1.75, under: 2.05 }
  },
  // ============ Futebol Americano ============
  {
    id: 'a1', sport: 'futebol-americano', championship: 'NFL', country: 'EUA',
    home: 'Kansas City Chiefs', away: 'Buffalo Bills', live: true, minute: 41, homeScore: 17, awayScore: 20, hot: true,
    startTime: 'AO VIVO',
    markets: { home: 1.85, draw: 12, away: 1.95, handicapHome: 1.95, handicapAway: 1.85, over: 1.7, under: 2.1 }
  },
  {
    id: 'a2', sport: 'futebol-americano', championship: 'NFL', country: 'EUA',
    home: 'Dallas Cowboys', away: 'Philadelphia Eagles', live: false, startTime: 'Hoje 22:15',
    markets: { home: 1.6, draw: 14, away: 2.3, handicapHome: 1.9, handicapAway: 1.9, over: 1.62, under: 2.25 }
  },
  // ============ Baseball ============
  {
    id: 'bb1', sport: 'baseball', championship: 'MLB', country: 'EUA',
    home: 'New York Yankees', away: 'Boston Red Sox', live: true, minute: 23, homeScore: 3, awayScore: 2,
    startTime: 'AO VIVO',
    markets: { home: 1.8, draw: 11, away: 2.05, handicapHome: 1.9, handicapAway: 1.9, over: 1.65, under: 2.2 }
  },
  {
    id: 'bb2', sport: 'baseball', championship: 'MLB', country: 'EUA',
    home: 'Los Angeles Dodgers', away: 'San Diego Padres', live: false, startTime: 'Hoje 23:00',
    markets: { home: 1.55, draw: 12, away: 2.45, handicapHome: 1.88, handicapAway: 1.92, over: 1.6, under: 2.3 }
  },
  // ============ MMA ============
  {
    id: 'm1', sport: 'mma', championship: 'UFC 320', country: 'Mundial',
    home: 'Islam Makhachev', away: 'Charles Oliveira', live: false, startTime: 'Sáb 02:00', hot: true,
    markets: { home: 1.5, draw: 26, away: 2.6, handicapHome: 1.9, handicapAway: 1.9, over: 1.75, under: 2.05 }
  },
  {
    id: 'm2', sport: 'mma', championship: 'Bellator', country: 'Mundial',
    home: 'Patrício Pitbull', away: 'AJ McKee', live: false, startTime: 'Dom 01:30',
    markets: { home: 1.9, draw: 24, away: 1.9, handicapHome: 1.85, handicapAway: 1.95, over: 1.8, under: 2.0 }
  },
]

export const TEAM_COLORS: Record<string, [string, string]> = {
  'Flamengo': ['#e63946', '#c1121f'],
  'Palmeiras': ['#22ff88', '#0a7a42'],
  'São Paulo': ['#f4f6ff', '#8a90a6'],
  'Corinthians': ['#f4f6ff', '#2b2b2b'],
  'Grêmio': ['#4d7cff', '#1d3a8a'],
  'Internacional': ['#ff4d6d', '#a4133c'],
  'Real Madrid': ['#f4f6ff', '#c8ccd8'],
  'Bayern de Munique': ['#ff4d6d', '#a4133c'],
  'Manchester City': ['#00d4ff', '#0b6e8f'],
  'Arsenal': ['#ff4d6d', '#a4133c'],
  'Barcelona': ['#7a5cff', '#4a2db8'],
  'Atlético de Madrid': ['#ff4d6d', '#a4133c'],
  'Santos': ['#f4f6ff', '#5c6279'],
  'Vitória': ['#ff4d6d', '#a4133c'],
  'River Plate': ['#f4f6ff', '#8a90a6'],
  'Boca Juniors': ['#4d7cff', '#1d3a8a'],
  'Los Angeles Lakers': ['#c792ff', '#7a2fd6'],
  'Golden State Warriors': ['#ffd166', '#c99200'],
  'Franca': ['#ff4d6d', '#a4133c'],
  'Boston Celtics': ['#22ff88', '#0a7a42'],
  'Miami Heat': ['#ff9f43', '#c9611a'],
  'FaZe Clan': ['#ff4d6d', '#a4133c'],
  'Natus Vincere': ['#ffd166', '#c99200'],
  'T1': ['#ff4d6d', '#a4133c'],
  'Gen.G': ['#7aa2ff', '#2b4fa8'],
  'Fnatic': ['#ff9f43', '#c9611a'],
  'LOUD': ['#22ff88', '#0a7a42'],
  'Kansas City Chiefs': ['#ff4d6d', '#a4133c'],
  'Buffalo Bills': ['#4d7cff', '#1d3a8a'],
  'Dallas Cowboys': ['#7aa2ff', '#2b4fa8'],
  'Philadelphia Eagles': ['#22ff88', '#0a7a42'],
  'New York Yankees': ['#4d7cff', '#1d3a8a'],
  'Boston Red Sox': ['#ff4d6d', '#a4133c'],
  'Los Angeles Dodgers': ['#4d7cff', '#1d3a8a'],
  'San Diego Padres': ['#ff9f43', '#c9611a'],
  'Islam Makhachev': ['#22ff88', '#0a7a42'],
  'Charles Oliveira': ['#ffd166', '#c99200'],
  'Patrício Pitbull': ['#ff4d6d', '#a4133c'],
  'AJ McKee': ['#00d4ff', '#0b6e8f'],
  'Carlos Alcaraz': ['#ff9f43', '#c9611a'],
  'Jannik Sinner': ['#00d4ff', '#0b6e8f'],
  'Novak Djokovic': ['#f4f6ff', '#8a90a6'],
  'Alexander Zverev': ['#ff4d6d', '#a4133c'],
  'Iga Swiatek': ['#c792ff', '#7a2fd6'],
  'Aryna Sabalenka': ['#ff4d6d', '#a4133c'],
}

export function teamColor(name: string): string {
  const c = TEAM_COLORS[name]
  if (c) return `linear-gradient(135deg, ${c[0]}, ${c[1]})`
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360
  return `linear-gradient(135deg, hsl(${hash}, 70%, 62%), hsl(${(hash + 40) % 360}, 70%, 45%))`
}

export const COUNTRIES = ['Brasil', 'Europa', 'Inglaterra', 'Espanha', 'América do Sul', 'EUA', 'Itália', 'França', 'Mundial']
export const CHAMPIONSHIPS = [
  'Brasileirão Série A', 'Brasileirão Série B', 'Champions League', 'Premier League', 'LaLiga',
  'Copa Libertadores', 'NBA', 'NBB', 'EuroLeague', 'ATP Finals', 'WTA 1000', 'CS2 Major',
  'NFL', 'MLB', 'UFC 320', 'Bellator',
]
