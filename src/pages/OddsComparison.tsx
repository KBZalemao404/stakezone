import { useState, useMemo } from 'react'
import { TrendingUp, ArrowUpDown, Filter, RefreshCw, Zap, BarChart3 } from 'lucide-react'
import { Button, Badge, SectionHeader, Money } from '../components/ui'
import { useLiveOdds } from '../hooks/useLiveOdds'
import { SPORTS } from '../data/sports'
import type { Match, SportId } from '../data/types'

export function OddsComparisonPage() {
  const { matches, loading, lastUpdated, isUsingRealData, refresh, filterBySport } = useLiveOdds(30000)
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all')
  const [sortBy, setSortBy] = useState<'odds' | 'time' | 'hot'>('hot')

  const filtered = useMemo(() => {
    let result = filterBySport(selectedSport)
    
    if (sortBy === 'odds') {
      result = [...result].sort((a, b) => a.markets.home - b.markets.home)
    } else if (sortBy === 'hot') {
      result = [...result].sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0))
    }
    
    return result
  }, [filterBySport, selectedSport, sortBy])

  const liveMatches = filtered.filter((m) => m.live)
  const upcomingMatches = filtered.filter((m) => !m.live)

  return (
    <div className="page container">
      <SectionHeader
        title="Odds & Probabilidades"
        subtitle={isUsingRealData 
          ? `Dados reais de casas de apostas · Atualizado ${lastUpdated ? formatTime(lastUpdated) : ''}`
          : 'Dados de demonstração · Configure APIs para odds reais'
        }
        action={
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <Badge tone={isUsingRealData ? 'neon' : 'muted'}>
              {isUsingRealData ? <><Zap size={12} /> Tempo real</> : '⚪ Demo'}
            </Badge>
            <Button size="sm" variant="outline" onClick={refresh}>
              <RefreshCw size={14} />
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="row wrap" style={{ gap: 10, marginBottom: 20 }}>
        <div className="row" style={{ gap: 6, overflowX: 'auto', flex: 1 }}>
          <button
            className={`sports-tab ${selectedSport === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedSport('all')}
          >
            Todos
          </button>
          {SPORTS.map((s) => (
            <button
              key={s.id}
              className={`sports-tab ${selectedSport === s.id ? 'active' : ''}`}
              onClick={() => setSelectedSport(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="row" style={{ gap: 6 }}>
          <button
            className={`sports-tab ${sortBy === 'hot' ? 'active' : ''}`}
            onClick={() => setSortBy('hot')}
          >
            🔥 Popular
          </button>
          <button
            className={`sports-tab ${sortBy === 'odds' ? 'active' : ''}`}
            onClick={() => setSortBy('odds')}
          >
            <ArrowUpDown size={12} /> Odds
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row wrap" style={{ gap: 12, marginBottom: 20 }}>
        <StatBadge label="Ao vivo" value={liveMatches.length} color="var(--neon)" />
        <StatBadge label="Próximos" value={upcomingMatches.length} color="var(--gold)" />
        <StatBadge label="Total" value={filtered.length} color="var(--blue)" />
        <StatBadge label="Esportes" value={new Set(filtered.map((m) => m.sport)).size} color="var(--purple, #c792ff)" />
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="row" style={{ gap: 8, marginBottom: 14, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon)', animation: 'pulse 2s infinite' }} />
            <h3 style={{ fontSize: '1.1rem' }}>AO VIVO</h3>
            <Badge tone="live">🔴 {liveMatches.length} jogos</Badge>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {liveMatches.map((match) => (
              <OddsCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>PRÓXIMOS JOGOS</h3>
          <div className="stack" style={{ gap: 10 }}>
            {upcomingMatches.map((match) => (
              <OddsCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="card center" style={{ padding: 60, flexDirection: 'column', gap: 8 }}>
          <BarChart3 size={40} style={{ color: 'var(--muted)' }} />
          <h3>Nenhum jogo encontrado</h3>
          <p className="text-sm text-muted">Tente selecionar outro esporte</p>
        </div>
      )}
    </div>
  )
}

function OddsCard({ match }: { match: Match }) {
  const odds = match.markets
  const bestHome = odds.home
  const bestDraw = odds.draw
  const bestAway = odds.away

  // Calculate implied probabilities
  const total = (1 / bestHome) + (1 / bestDraw) + (1 / bestAway)
  const probHome = ((1 / bestHome) / total * 100).toFixed(1)
  const probDraw = ((1 / bestDraw) / total * 100).toFixed(1)
  const probAway = ((1 / bestAway) / total * 100).toFixed(1)

  const margin = ((total - 1) * 100).toFixed(1)

  return (
    <div className="card card-hover" style={{ padding: 16 }}>
      {/* Header */}
      <div className="row between wrap" style={{ gap: 8, marginBottom: 12 }}>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <Badge tone={match.live ? 'live' : 'blue'}>{match.championship}</Badge>
          {match.hot && <Badge tone="gold">🔥 Hot</Badge>}
        </div>
        <span className="text-xs text-muted">{match.startTime}</span>
      </div>

      {/* Teams */}
      <div className="row between" style={{ marginBottom: 14 }}>
        <div>
          <div className="font-bold" style={{ fontSize: '1rem' }}>{match.home}</div>
          {match.live && match.homeScore !== undefined && (
            <span className="text-lg font-display" style={{ color: 'var(--neon)' }}>{match.homeScore}</span>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          {match.live ? (
            <Badge tone="live" className="text-xs">⏱ {match.minute}'</Badge>
          ) : (
            <span className="text-xs text-muted">VS</span>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-bold" style={{ fontSize: '1rem' }}>{match.away}</div>
          {match.live && match.awayScore !== undefined && (
            <span className="text-lg font-display" style={{ color: 'var(--neon)' }}>{match.awayScore}</span>
          )}
        </div>
      </div>

      {/* Odds Buttons */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        <OddsButton label="Casa" odds={bestHome} probability={probHome} />
        <OddsButton label="Empate" odds={bestDraw} probability={probDraw} />
        <OddsButton label="Fora" odds={bestAway} probability={probAway} />
      </div>

      {/* Additional Markets */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <OddsButton label={`Handicap ${match.home}`} odds={odds.handicapHome} small />
        <OddsButton label={`Handicap ${match.away}`} odds={odds.handicapAway} small />
        <OddsButton label="Mais de 2.5" odds={odds.over} small />
        <OddsButton label="Menos de 2.5" odds={odds.under} small />
      </div>

      {/* Margin Info */}
      <div className="row between" style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <span className="text-xs text-muted">Margem da casa: {margin}%</span>
        <span className="text-xs text-muted">{match.country}</span>
      </div>
    </div>
  )
}

function OddsButton({ label, odds, probability, small }: { 
  label: string; odds: number; probability?: string; small?: boolean 
}) {
  return (
    <button
      className="card card-hover"
      style={{
        padding: small ? '8px 10px' : '12px 14px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        borderRadius: 10,
        background: 'var(--surface)',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div className="text-xs text-muted" style={{ marginBottom: 4 }}>{label}</div>
      <div className="font-display font-bold" style={{ 
        color: 'var(--neon)', 
        fontSize: small ? '0.9rem' : '1.05rem' 
      }}>
        {odds.toFixed(2)}
      </div>
      {probability && (
        <div className="text-xs text-muted" style={{ marginTop: 2 }}>{probability}%</div>
      )}
    </button>
  )
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="row" style={{ 
      gap: 8, padding: '8px 14px', borderRadius: 10, 
      background: `${color}15`, border: `1px solid ${color}30`,
      alignItems: 'center'
    }}>
      <span className="font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
