import { useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus, RefreshCw, Globe } from 'lucide-react'
import { Button, Badge, SectionHeader, Skeleton } from '../components/ui'
import { useStandings, LEAGUES, LEAGUE_INFO, getMockStandings } from '../hooks/useStandings'
import type { StandingTeam } from '../services/api'

const FORM_COLORS: Record<string, string> = {
  W: 'var(--neon)',
  D: 'var(--gold)',
  L: 'var(--red)',
}

export function StandingsPage() {
  const [selectedLeague, setSelectedLeague] = useState<number>(LEAGUES.BRASILEIRAO)
  const { standings, loading, error, isUsingRealData, leagueInfo, refresh } = useStandings(selectedLeague)

  const displayStandings = standings || getMockStandings(selectedLeague)

  return (
    <div className="page container">
      <SectionHeader
        title="Classificações"
        subtitle={isUsingRealData ? 'Dados em tempo real via API-Football' : 'Dados de demonstração'}
        action={
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <Badge tone={isUsingRealData ? 'neon' : 'muted'}>
              {isUsingRealData ? '🟢 Ao vivo' : '⚪ Demo'}
            </Badge>
            <Button size="sm" variant="outline" onClick={refresh}>
              <RefreshCw size={14} />
            </Button>
          </div>
        }
      />

      {/* League Selector */}
      <div className="row" style={{ gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {Object.entries(LEAGUE_INFO).map(([id, info]) => (
          <button
            key={id}
            className={`sports-tab ${selectedLeague === Number(id) ? 'active' : ''}`}
            onClick={() => setSelectedLeague(Number(id))}
            style={{ whiteSpace: 'nowrap' }}
          >
            {info.flag} {info.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="card" style={{ padding: 16, marginBottom: 16, borderLeft: '3px solid var(--red)' }}>
          <p className="text-sm text-red">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="stack" style={{ gap: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '12px 16px' }}>
              <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                <Skeleton width={24} height={24} radius={6} />
                <Skeleton width={140} height={16} />
                <div style={{ flex: 1 }} />
                <Skeleton width={40} height={14} />
                <Skeleton width={40} height={14} />
                <Skeleton width={40} height={14} />
                <Skeleton width={50} height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '40px 1fr 50px 50px 50px 50px 70px 100px 60px',
            gap: 8, 
            padding: '12px 16px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.7rem',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}>
            <span>#</span>
            <span>Time</span>
            <span style={{ textAlign: 'center' }}>P</span>
            <span style={{ textAlign: 'center' }}>J</span>
            <span style={{ textAlign: 'center' }}>V</span>
            <span style={{ textAlign: 'center' }}>D</span>
            <span style={{ textAlign: 'center' }}>GP</span>
            <span style={{ textAlign: 'center' }}>SG</span>
            <span style={{ textAlign: 'center' }}>FD</span>
          </div>

          {/* Table Rows */}
          {displayStandings.map((team, idx) => (
            <StandingRow key={team.team.id || idx} team={team} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="row wrap" style={{ gap: 16, marginTop: 16, padding: '12px 16px' }}>
        <Legend color="var(--neon)" text="Classificação para copas" />
        <Legend color="var(--gold)" text="Repescagem" />
        <Legend color="var(--red)" text="Rebaixamento" />
      </div>
    </div>
  )
}

function StandingRow({ team }: { team: StandingTeam }) {
  const position = team.rank
  const isTop4 = position <= 4
  const isRelegation = position >= 17

  const formColor = isTop4 ? 'var(--neon)' : isRelegation ? 'var(--red)' : 'var(--text)'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 50px 50px 50px 50px 70px 100px 60px',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
        fontSize: '0.85rem',
        background: isTop4 ? 'rgba(34,255,136,0.03)' : isRelegation ? 'rgba(255,77,109,0.03)' : 'transparent',
        transition: 'background 0.2s',
      }}
      className="card-hover"
    >
      <span style={{
        width: 24, height: 24, borderRadius: 6,
        background: isTop4 ? 'var(--neon-soft)' : isRelegation ? 'rgba(255,77,109,0.1)' : 'var(--surface-3)',
        color: formColor,
        display: 'grid', placeItems: 'center',
        fontSize: '0.75rem', fontWeight: 700
      }}>
        {position}
      </span>

      <div className="row" style={{ gap: 10, alignItems: 'center' }}>
        {team.team.logo && (
          <img src={team.team.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
        )}
        <span className="font-bold" style={{ color: formColor }}>{team.team.name}</span>
      </div>

      <span style={{ textAlign: 'center', fontWeight: 700, color: 'var(--neon)' }}>{team.points}</span>
      <span style={{ textAlign: 'center', color: 'var(--muted)' }}>{team.all.played}</span>
      <span style={{ textAlign: 'center', color: 'var(--neon)' }}>{team.all.win}</span>
      <span style={{ textAlign: 'center', color: 'var(--gold)' }}>{team.all.draw}</span>
      <span style={{ textAlign: 'center' }}>{team.all.goals.for}:{team.all.goals.against}</span>
      <span style={{ textAlign: 'center' }}>
        <span style={{ 
          color: team.goalsDiff > 0 ? 'var(--neon)' : team.goalsDiff < 0 ? 'var(--red)' : 'var(--muted)',
          fontWeight: 600
        }}>
          {team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}
        </span>
      </span>
      <div className="row" style={{ gap: 2, justifyContent: 'center' }}>
        {team.form.slice(-5).split('').map((result, i) => (
          <span key={i} style={{
            width: 14, height: 14, borderRadius: 3,
            background: FORM_COLORS[result] || 'var(--surface-3)',
            display: 'grid', placeItems: 'center',
            fontSize: '0.55rem', fontWeight: 700, color: '#000'
          }}>
            {result}
          </span>
        ))}
      </div>
    </div>
  )
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <div className="row" style={{ gap: 6, alignItems: 'center' }}>
      <span style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
      <span className="text-xs text-muted">{text}</span>
    </div>
  )
}
