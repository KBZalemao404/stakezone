import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Flame, Zap, ArrowRight, ShieldCheck, Gift, ShoppingBag, Crown, Wallet, Radio } from 'lucide-react'
import { Button, Badge, SectionHeader, Money } from '../components/ui'
import { MATCHES, SPORTS, teamColor } from '../data/sports'
import { MatchCard } from '../components/betting/MatchCard'
import { SportIcon } from '../components/betting/OddsButton'
import { useAuth } from '../context/AuthContext'

function Particles({ count = 18 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        bottom: `${(i * 53) % 100}%`,
        delay: `${(i * 0.4) % 6}s`,
        duration: `${5 + ((i * 1.7) % 5)}s`,
        size: 2 + (i % 4),
        gold: i % 4 === 0,
      })),
    [count]
  )
  return (
    <div className="particles" aria-hidden>
      {parts.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            background: p.gold ? 'var(--gold)' : 'var(--neon)',
            boxShadow: p.gold ? '0 0 8px var(--gold)' : '0 0 8px var(--neon-glow)',
          }}
        />
      ))}
    </div>
  )
}

function HeroVisual() {
  const featured = MATCHES.filter((m) => m.live).slice(0, 3)
  return (
    <div className="hero-visual anim-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass" style={{ borderRadius: 28, padding: 24, width: 400, boxShadow: 'var(--shadow-lg)' }}>
        <div className="row between" style={{ marginBottom: 16 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge badge-live"><Radio size={12} /> AO VIVO</span>
            <span className="badge badge-muted">Agora</span>
          </div>
          <span className="text-xs text-muted">Melhores odds</span>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          {featured.map((m) => (
            <div key={m.id} className="card" style={{ padding: 14, borderRadius: 16 }}>
              <div className="row between">
                <div className="row" style={{ gap: 8 }}>
                  <span className="team-avatar" style={{ background: teamColor(m.home), width: 26, height: 26, fontSize: 9 }}>{m.home[0]}</span>
                  <span className="text-sm font-bold">{m.home}</span>
                </div>
                <span className="score-big">{m.homeScore}</span>
              </div>
              <div className="row between" style={{ marginTop: 6 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="team-avatar" style={{ background: teamColor(m.away), width: 26, height: 26, fontSize: 9 }}>{m.away[0]}</span>
                  <span className="text-sm font-bold">{m.away}</span>
                </div>
                <span className="score-big">{m.awayScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="float-chip" style={{ top: -18, left: -40 }}>
        <span style={{ color: 'var(--neon)' }}><TrendingUp size={18} /></span>
        <div>
          <div className="fc-label">Odd do dia</div>
          <div className="fc-value" style={{ color: 'var(--neon)' }}>3.85</div>
        </div>
      </div>
      <div className="float-chip" style={{ bottom: -16, right: -24, animationDelay: '1.5s' }}>
        <span style={{ color: 'var(--gold)' }}><Crown size={18} /></span>
        <div>
          <div className="fc-label">Bônus de boas-vindas</div>
          <div className="fc-value" style={{ color: 'var(--gold)' }}>100% até R$ 1.000</div>
        </div>
      </div>
    </div>
  )
}

export function Home() {
  const { isLogged, user } = useAuth()
  const liveMatches = MATCHES.filter((m) => m.live)
  const upcoming = MATCHES.filter((m) => !m.live).slice(0, 6)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="page">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <Particles />
        <div className="container" style={{ position: 'relative', width: '100%' }}>
          <div className="grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center', gap: 40 }}>
            <div className="anim-fade-up">
              <span className="hero-eyebrow"><Zap size={13} /> Plataforma oficial de apostas e loja</span>
              <h1 className="hero-title" style={{ marginTop: 20 }}>
                Sua próxima aposta começa aqui
              </h1>
              <p className="hero-sub" style={{ marginTop: 18 }}>
                Aposte em futebol, basquete, tênis, eSports e muito mais com odds competitivas e ao vivo.
                Compre na loja oficial e aproveite bônus exclusivos. <strong className="text-dim">Prototipo demo — sem dinheiro real.</strong>
              </p>
              <div className="row wrap" style={{ gap: 12, marginTop: 30 }}>
                <Link to="/auth?mode=register">
                  <Button size="lg">Criar conta <ArrowRight size={18} /></Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button variant="outline" size="lg">Entrar</Button>
                </Link>
              </div>

              <div className="row wrap" style={{ gap: 20, marginTop: 36 }}>
                {[
                  { icon: Gift, label: 'Bônus 100%', sub: 'até R$ 1.000' },
                  { icon: Radio, label: 'Apostas ao vivo', sub: 'milhares de mercados' },
                  { icon: Wallet, label: 'Saque rápido', sub: 'via Pix (demo)' },
                  { icon: ShoppingBag, label: 'Loja oficial', sub: 'produtos exclusivos' },
                ].map((f, i) => (
                  <div key={i} className="row" style={{ gap: 9 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface-3)', display: 'grid', placeItems: 'center', color: 'var(--neon)' }}>
                      <f.icon size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-bold">{f.label}</div>
                      <div className="text-xs text-muted">{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ============ SPORTS STRIP ============ */}
      <section className="container" style={{ marginBottom: 40 }}>
        <div className="row wrap" style={{ gap: 10, justifyContent: 'center' }}>
          {SPORTS.map((s) => (
            <Link key={s.id} to="/esportes" className="sports-tab">
              <span style={{ color: s.color }}><SportIcon sport={s.id} /></span>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ============ PROMO BANNER ============ */}
      <section className="container">
        <div className="promo-card" style={{ background: 'linear-gradient(120deg, #0b3d1e, #0a1430 60%, #160d24)' }}>
          <div className="promo-bg" style={{ background: 'radial-gradient(500px 200px at 80% 20%, rgba(34,255,136,0.25), transparent 60%), radial-gradient(400px 200px at 20% 100%, rgba(0,212,255,0.15), transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Badge tone="gold">Bônus de boas-vindas</Badge>
            <h2 className="text-2xl" style={{ marginTop: 12, letterSpacing: '-0.02em' }}>
              Dobre seu primeiro depósito <span className="text-neon">até R$ 1.000</span>
            </h2>
            <p className="text-dim text-sm" style={{ maxWidth: 520, marginTop: 8 }}>
              Seja bem-vindo à StakeZone. Deposite e receba 100% de bônus em créditos de aposta, além de 20% de
              desconto na sua primeira compra na loja. Sujeito a termos e condições.
            </p>
            <div className="row wrap" style={{ gap: 12, marginTop: 22 }}>
              <Link to="/promocoes"><Button variant="gold">Ver promoções <ArrowRight size={16} /></Button></Link>
              {isLogged && <span className="text-sm text-muted" style={{ alignSelf: 'center' }}>Olá, {user.name.split(' ')[0]}!</span>}
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVE MATCHES ============ */}
      <section className="container section">
        <SectionHeader
          title="Apostas ao vivo"
          subtitle="Acontecendo agora — odds em tempo real"
          action={<Link to="/ao-vivo" className="btn btn-outline btn-sm">Ver todos <ArrowRight size={14} /></Link>}
        />
        {loading ? (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {[1, 2, 3].map((i) => <div key={i} className="card" style={{ padding: 16 }}><div className="skeleton" style={{ height: 160 }} /></div>)}
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {liveMatches.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </section>

      {/* ============ UPCOMING ============ */}
      <section className="container section">
        <SectionHeader
          title="Próximas partidas"
          subtitle="As melhores odds para os próximos jogos"
          action={<Link to="/esportes" className="btn btn-outline btn-sm">Ver todos <ArrowRight size={14} /></Link>}
        />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      {/* ============ STORE TEASER ============ */}
      <section className="container section">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <Link to="/loja" className="promo-card card-hover" style={{ background: 'linear-gradient(140deg, #12121c, #1a1a29)' }}>
            <div className="promo-bg" style={{ background: 'radial-gradient(400px 180px at 85% 15%, rgba(255,209,102,0.2), transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Badge tone="gold">Loja oficial</Badge>
              <h3 className="text-xl" style={{ marginTop: 10 }}>Vista a sua torcida</h3>
              <p className="text-sm text-muted" style={{ marginTop: 6 }}>Camisetas, bonés e acessórios premium com desconto para membros.</p>
              <span className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Explorar loja <ArrowRight size={14} /></span>
            </div>
          </Link>
          <Link to="/promocoes" className="promo-card card-hover" style={{ background: 'linear-gradient(140deg, #0d1b2a, #16111f)' }}>
            <div className="promo-bg" style={{ background: 'radial-gradient(400px 180px at 15% 85%, rgba(0,212,255,0.2), transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Badge>Cashback ao vivo</Badge>
              <h3 className="text-xl" style={{ marginTop: 10 }}>10% de volta em apostas ao vivo</h3>
              <p className="text-sm text-muted" style={{ marginTop: 6 }}>Recupere parte das suas apostas perdidas toda semana.</p>
              <span className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Saiba mais <ArrowRight size={14} /></span>
            </div>
          </Link>
          <Link to="/conta" className="promo-card card-hover" style={{ background: 'linear-gradient(140deg, #14240e, #16111f)' }}>
            <div className="promo-bg" style={{ background: 'radial-gradient(400px 180px at 80% 80%, rgba(34,255,136,0.2), transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Badge>Programa VIP</Badge>
              <h3 className="text-xl" style={{ marginTop: 10 }}>Suba de nível e ganhe mais</h3>
              <p className="text-sm text-muted" style={{ marginTop: 6 }}>Cashback maior, odds exclusivas e frete grátis na loja.</p>
              <span className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Ver benefícios <ArrowRight size={14} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* ============ TRUST / RESPONSIBLE ============ */}
      <section className="container section">
        <div className="card" style={{ padding: '26px 24px' }}>
          <div className="row wrap between" style={{ gap: 20 }}>
            <div className="row" style={{ gap: 14, maxWidth: 620 }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--gold-soft)', color: 'var(--gold)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </span>
              <div>
                <h3 className="text-lg">Jogue com responsabilidade</h3>
                <p className="text-sm text-muted" style={{ marginTop: 6 }}>
                  A StakeZone é um ambiente de demonstração. Nenhum valor real é movimentado. Proibido para menores
                  de 18 anos. Se o jogo deixar de ser diversão, procure ajuda: jogo-responsavel@stakezone.com.br.
                </p>
              </div>
            </div>
            <div className="row wrap" style={{ gap: 10 }}>
              <span className="responsible-badge"><ShieldCheck size={16} /> +18</span>
              <span className="responsible-badge"><Flame size={16} /> Demo</span>
              <span className="badge badge-muted" style={{ fontSize: '0.75rem' }}>Termos e condições aplicáveis</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
