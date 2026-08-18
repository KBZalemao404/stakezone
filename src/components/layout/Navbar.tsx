import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Search, Bell, ShoppingBag, LogOut, User, Wallet, Settings, ChevronDown,
} from 'lucide-react'
import { Logo, Avatar } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Money } from '../ui'

const links = [
  { to: '/esportes', label: 'Esportes' },
  { to: '/ao-vivo', label: 'Ao vivo' },
  { to: '/odds', label: 'Odds' },
  { to: '/classificacoes', label: 'Classificações' },
  { to: '/loja', label: 'Loja' },
  { to: '/promocoes', label: 'Promoções' },
]

export function Navbar() {
  const { user, balance, logout, notifications } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [onSearch, setOnSearch] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setNotifOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" aria-label="StakeZone - Página inicial">
          <Logo />
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div ref={ref} className="row" style={{ gap: 6, position: 'relative' }}>
          <button className="nav-icon-btn" aria-label="Buscar" onClick={() => setOnSearch(true)}>
            <Search size={20} />
          </button>

          <button className="nav-icon-btn nav-hide-mobile" aria-label="Carrinho de compras" onClick={() => navigate('/loja')}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="dot" style={{ background: 'var(--gold)' }} />}
          </button>

          <button
            className="nav-icon-btn nav-hide-mobile"
            aria-label={`Notificações (${unread} não lidas)`}
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false) }}
          >
            <Bell size={20} />
            {unread > 0 && <span className="dot" />}
          </button>

          <Link to="/carteira" className="wallet-chip nav-hide-mobile">
            <Wallet size={15} />
            <Money value={balance} />
          </Link>

          <div className="row" style={{ gap: 8, position: 'relative' }}>
            <button className="btn btn-ghost nav-hide-mobile" style={{ padding: 6 }} onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false) }}>
              <Avatar name={user.name} size={38} />
              <ChevronDown size={15} className="text-muted" />
            </button>

            {profileOpen && (
              <div className="glass anim-scale-in" style={{ position: 'absolute', top: 50, right: 0, width: 230, borderRadius: 16, padding: 8, zIndex: 120 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div className="text-sm font-bold">{user.name}</div>
                  <div className="text-xs text-muted">@{user.username} · Nível {user.level}</div>
                </div>
                {[
                  { to: '/conta', icon: User, label: 'Minha conta' },
                  { to: '/carteira', icon: Wallet, label: 'Carteira' },
                  { to: '/apis', icon: Settings, label: 'Configurar APIs' },
                  { to: '/conta#seguranca', icon: Settings, label: 'Segurança' },
                ].map((i) => (
                  <Link key={i.label} to={i.to} className="sidebar-item" onClick={() => setProfileOpen(false)}>
                    <i.icon size={16} /> {i.label}
                  </Link>
                ))}
                <button className="sidebar-item" style={{ color: 'var(--red)' }} onClick={() => { logout(); setProfileOpen(false); navigate('/') }}>
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>

          <span className="hide-desktop" style={{ position: 'relative' }}>
            <button className="nav-icon-btn" aria-label="Carrinho" onClick={() => navigate('/loja')}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="dot" style={{ background: 'var(--gold)' }} />}
            </button>
          </span>
        </div>
      </div>

      {notifOpen && <NotificationsDropdown onClose={() => setNotifOpen(false)} />}
      {onSearch && <SearchOverlay onClose={() => setOnSearch(false)} />}
    </header>
  )
}

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, markAllRead } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="glass anim-scale-in" style={{ position: 'fixed', top: 'calc(var(--nav-h) + 10px)', right: 18, width: 360, maxWidth: 'calc(100vw - 36px)', borderRadius: 18, zIndex: 200, overflow: 'hidden' }}>
      <div className="row between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <strong className="text-sm">Notificações</strong>
        <button className="text-xs text-neon" style={{ background: 'none', border: 'none', fontWeight: 700 }} onClick={markAllRead}>
          Marcar todas como lidas
        </button>
      </div>
      <div style={{ maxHeight: 380, overflowY: 'auto', padding: 10 }}>
        {notifications.map((n) => (
          <div key={n.id} className="notif-item" onClick={() => { onClose(); navigate('/conta#notificacoes') }} style={{ opacity: n.read ? 0.65 : 1, cursor: 'pointer' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: n.read ? 'var(--muted-2)' : 'var(--neon)', marginTop: 5, flexShrink: 0 }} />
            <div>
              <div className="text-sm font-bold">{n.title}</div>
              <div className="text-xs text-muted">{n.desc}</div>
              <div className="text-xs text-muted-2" style={{ marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => inputRef.current?.focus(), [])

  const results = [
    ...(q ? [
      { type: 'Partida', to: '/esportes', label: `Flamengo x Palmeiras — Brasileirão` },
      { type: 'Partida', to: '/ao-vivo', label: `Los Angeles Lakers x Golden State Warriors` },
      { type: 'Odds', to: '/odds', label: `Comparar odds de apostas` },
      { type: 'Classificação', to: '/classificacoes', label: `Brasileirão Série A` },
      { type: 'Produto', to: '/loja/p1', label: `Camisa Oficial StakeZone 2026` },
      { type: 'Produto', to: '/loja/p4', label: `Boné Edição Limitada Gold` },
      { type: 'Página', to: '/promocoes', label: `Bônus de Boas-Vindas 100%` },
      { type: 'Config', to: '/apis', label: `Configurar APIs de dados` },
    ] : []).filter((r) => r.label.toLowerCase().includes(q.toLowerCase())),
  ]

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ padding: '14px 18px', gap: 12, borderBottom: '1px solid var(--border)' }}>
          <Search size={18} className="text-muted" />
          <input
            ref={inputRef}
            className="input"
            placeholder="Buscar partidas, equipes, produtos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }}
          />
          <button className="btn btn-sm btn-ghost" onClick={onClose}>ESC</button>
        </div>
        <div style={{ padding: 10, maxHeight: 380, overflowY: 'auto' }}>
          {q && results.length === 0 && <div className="text-muted text-sm" style={{ padding: 20, textAlign: 'center' }}>Nenhum resultado para "{q}"</div>}
          {results.map((r, i) => (
            <button
              key={i}
              className="row"
              style={{ gap: 12, width: '100%', padding: '12px 14px', background: 'none', border: 'none', color: 'var(--text)', borderRadius: 10, textAlign: 'left' }}
              onClick={() => { navigate(r.to); onClose() }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="badge badge-muted">{r.type}</span>
              <span className="text-sm">{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
