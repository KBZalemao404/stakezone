import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, Trophy, SlidersHorizontal } from 'lucide-react'
import { SPORTS, MATCHES, COUNTRIES, CHAMPIONSHIPS } from '../data/sports'
import type { SportId } from '../data/types'
import { MatchCard } from '../components/betting/MatchCard'
import { SportIcon } from '../components/betting/OddsButton'
import { SkeletonCard, SectionHeader } from '../components/ui'

const timeFilters = ['Todos', 'Ao vivo', 'Hoje', 'Amanhã']

export function SportsPage() {
  const [sport, setSport] = useState<SportId | 'todos'>('todos')
  const [champ, setChamp] = useState('todos')
  const [country, setCountry] = useState('todos')
  const [time, setTime] = useState('Todos')
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [sport, champ, country, time])

  const filtered = useMemo(() => {
    return MATCHES.filter((m) => {
      if (sport !== 'todos' && m.sport !== sport) return false
      if (champ !== 'todos' && m.championship !== champ) return false
      if (country !== 'todos' && m.country !== country) return false
      if (time === 'Ao vivo' && !m.live) return false
      if (time === 'Hoje' && (m.live || !m.startTime.includes('Hoje'))) return false
      if (time === 'Amanhã' && !m.startTime.includes('Amanhã')) return false
      if (query && !`${m.home} ${m.away} ${m.championship}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [sport, champ, country, time, query])

  const liveCount = MATCHES.filter((m) => m.live).length

  return (
    <div className="page container">
      <SectionHeader
        title="Esportes"
        subtitle={`${MATCHES.length} partidas disponíveis · ${liveCount} ao vivo agora`}
        action={
          <div className="row" style={{ gap: 8 }}>
            <div className="row" style={{ gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px' }}>
              <Search size={15} className="text-muted" />
              <input
                className="input"
                style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '10px 0', minWidth: 160 }}
                placeholder="Buscar equipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-outline" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={16} /> Filtros
            </button>
          </div>
        }
      />

      {/* Sport tabs */}
      <div className="row wrap" style={{ gap: 8, marginBottom: 18 }}>
        <button className={`sports-tab ${sport === 'todos' ? 'active' : ''}`} onClick={() => setSport('todos')}>
          <Trophy size={15} /> Todos
        </button>
        {SPORTS.map((s) => (
          <button key={s.id} className={`sports-tab ${sport === s.id ? 'active' : ''}`} onClick={() => setSport(s.id)}>
            <span style={{ color: sport === s.id ? 'inherit' : s.color }}><SportIcon sport={s.id} size={15} /></span>
            {s.label}
            <span className="badge badge-muted" style={{ padding: '1px 7px', fontSize: '0.6rem' }}>
              {MATCHES.filter((m) => m.sport === s.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass anim-fade-up" style={{ borderRadius: 16, padding: 18, marginBottom: 20 }}>
          <div className="row wrap" style={{ gap: 16 }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="field-label">Campeonato</label>
              <select className="select" value={champ} onChange={(e) => setChamp(e.target.value)}>
                <option value="todos">Todos os campeonatos</option>
                {CHAMPIONSHIPS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label className="field-label">País / Região</label>
              <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="todos">Todos os países</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label className="field-label">Horário</label>
              <select className="select" value={time} onChange={(e) => setTime(e.target.value)}>
                {timeFilters.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-ghost" style={{ alignSelf: 'flex-end' }} onClick={() => { setChamp('todos'); setCountry('todos'); setTime('Todos'); setQuery(''); setSport('todos') }}>
              <Filter size={15} /> Limpar filtros
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} height={130} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card center" style={{ padding: '50px 24px', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
          <Trophy size={36} style={{ opacity: 0.3 }} />
          <h3 className="text-lg">Nenhuma partida encontrada</h3>
          <p className="text-sm text-muted">Ajuste os filtros ou tente outra busca.</p>
        </div>
      ) : (
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
