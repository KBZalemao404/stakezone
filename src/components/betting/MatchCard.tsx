import type { Match } from '../../data/types'
import { useBetSlip } from '../../context/BetSlipContext'
import { OddsButton, TeamAvatar, LiveBadge, SportIcon } from './OddsButton'

export function buildSelection(match: Match, marketKey: string, odds: number) {
  const marketMap: Record<string, { market: string; label: string; pick: string }> = {
    home: { market: 'home', label: 'Vitória', pick: match.home },
    draw: { market: 'draw', label: 'Empate', pick: 'Empate' },
    away: { market: 'away', label: 'Vitória', pick: match.away },
    handicapHome: { market: 'handicapHome', label: 'Handicap', pick: `${match.home} -1.5` },
    handicapAway: { market: 'handicapAway', label: 'Handicap', pick: `${match.away} +1.5` },
    over: { market: 'over', label: 'Total de gols', pick: 'Mais de 2.5' },
    under: { market: 'under', label: 'Total de gols', pick: 'Menos de 2.5' },
  }
  const m = marketMap[marketKey]
  return {
    id: `${match.id}-${marketKey}`,
    matchId: match.id,
    sport: match.sport,
    home: match.home,
    away: match.away,
    championship: match.championship,
    market: m.market,
    marketLabel: m.label,
    pick: m.pick,
    odds,
    live: match.live,
    liveScore: match.live ? `${match.homeScore ?? 0} x ${match.awayScore ?? 0}` : undefined,
  }
}

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { selections, addSelection } = useBetSlip()
  const isSelected = (key: string) => selections.some((s) => s.id === `${match.id}-${key}`)

  const oddsCfg = [
    { key: 'home', label: '1', pick: match.home },
    { key: 'draw', label: 'X', pick: 'Empate' },
    { key: 'away', label: '2', pick: match.away },
  ]

  return (
    <article className={`match-card${match.live ? ' live' : ''}`}>
      <div className="row between wrap" style={{ gap: 8 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="badge badge-muted" style={{ textTransform: 'none' }}>
            <SportIcon sport={match.sport} size={12} /> {match.championship}
          </span>
          {match.hot && <span className="badge badge-gold">Popular</span>}
        </div>
        {match.live ? (
          <LiveBadge minute={match.minute} />
        ) : (
          <span className="badge badge-blue">{match.startTime}</span>
        )}
      </div>

      <div className="stack" style={{ marginTop: 14 }}>
        <div className="team-row">
          <TeamAvatar name={match.home} />
          <span className="text-sm font-bold" style={{ flex: 1 }}>{match.home}</span>
          {match.live && <span className="score-big">{match.homeScore}</span>}
        </div>
        <div className="team-row">
          <TeamAvatar name={match.away} />
          <span className="text-sm font-bold" style={{ flex: 1 }}>{match.away}</span>
          {match.live && <span className="score-big">{match.awayScore}</span>}
        </div>
      </div>

      {!compact && (
        <>
          <div className="market-label">Vitória · Empate · Vitória visitante</div>
          <div className="market-grid">
            {oddsCfg.map((o) => (
              <OddsButton
                key={o.key}
                odds={match.markets[o.key as keyof typeof match.markets]}
                label={o.label}
                selected={isSelected(o.key)}
                onClick={() => addSelection(buildSelection(match, o.key, match.markets[o.key as keyof typeof match.markets]))}
              />
            ))}
          </div>

          <div className="market-label">Handicap ±1.5</div>
          <div className="market-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <OddsButton odds={match.markets.handicapHome} label={match.home} selected={isSelected('handicapHome')} onClick={() => addSelection(buildSelection(match, 'handicapHome', match.markets.handicapHome))} />
            <OddsButton odds={match.markets.handicapAway} label={match.away} selected={isSelected('handicapAway')} onClick={() => addSelection(buildSelection(match, 'handicapAway', match.markets.handicapAway))} />
          </div>

          <div className="market-label">Total de gols/pontos · ±2.5</div>
          <div className="market-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <OddsButton odds={match.markets.over} label="Mais de 2.5" selected={isSelected('over')} onClick={() => addSelection(buildSelection(match, 'over', match.markets.over))} />
            <OddsButton odds={match.markets.under} label="Menos de 2.5" selected={isSelected('under')} onClick={() => addSelection(buildSelection(match, 'under', match.markets.under))} />
          </div>
        </>
      )}
    </article>
  )
}
