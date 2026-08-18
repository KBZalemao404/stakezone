import { useState, useEffect, useCallback } from 'react'
import { Zap, RefreshCw, Clock, Radio } from 'lucide-react'
import { Button, Badge, SectionHeader, Skeleton } from '../components/ui'
import { fetchLiveFixtures, type FootballApiFixture } from '../services/api'
import { MATCHES as MOCK_MATCHES } from '../data/sports'
import type { Match } from '../data/types'

export function LiveScoresPage() {
  const [apiMatches, setApiMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isUsingRealData, setIsUsingRealData] = useState(false)
  const [selectedSport, setSelectedSport] = useState<string>('all')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const liveMatches = await fetchLiveFixtures()
      if (liveMatches.length > 0) {
        setApiMatches(liveMatches)
        setIsUsingRealData(true)
      } else {
        setIsUsingRealData(false)
      }
      setLastUpdated(new Date())
    } catch {
      setIsUsingRealData(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchData])

  const displayMatches = isUsingRealData ? apiMatches : MOCK_MATCHES.filter((m) => m.live)
  const liveMatches = displayMatches.filter((m) => m.live)

  const sports = ['all', ...new Set(displayMatches.map((m) => m.sport))]
  const filtered = selectedSport === 'all' 
    ? liveMatches 
    : liveMatches.filter((m) => m.sport === selectedSport)

  return (
    <div className="page container">
      <SectionHeader
        title="Ao Vivo"
        subtitle={isUsingRealData 
          ? `Placares em tempo real · Atualizado ${lastUpdated ? formatTime(lastUpdated) : ''}`
          : 'Dados de demonstração'
        }
        action={
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <Badge tone={isUsingRealData ? 'live' : 'muted'}>
              {isUsingRealData ? <><Radio size={12} /> AO VIVO</> : '⚪ Demo'}
            </Badge>
            <Button size="sm" variant="outline" onClick={fetchData}>
              <RefreshCw size={14} />
            </Button>
          </div>
        }
      />

      {/* Auto-refresh indicator */}
      <div className="row" style={{ gap: 6, marginBottom: 16, alignItems: 'center' }}>
        <span style={{ 
          width: 8, height: 8, borderRadius: '50%', 
          background: 'var(--neon)', 
          animation: 'pulse 2s infinite' 
        }} />
        <span className="text-xs text-muted">Atualização automática a cada 30 segundos</span>
      </div>

      {/* Sport Filter */}
      <div className="row" style={{ gap: 6, overflowX: 'auto', marginBottom: 20 }}>
        {sports.map((sport) => (
          <button
            key={sport}
            className={`sports-tab ${selectedSport === sport ? 'active' : ''}`}
            onClick={() => setSelectedSport(sport)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {sport === 'all' ? 'Todos' : sport.charAt(0).toUpperCase() + sport.slice(1)}
          </button>
        ))}
      </div>

      {/* Live Count */}
      <div className="row" style={{ gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <Zap size={16} style={{ color: 'var(--neon)' }} />
        <span className="font-bold">{filtered.length} jogos ao vivo</span>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <Skeleton height={20} width="60%" />
              <div style={{ height: 12 }} />
              <Skeleton height={40} />
              <div style={{ height: 12 }} />
              <Skeleton height={30} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {filtered.map((match) => (
            <LiveCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="card center" style={{ padding: 60, flexDirection: 'column', gap: 8 }}>
          <Clock size={40} style={{ color: 'var(--muted)' }} />
          <h3>Nenhum jogo ao vivo</h3>
          <p className="text-sm text-muted">Volte mais tarde para acompanhar jogos ao vivo</p>
        </div>
      )}
    </div>
  )
}

function LiveCard({ match }: { match: Match }) {
  const minutesAgo = match.minute || 0
  const progress = Math.min((minutesAgo / 90) * 100, 100)

  return (
    <div className="card card-hover luminous" style={{ padding: 16 }}>
      {/* Header */}
      <div className="row between" style={{ marginBottom: 10 }}>
        <Badge tone="live" className="text-xs">🔴 AO VIVO</Badge>
        <div className="row" style={{ gap: 6, alignItems: 'center' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', animation: 'pulse 1.5s infinite' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--neon)' }}>{minutesAgo}'</span>
        </div>
      </div>

      {/* League */}
      <div className="text-xs text-muted" style={{ marginBottom: 8 }}>{match.championship}</div>

      {/* Score */}
      <div className="row between" style={{ marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="font-bold">{match.home}</div>
        </div>
        <div className="row" style={{ gap: 6, alignItems: 'center' }}>
          <span className="font-display text-xl font-bold" style={{ color: 'var(--neon)' }}>
            {match.homeScore ?? '-'}
          </span>
          <span className="text-muted">x</span>
          <span className="font-display text-xl font-bold" style={{ color: 'var(--neon)' }}>
            {match.awayScore ?? '-'}
          </span>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div className="font-bold">{match.away}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        height: 3, borderRadius: 2, background: 'var(--surface-3)', 
        overflow: 'hidden', marginBottom: 12 
      }}>
        <div style={{ 
          height: '100%', width: `${progress}%`, borderRadius: 2,
          background: 'linear-gradient(90deg, var(--neon), var(--blue, #00d4ff))',
          transition: 'width 0.5s'
        }} />
      </div>

      {/* Quick Odds */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <QuickOdds label="Casa" odds={match.markets.home} />
        <QuickOdds label="Empate" odds={match.markets.draw} />
        <QuickOdds label="Fora" odds={match.markets.away} />
      </div>
    </div>
  )
}

function QuickOdds({ label, odds }: { label: string; odds: number }) {
  return (
    <button
      className="card"
      style={{
        padding: '6px 8px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--surface)',
        color: 'var(--text)',
        cursor: 'pointer',
      }}
    >
      <div className="text-xs text-muted" style={{ fontSize: '0.65rem' }}>{label}</div>
      <div className="font-bold" style={{ color: 'var(--neon)', fontSize: '0.85rem' }}>
        {odds.toFixed(2)}
      </div>
    </button>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
