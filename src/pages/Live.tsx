import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Activity, Zap, CornerDownRight, Bell, RotateCw } from 'lucide-react'
import { MATCHES } from '../data/sports'
import type { Match } from '../data/types'
import { useBetSlip } from '../context/BetSlipContext'
import { buildSelection } from '../components/betting/MatchCard'
import { OddsButton, TeamAvatar, LiveBadge, SportIcon } from '../components/betting/OddsButton'
import { Badge, Button, Modal, SectionHeader } from '../components/ui'

function useLiveTick(ms = 60000) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), ms)
    return () => clearInterval(t)
  }, [ms])
  return tick
}

interface LiveStats {
  possession: [number, number]
  shots: [number, number]
  onTarget: [number, number]
  corners: [number, number]
  fouls: [number, number]
}

function genStats(m: Match): LiveStats {
  const h = m.homeScore ?? 0
  const a = m.awayScore ?? 0
  return {
    possession: [50 + ((h - a) * 7 + Math.round(Math.random() * 6 - 3)), 50 + ((a - h) * 7 + Math.round(Math.random() * 6 - 3))],
    shots: [h + a + 2 + Math.round(Math.random() * 3), h + a + 1 + Math.round(Math.random() * 3)],
    onTarget: [h + Math.round(Math.random() * 3), a + Math.round(Math.random() * 3)],
    corners: [Math.round(Math.random() * 6), Math.round(Math.random() * 5)],
    fouls: [5 + Math.round(Math.random() * 5), 4 + Math.round(Math.random() * 6)],
  }
}

function StatBar({ label, left, right }: { label: string; left: number; right: number }) {
  const total = left + right
  const pct = total === 0 ? 50 : Math.round((left / total) * 100)
  return (
    <div className="row" style={{ gap: 10, marginBottom: 12 }}>
      <span className="font-bold text-sm" style={{ width: 26, textAlign: 'right', color: 'var(--neon)' }}>{left}</span>
      <div style={{ flex: 1 }}>
        <div className="text-xs text-muted" style={{ textAlign: 'center', marginBottom: 4 }}>{label}</div>
        <div className="row" style={{ gap: 3 }}>
          <div style={{ flex: pct, height: 6, background: 'var(--grad-neon)', borderRadius: 4 }} />
          <div style={{ flex: 100 - pct, height: 6, background: 'var(--surface-3)', borderRadius: 4 }} />
        </div>
      </div>
      <span className="font-bold text-sm" style={{ width: 26, color: 'var(--text)' }}>{right}</span>
    </div>
  )
}

export function LivePage() {
  useLiveTick(15000)
  const live = useMemo(() => MATCHES.filter((m) => m.live), [])
  const [selected, setSelected] = useState<Match | null>(null)
  const [stats, setStats] = useState<LiveStats | null>(null)
  const [notif, setNotif] = useState(false)
  const [minute, setMinute] = useState<Record<string, number>>({})
  const { selections, addSelection } = useBetSlip()
  const statsRef = useRef<LiveStats | null>(null)

  useEffect(() => {
    if (!selected) return
    statsRef.current = genStats(selected)
    setStats(statsRef.current)
    const t = setInterval(() => {
      statsRef.current = genStats(selected)
      setStats(statsRef.current)
    }, 9000)
    return () => clearInterval(t)
  }, [selected])

  useEffect(() => {
    const t = setInterval(() => {
      setMinute((prev) => {
        const next = { ...prev }
        live.forEach((m) => {
          const cur = next[m.id] ?? m.minute ?? 0
          if (cur < 89) next[m.id] = cur + 1
        })
        return next
      })
    }, 20000)
    return () => clearInterval(t)
  }, [live])

  const liveMarkets = [
    { key: 'home', label: 'Vitória' },
    { key: 'draw', label: 'Empate' },
    { key: 'away', label: 'Vitória visitante' },
  ]

  return (
    <div className="page container">
      <SectionHeader
        title="Apostas ao vivo"
        subtitle={`${live.length} eventos acontecendo agora`}
        action={
          <div className="row" style={{ gap: 10 }}>
            <Button variant="outline" size="sm" onClick={() => setNotif((v) => !v)}>
              <Bell size={15} /> {notif ? 'Alertas ativos' : 'Ativar alertas'}
            </Button>
            <span className="badge badge-live"><Activity size={12} /> AO VIVO</span>
          </div>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))' }}>
        {live.map((m) => (
          <article key={m.id} className="match-card live" style={{ cursor: 'pointer' }} onClick={() => setSelected(m)}>
            <div className="row between">
              <div className="row" style={{ gap: 8 }}>
                <SportIcon sport={m.sport} />
                <span className="text-xs text-muted">{m.championship}</span>
              </div>
              <LiveBadge minute={minute[m.id] ?? m.minute} />
            </div>
            <div className="stack" style={{ marginTop: 14 }}>
              <div className="team-row">
                <TeamAvatar name={m.home} />
                <span className="text-sm font-bold" style={{ flex: 1 }}>{m.home}</span>
                <span className="score-big">{m.homeScore}</span>
              </div>
              <div className="team-row">
                <TeamAvatar name={m.away} />
                <span className="text-sm font-bold" style={{ flex: 1 }}>{m.away}</span>
                <span className="score-big">{m.awayScore}</span>
              </div>
            </div>
            <div className="market-grid" style={{ marginTop: 12 }}>
              {liveMarkets.map((lm) => (
                <OddsButton
                  key={lm.key}
                  odds={m.markets[lm.key as keyof typeof m.markets]}
                  label={lm.label}
                  selected={selections.some((s) => s.id === `${m.id}-${lm.key}`)}
                  onClick={(e) => {
                    e?.stopPropagation()
                    addSelection(buildSelection(m, lm.key, m.markets[lm.key as keyof typeof m.markets]))
                  }}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Live detail */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Placar ao vivo">
        {selected && (
          <div>
            <div className="card" style={{ padding: 18, textAlign: 'center', background: 'var(--surface-2)' }}>
              <Badge tone="live">AO VIVO · {minute[selected.id] ?? selected.minute}'</Badge>
              <div className="row center" style={{ gap: 24, marginTop: 16 }}>
                <div className="stack" style={{ gap: 8, alignItems: 'center', flex: 1 }}>
                  <TeamAvatar name={selected.home} size={52} />
                  <div className="text-sm font-bold">{selected.home}</div>
                </div>
                <div className="stack" style={{ alignItems: 'center' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--neon)', letterSpacing: '0.05em' }}>
                    {selected.homeScore} : {selected.awayScore}
                  </div>
                  <span className="text-xs text-muted">2º tempo</span>
                </div>
                <div className="stack" style={{ gap: 8, alignItems: 'center', flex: 1 }}>
                  <TeamAvatar name={selected.away} size={52} />
                  <div className="text-sm font-bold">{selected.away}</div>
                </div>
              </div>
            </div>

            <h4 className="text-sm" style={{ margin: '18px 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
              Estatísticas da partida
            </h4>
            {stats && (
              <div>
                <StatBar label="Posse de bola (%)" left={Math.max(20, Math.min(80, stats.possession[0]))} right={Math.max(20, Math.min(80, stats.possession[1]))} />
                <StatBar label="Finalizações" left={stats.shots[0]} right={stats.shots[1]} />
                <StatBar label="No gol" left={stats.onTarget[0]} right={stats.onTarget[1]} />
                <StatBar label="Escanteios" left={stats.corners[0]} right={stats.corners[1]} />
                <StatBar label="Faltas" left={stats.fouls[0]} right={stats.fouls[1]} />
              </div>
            )}

            <h4 className="text-sm" style={{ margin: '18px 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
              Mercados ao vivo
            </h4>
            <div className="market-grid">
              {liveMarkets.map((lm) => (
                <OddsButton
                  key={lm.key}
                  odds={selected.markets[lm.key as keyof typeof selected.markets]}
                  label={lm.label}
                  selected={selections.some((s) => s.id === `${selected.id}-${lm.key}`)}
                  onClick={() => addSelection(buildSelection(selected, lm.key, selected.markets[lm.key as keyof typeof selected.markets]))}
                />
              ))}
            </div>
            <div className="market-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <OddsButton odds={selected.markets.over} label="Mais de 2.5" selected={selections.some((s) => s.id === `${selected.id}-over`)} onClick={() => addSelection(buildSelection(selected, 'over', selected.markets.over))} />
              <OddsButton odds={selected.markets.under} label="Menos de 2.5" selected={selections.some((s) => s.id === `${selected.id}-under`)} onClick={() => addSelection(buildSelection(selected, 'under', selected.markets.under))} />
            </div>

            <div className="row" style={{ gap: 6, marginTop: 18, background: 'var(--neon-soft)', border: '1px solid rgba(34,255,136,0.2)', borderRadius: 12, padding: '11px 13px' }}>
              <RotateCw size={14} style={{ color: 'var(--neon)', flexShrink: 0 }} />
              <span className="text-xs text-dim">Odds e estatísticas são simuladas e atualizam em tempo real (demonstração).</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
