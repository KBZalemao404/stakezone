import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, Trophy, Package, Wallet, User, ShieldCheck, Bell, Check, Eye, EyeOff, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBetSlip } from '../context/BetSlipContext'
import { useCart } from '../context/CartContext'
import { Avatar, Badge, Button, Money, SectionHeader, StatCard } from '../components/ui'
import { useToast } from '../context/ToastContext'

const tabs = [
  { id: 'visao', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'apostas', label: 'Minhas apostas', icon: Trophy },
  { id: 'pedidos', label: 'Pedidos da loja', icon: Package },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet },
  { id: 'dados', label: 'Dados da conta', icon: User },
  { id: 'seguranca', label: 'Segurança', icon: ShieldCheck },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
]

export function AccountPage() {
  const [tab, setTab] = useState('visao')
  const hashTab = window.location.hash.replace('#', '')

  useEffect(() => {
    if (hashTab && tabs.some((t) => t.id === hashTab)) setTab(hashTab)
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashTab])

  return (
    <div className="page container">
      <div className="row hide-desktop" style={{ gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 18 }}>
        {tabs.map((t) => (
          <button key={t.id} className={`sports-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)} style={{ whiteSpace: 'nowrap' }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: 24 }}>
        <Sidebar active={tab} onSelect={setTab} />
        <div className="anim-fade-up" key={tab}>
          {tab === 'visao' && <Overview onGo={setTab} />}
          {tab === 'apostas' && <BetsSection />}
          {tab === 'pedidos' && <OrdersSection />}
          {tab === 'financeiro' && <FinanceSection />}
          {tab === 'dados' && <DataSection />}
          {tab === 'seguranca' && <SecuritySection />}
          {tab === 'notificacoes' && <NotificationsSection />}
        </div>
      </div>
    </div>
  )
}

function Sidebar({ active, onSelect }: { active: string; onSelect: (t: string) => void }) {
  const { user } = useAuth()
  return (
    <aside className="glass sidebar hide-mobile">
      <div className="center" style={{ flexDirection: 'column', gap: 8, padding: '8px 0 18px' }}>
        <Avatar name={user.name} size={64} />
        <div className="text-center">
          <div className="font-bold">{user.name}</div>
          <div className="text-xs text-muted">@{user.username} · Nível {user.level}</div>
        </div>
        <Badge tone="gold">Membro {user.level === 2 ? 'Silver' : 'Bronze'}</Badge>
      </div>
      <div className="divider" />
      {tabs.map((t) => (
        <button key={t.id} className={`sidebar-item${active === t.id ? ' active' : ''}`} onClick={() => onSelect(t.id)}>
          <t.icon size={16} /> {t.label}
        </button>
      ))}
    </aside>
  )
}

function Overview({ onGo }: { onGo: (t: string) => void }) {
  const { user, balance, bonusBalance, notifications } = useAuth()
  const { placedBets } = useBetSlip()
  const { orders } = useCart()
  const open = placedBets.filter((b) => b.status === 'pending').length
  const settled = placedBets.filter((b) => b.status === 'won' || b.status === 'lost').length
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div>
      <div className="card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(140deg, rgba(34,255,136,0.08), var(--surface))' }}>
        <div className="row between wrap" style={{ gap: 16 }}>
          <div>
            <h2 className="text-xl">Olá, {user.name.split(' ')[0]}!</h2>
            <p className="text-sm text-muted" style={{ marginTop: 6 }}>Bem-vindo de volta. Aqui está o resumo da sua conta.</p>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <Button onClick={() => onGo('seguranca')}><ShieldCheck size={16} /> Verificar conta</Button>
          </div>
        </div>
        <div className="row wrap" style={{ gap: 24, marginTop: 22 }}>
          <div>
            <div className="text-xs text-muted">Saldo disponível</div>
            <div className="font-display text-xl font-bold" style={{ color: 'var(--neon)' }}><Money value={balance} /></div>
          </div>
          <div>
            <div className="text-xs text-muted">Bônus</div>
            <div className="font-display text-xl font-bold" style={{ color: 'var(--gold)' }}>R$ {bonusBalance.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted">Verificação</div>
            <div className="text-sm font-bold text-neon">{user.verified ? 'Verificada' : 'Pendente'}</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Trophy} label="Apostas abertas" value={String(open)} tone="neon" />
        <StatCard icon={Trophy} label="Apostas encerradas" value={String(settled)} tone="blue" />
        <StatCard icon={Package} label="Pedidos da loja" value={String(orders.length)} tone="gold" />
        <StatCard icon={Bell} label="Notificações não lidas" value={String(unread)} tone="red" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <button className="card card-hover" style={{ padding: 20, textAlign: 'left', color: 'var(--text)' }} onClick={() => onGo('apostas')}>
          <Trophy size={20} style={{ color: 'var(--neon)' }} />
          <h3 className="text-lg" style={{ marginTop: 10 }}>Minhas apostas</h3>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>Acompanhe apostas abertas e encerradas.</p>
        </button>
        <button className="card card-hover" style={{ padding: 20, textAlign: 'left', color: 'var(--text)' }} onClick={() => onGo('pedidos')}>
          <Package size={20} style={{ color: 'var(--gold)' }} />
          <h3 className="text-lg" style={{ marginTop: 10 }}>Pedidos da loja</h3>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>Rastreie suas compras na StakeZone Store.</p>
        </button>
      </div>
    </div>
  )
}

function BetsSection() {
  const { placedBets } = useBetSlip()
  const [filter, setFilter] = useState('todas')
  const bets = useMemo(() => {
    if (filter === 'abertas') return placedBets.filter((b) => b.status === 'pending')
    if (filter === 'encerradas') return placedBets.filter((b) => b.status === 'won' || b.status === 'lost')
    return placedBets
  }, [placedBets, filter])

  return (
    <div>
      <SectionHeader title="Minhas apostas" subtitle="Histórico completo de suas apostas" />
      <div className="row wrap" style={{ gap: 6, marginBottom: 18 }}>
        {[['todas', 'Todas'], ['abertas', 'Abertas'], ['encerradas', 'Encerradas']].map(([k, l]) => (
          <button key={k} className={`sports-tab ${filter === k ? 'active' : ''}`} style={{ fontSize: '0.78rem', padding: '8px 13px' }} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="stack" style={{ gap: 12 }}>
        {bets.map((b) => (
          <div key={b.id} className="card" style={{ padding: 16 }}>
            <div className="row between wrap" style={{ gap: 8 }}>
              <span className="text-xs text-muted">{b.id} · {b.placedAt} · {b.type}</span>
              <Badge tone={b.status === 'won' ? 'neon' : b.status === 'lost' ? 'muted' : 'gold'}>
                {b.status === 'won' ? 'Encerrada — ganha' : b.status === 'lost' ? 'Encerrada — perdida' : 'Aberta'}
              </Badge>
            </div>
            <div className="stack" style={{ gap: 5, marginTop: 10 }}>
              {b.selections.map((s) => (
                <div key={s.id} className="row between text-sm" style={{ gap: 10 }}>
                  <span className="text-dim" style={{ flex: 1 }}>{s.home} vs {s.away} — <span className="text-muted">{s.pick}</span></span>
                  <strong style={{ color: 'var(--neon)' }}>{s.odds.toFixed(2)}</strong>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="row between text-sm">
              <span className="text-muted">Aposta: R$ {b.stake.toFixed(2)} · Odd {b.totalOdds.toFixed(2)}</span>
              <span className={`font-bold ${b.status === 'won' ? 'text-neon' : b.status === 'lost' ? 'text-red' : ''}`}>
                {b.status === 'won' ? `+ R$ ${(b.potentialReturn - b.stake).toFixed(2)}` : b.status === 'lost' ? '- R$ ' + b.stake.toFixed(2) : `Retorno potencial: R$ ${b.potentialReturn.toFixed(2)}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersSection() {
  const { orders } = useCart()
  return (
    <div>
      <SectionHeader title="Pedidos da loja" subtitle="Compras realizadas na StakeZone Store" />
      {orders.length === 0 ? (
        <div className="card center" style={{ padding: 40, color: 'var(--muted)' }}>Nenhum pedido ainda.</div>
      ) : (
        <div className="stack" style={{ gap: 14 }}>
          {orders.map((o) => (
            <div key={o.id} className="card" style={{ padding: 18 }}>
              <div className="row between wrap" style={{ gap: 8, marginBottom: 12 }}>
                <span className="font-bold">{o.id}</span>
                <Badge tone={o.status === 'entregue' ? 'neon' : o.status === 'processando' ? 'gold' : 'blue'}>{o.status}</Badge>
              </div>
              {o.items.map((i, idx) => (
                <div key={idx} className="row between text-sm" style={{ padding: '5px 0' }}>
                  <span className="text-dim">{i.product.name} × {i.qty}</span>
                  <span><Money value={i.product.price * i.qty} /></span>
                </div>
              ))}
              <div className="divider" />
              <div className="row between">
                <span className="text-sm text-muted">{o.placedAt}</span>
                <span className="font-bold text-neon">Total: <Money value={o.total} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FinanceSection() {
  const { transactions } = useAuth()
  return (
    <div>
      <SectionHeader title="Histórico financeiro" subtitle="Depósitos, saques, bônus e apostas" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Referência</th><th>Método</th><th>Data</th><th>Status</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="text-dim">{t.ref}</td>
                <td className="text-muted">{t.method}</td>
                <td className="text-muted">{t.date}</td>
                <td><span className={`status status-${t.status === 'concluido' ? 'won' : t.status === 'pendente' ? 'pending' : 'cancelled'}`}>{t.status}</span></td>
                <td style={{ textAlign: 'right' }} className={`font-bold ${t.amount > 0 ? 'text-neon' : 'text-red'}`}>{t.amount > 0 ? '+' : ''}<Money value={t.amount} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DataSection() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState('(11) 98765-4321')

  return (
    <div>
      <SectionHeader title="Dados da conta" subtitle="Atualize suas informações pessoais" />
      <div className="card" style={{ padding: 24 }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          <div><label className="field-label">Nome completo</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="field-label">E-mail</label><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="field-label">Telefone</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className="field-label">Usuário</label><input className="input" value={`@${user.username}`} readOnly /></div>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 20 }}>
          <Button onClick={() => { updateUser({ name, email }); toast('Dados atualizados', 'Suas informações foram salvas.') }}>Salvar alterações</Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
      </div>
    </div>
  )
}

function SecuritySection() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [two, setTwo] = useState(user.twoFactor)
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('Stake1234')

  return (
    <div>
      <SectionHeader title="Segurança" subtitle="Proteja sua conta" />
      <div className="stack" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-lg" style={{ marginBottom: 6 }}>Verificação de identidade</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 14 }}>Confirme sua identidade para aumentar limites e desbloquear saques.</p>
          <div className="row between wrap" style={{ gap: 12, background: user.verified ? 'var(--neon-soft)' : 'var(--gold-soft)', border: '1px solid ' + (user.verified ? 'rgba(34,255,136,0.25)' : 'rgba(255,209,102,0.25)'), borderRadius: 12, padding: '14px 16px' }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="status" style={{ color: user.verified ? 'var(--neon)' : 'var(--gold)' }}>
                {user.verified ? <Check size={16} /> : <X size={16} />}
              </span>
              <div>
                <div className="text-sm font-bold">{user.verified ? 'Conta verificada' : 'Verificação pendente'}</div>
                <div className="text-xs text-muted">{user.verified ? 'Documento validado em 05/08/2026' : 'Envie um documento com foto para concluir'}</div>
              </div>
            </div>
            {!user.verified && <Button size="sm" variant="outline" onClick={() => { updateUser({ verified: true }); toast('Documento enviado', 'Sua verificação foi aprovada (demo).') }}>Enviar documento</Button>}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="row between wrap" style={{ gap: 12 }}>
            <div>
              <h3 className="text-lg">Autenticação em dois fatores</h3>
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>Exija um código extra ao entrar na sua conta.</p>
            </div>
            <button className={`toggle${two ? ' on' : ''}`} role="switch" aria-checked={two} onClick={() => { setTwo(!two); updateUser({ twoFactor: !two }); toast(two ? '2FA desativado' : '2FA ativado', undefined, 'info') }} />
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-lg" style={{ marginBottom: 14 }}>Alterar senha</h3>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <label className="field-label">Nova senha</label>
              <input className="input" type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} />
              <button className="btn btn-ghost" style={{ position: 'absolute', right: 8, top: 30, padding: 4 }} onClick={() => setShowPw((v) => !v)} aria-label="Mostrar senha">{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <Button onClick={() => toast('Senha alterada', 'Sua senha foi atualizada com sucesso.')}>Alterar senha</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const { notifications, markAllRead } = useAuth()
  return (
    <div>
      <SectionHeader title="Central de notificações" subtitle={`${notifications.filter((n) => !n.read).length} não lidas`} action={<Button variant="outline" size="sm" onClick={markAllRead}>Marcar todas como lidas</Button>} />
      <div className="stack" style={{ gap: 10 }}>
        {notifications.map((n) => (
          <div key={n.id} className="notif-item" style={{ opacity: n.read ? 0.6 : 1 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: n.read ? 'var(--muted-2)' : 'var(--neon)', marginTop: 5, flexShrink: 0 }} />
            <div>
              <div className="text-sm font-bold">{n.title}</div>
              <div className="text-xs text-muted">{n.desc}</div>
              <div className="text-xs text-muted" style={{ marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
