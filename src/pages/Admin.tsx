import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, Trophy, CalendarRange, TrendingUp, Package, Warehouse, ShoppingBag,
  ArrowLeftRight, Gift, Ticket, ArrowLeft, ShieldAlert,
} from 'lucide-react'
import { Button, Badge, StatCard, SectionHeader } from '../components/ui'

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'apostas', label: 'Apostas', icon: Trophy },
  { id: 'eventos', label: 'Eventos esportivos', icon: CalendarRange },
  { id: 'odds', label: 'Odds', icon: TrendingUp },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'estoque', label: 'Estoque', icon: Warehouse },
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
  { id: 'transacoes', label: 'Transações', icon: ArrowLeftRight },
  { id: 'promocoes', label: 'Promoções', icon: Gift },
  { id: 'cupons', label: 'Cupons', icon: Ticket },
]

export function AdminPage() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="page">
      <div className="container">
        <div className="row between wrap" style={{ gap: 14, marginBottom: 22 }}>
          <div>
            <div className="row" style={{ gap: 10 }}>
              <h1 className="text-2xl">Painel administrativo</h1>
              <Badge tone="gold">Demo</Badge>
            </div>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>Interface administrativa de demonstração — todos os dados são fictícios.</p>
          </div>
          <Link to="/"><Button variant="outline" size="sm"><ArrowLeft size={15} /> Voltar ao site</Button></Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '230px 1fr', gap: 22 }}>
          <aside className="glass sidebar" style={{ position: 'sticky' }}>
            {adminTabs.map((t) => (
              <button key={t.id} className={`sidebar-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </aside>

          <div className="anim-fade-up" key={tab}>
            {tab === 'dashboard' && <AdminDashboard />}
            {tab === 'usuarios' && <UsersTable />}
            {tab === 'apostas' && <BetsTable />}
            {tab === 'eventos' && <EventsTable />}
            {tab === 'odds' && <OddsTable />}
            {tab === 'produtos' && <ProductsTable />}
            {tab === 'estoque' && <StockTable />}
            {tab === 'pedidos' && <OrdersTable />}
            {tab === 'transacoes' && <TransactionsTable />}
            {tab === 'promocoes' && <PromosTable />}
            {tab === 'cupons' && <CouponsTable />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- CHARTS ---------- */
function BarChart({ data, labels, gold }: { data: number[]; labels: string[]; gold?: boolean }) {
  const max = Math.max(...data, 1)
  return (
    <div className="chart-bar">
      {data.map((v, i) => (
        <div key={i} className="chart-col">
          <div className="chart-bar-track">
            <div className="chart-bar-fill" style={{ height: `${(v / max) * 100}%`, background: gold ? 'var(--grad-gold)' : 'var(--grad-neon)', animationDelay: `${i * 0.08}s` }} />
          </div>
          <span className="text-xs text-muted" style={{ fontSize: '0.6rem' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ percent, label, sub }: { percent: number; label: string; sub: string }) {
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="donut" style={{ width: 150, height: 150 }}>
      <svg width="150" height="150" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="11" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="url(#dg)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * c} ${c}`}
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22ff88" /><stop offset="1" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="donut-center">
        <div>
          <div className="text-xl font-bold">{label}</div>
          <div className="text-xs text-muted">{sub}</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- SECTIONS ---------- */
function AdminDashboard() {
  const revenue = [420, 510, 480, 640, 590, 720, 680, 810, 760, 920, 880, 1040]
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  return (
    <div>
      <SectionHeader title="Métricas gerais" subtitle="Visão geral da plataforma (dados fictícios)" />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard icon={Users} label="Usuários ativos" value="48.290" delta="+8,4%" tone="neon" />
        <StatCard icon={Trophy} label="Apostas hoje" value="6.412" delta="+12% " tone="blue" />
        <StatCard icon={ShoppingBag} label="Pedidos da loja" value="312" delta="+5,2%" tone="gold" />
        <StatCard icon={ArrowLeftRight} label="Volume (mês)" value="R$ 1,24M" delta="+18%" tone="neon" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="text-lg" style={{ marginBottom: 18 }}>Receita mensal (R$ mil)</h3>
          <BarChart data={revenue} labels={labels} />
        </div>
        <div className="card center" style={{ padding: 22, flexDirection: 'column', gap: 18 }}>
          <h3 className="text-lg">Distribuição por esporte</h3>
          <DonutChart percent={68} label="68%" sub="Futebol" />
          <div className="stack" style={{ gap: 8, width: '100%' }}>
            {[['Futebol', 68, 'var(--neon)'], ['Basquete', 14, 'var(--cyan)'], ['eSports', 10, '#c792ff'], ['Outros', 8, 'var(--gold)']].map(([l, v, c]) => (
              <div key={l as string} className="row between text-sm">
                <span className="row" style={{ gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c as string }} />{l}</span>
                <strong>{v}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: 10, marginTop: 22, background: 'var(--gold-soft)', border: '1px solid rgba(255,209,102,0.25)', borderRadius: 14, padding: '14px 16px' }}>
        <ShieldAlert size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
        <p className="text-xs text-dim">Área administrativa de demonstração. Nenhuma ação modifica dados reais; use apenas para apresentar a interface.</p>
      </div>
    </div>
  )
}

const users = [
  { id: '#1042', name: 'Rafael Santos', email: 'rafa@email.com', level: 2, bets: 23, balance: 'R$ 3.250,50', status: 'Ativo' },
  { id: '#1043', name: 'Mariana Costa', email: 'mari@email.com', level: 3, bets: 47, balance: 'R$ 12.400,00', status: 'Ativo' },
  { id: '#1044', name: 'João Pereira', email: 'joao@email.com', level: 1, bets: 8, balance: 'R$ 215,00', status: 'Ativo' },
  { id: '#1045', name: 'Camila Souza', email: 'camila@email.com', level: 2, bets: 31, balance: 'R$ 890,00', status: 'Suspenso' },
  { id: '#1046', name: 'Lucas Almeida', email: 'lucas@email.com', level: 1, bets: 12, balance: 'R$ 1.120,00', status: 'Ativo' },
  { id: '#1047', name: 'Ana Beatriz', email: 'ana@email.com', level: 4, bets: 89, balance: 'R$ 45.900,00', status: 'Ativo' },
]

function UsersTable() {
  return (
    <div>
      <SectionHeader title="Usuários" subtitle="Contas cadastradas na plataforma" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Nível</th><th>Apostas</th><th>Saldo</th><th>Status</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="text-muted">{u.id}</td><td className="font-bold">{u.name}</td><td className="text-muted">{u.email}</td>
                <td><Badge tone={u.level >= 3 ? 'gold' : 'muted'}>Nível {u.level}</Badge></td>
                <td>{u.bets}</td><td>{u.balance}</td>
                <td><Badge tone={u.status === 'Ativo' ? 'neon' : 'red'}>{u.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const bets = [
  { id: '#22104', user: 'Rafael Santos', type: 'Combinada', stake: 25, odds: 5.6, status: 'Aberta' },
  { id: '#22103', user: 'Mariana Costa', type: 'Simples', stake: 150, odds: 1.85, status: 'Ganha' },
  { id: '#22102', user: 'João Pereira', type: 'Simples', stake: 40, odds: 2.1, status: 'Perdida' },
  { id: '#22101', user: 'Camila Souza', type: 'Combinada', stake: 10, odds: 3.2, status: 'Aberta' },
  { id: '#22100', user: 'Lucas Almeida', type: 'Simples', stake: 90, odds: 1.65, status: 'Ganha' },
]

function BetsTable() {
  return (
    <div>
      <SectionHeader title="Apostas" subtitle="Todas as apostas da plataforma" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>ID</th><th>Usuário</th><th>Tipo</th><th>Valor</th><th>Odd</th><th>Status</th></tr></thead>
          <tbody>
            {bets.map((b) => (
              <tr key={b.id}>
                <td className="text-muted">{b.id}</td><td>{b.user}</td><td>{b.type}</td>
                <td>R$ {b.stake.toFixed(2)}</td><td>{b.odds.toFixed(2)}</td>
                <td><Badge tone={b.status === 'Ganha' ? 'neon' : b.status === 'Perdida' ? 'muted' : 'gold'}>{b.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const events = [
  { id: '#EV-88', event: 'Flamengo x Palmeiras', sport: 'Futebol', market: '1x2 · Total · HCP', live: true, status: 'Ao vivo' },
  { id: '#EV-89', event: 'Lakers x Warriors', sport: 'Basquete', market: 'Vencedor · Total', live: true, status: 'Ao vivo' },
  { id: '#EV-90', event: 'Man. City x Arsenal', sport: 'Futebol', market: '1x2 · Total', live: false, status: 'Aguardando' },
  { id: '#EV-91', event: 'FaZe x NAVI', sport: 'eSports', market: 'Vencedor do mapa', live: false, status: 'Encerrado' },
]

function EventsTable() {
  return (
    <div>
      <SectionHeader title="Eventos esportivos" subtitle="Gerenciamento de eventos" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>ID</th><th>Evento</th><th>Esporte</th><th>Mercados</th><th>Status</th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td className="text-muted">{e.id}</td><td className="font-bold">{e.event}</td><td>{e.sport}</td>
                <td className="text-muted">{e.market}</td>
                <td><Badge tone={e.live ? 'live' : e.status === 'Encerrado' ? 'muted' : 'blue'}>{e.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const odds = [
  { event: 'Flamengo x Palmeiras', home: '2,05', draw: '3,30', away: '3,45', over: '1,72', under: '2,10' },
  { event: 'Lakers x Warriors', home: '1,55', draw: '—', away: '2,50', over: '1,68', under: '2,10' },
  { event: 'Man. City x Arsenal', home: '1,75', draw: '3,90', away: '4,60', over: '1,65', under: '2,25' },
]

function OddsTable() {
  return (
    <div>
      <SectionHeader title="Odds" subtitle="Odds configuradas por evento" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Evento</th><th>1</th><th>X</th><th>2</th><th>Over 2.5</th><th>Under 2.5</th></tr></thead>
          <tbody>
            {odds.map((o) => (
              <tr key={o.event}>
                <td className="font-bold">{o.event}</td>
                <td style={{ color: 'var(--neon)' }}>{o.home}</td><td>{o.draw}</td><td style={{ color: 'var(--neon)' }}>{o.away}</td><td>{o.over}</td><td>{o.under}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const products = [
  { name: 'Camisa Oficial StakeZone 2026', cat: 'Camisetas', price: 349.9, stock: 42, sales: 128 },
  { name: 'Boné Edição Limitada Gold', cat: 'Bonés', price: 129.9, stock: 25, sales: 96 },
  { name: 'Jaqueta Premium Storm Series', cat: 'Camisetas', price: 499.9, stock: 18, sales: 34 },
  { name: 'Bola de Futebol Pro Match', cat: 'Equipamentos', price: 199.9, stock: 40, sales: 87 },
]

function ProductsTable() {
  return (
    <div>
      <SectionHeader title="Produtos" subtitle="Catálogo da loja" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Vendas</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.name}>
                <td className="font-bold">{p.name}</td><td>{p.cat}</td><td>R$ {p.price.toFixed(2)}</td><td>{p.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StockTable() {
  return (
    <div>
      <SectionHeader title="Estoque" subtitle="Controle de estoque da loja" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Produto</th><th>Em estoque</th><th>Nível</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.name}>
                <td className="font-bold">{p.name}</td><td>{p.stock} unid.</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <div style={{ width: 90, height: 7, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, p.stock * 1.4)}%`, height: '100%', background: p.stock > 30 ? 'var(--grad-neon)' : 'var(--grad-gold)', borderRadius: 4 }} />
                    </div>
                    <span className={`text-xs ${p.stock < 30 ? 'text-gold' : 'text-muted'}`}>{p.stock < 30 ? 'Baixo' : 'OK'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const orders = [
  { id: '#ST-1042', user: 'Rafael Santos', items: 3, total: 'R$ 579,70', status: 'Enviado' },
  { id: '#ST-1041', user: 'Mariana Costa', items: 1, total: 'R$ 129,90', status: 'Entregue' },
  { id: '#ST-1040', user: 'João Pereira', items: 5, total: 'R$ 1.200,00', status: 'Processando' },
]

function OrdersTable() {
  return (
    <div>
      <SectionHeader title="Pedidos" subtitle="Pedidos da loja" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>ID</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="text-muted">{o.id}</td><td>{o.user}</td><td>{o.items}</td><td>{o.total}</td>
                <td><Badge tone={o.status === 'Entregue' ? 'neon' : o.status === 'Enviado' ? 'blue' : 'gold'}>{o.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransactionsTable() {
  const rows = [
    { ref: 'DEP-88421', user: 'Rafael Santos', type: 'Depósito', amount: '+ R$ 500,00', status: 'Concluído' },
    { ref: 'BET-22091', user: 'Rafael Santos', type: 'Aposta', amount: '- R$ 50,00', status: 'Concluído' },
    { ref: 'WD-11032', user: 'Mariana Costa', type: 'Saque', amount: '- R$ 200,00', status: 'Pendente' },
    { ref: 'BONUS-WELCOME', user: 'João Pereira', type: 'Bônus', amount: '+ R$ 100,00', status: 'Concluído' },
  ]
  return (
    <div>
      <SectionHeader title="Transações" subtitle="Movimentações financeiras" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Referência</th><th>Usuário</th><th>Tipo</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.ref}>
                <td className="text-muted">{t.ref}</td><td>{t.user}</td><td>{t.type}</td>
                <td className={t.amount.startsWith('+') ? 'text-neon' : 'text-red'}>{t.amount}</td>
                <td><Badge tone={t.status === 'Concluído' ? 'neon' : 'gold'}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PromosTable() {
  const rows = [
    { name: 'Bônus de Boas-Vindas 100%', type: 'Bônus', value: '100% até R$ 1.000', active: true },
    { name: 'Cashback de 10% Ao Vivo', type: 'Cashback', value: '10%', active: true },
    { name: 'Combinada Booster +20%', type: 'Multiplicador', value: '+20%', active: true },
    { name: 'Torneio de Futebol', type: 'Torneio', value: 'R$ 10.000', active: false },
  ]
  return (
    <div>
      <SectionHeader title="Promoções" subtitle="Campanhas ativas e agendadas" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Promoção</th><th>Tipo</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.name}>
                <td className="font-bold">{p.name}</td><td>{p.type}</td><td>{p.value}</td>
                <td><Badge tone={p.active ? 'neon' : 'muted'}>{p.active ? 'Ativa' : 'Inativa'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CouponsTable() {
  const rows = [
    { code: 'STORE20', type: 'Desconto loja', value: '20%', uses: 145, status: 'Ativo' },
    { code: 'BEMVINDO10', type: 'Desconto loja', value: '10%', uses: 98, status: 'Ativo' },
    { code: 'VIP15', type: 'Desconto VIP', value: '15%', uses: 32, status: 'Ativo' },
    { code: 'FANATICO5', type: 'Desconto', value: 'R$ 5', uses: 0, status: 'Expirado' },
  ]
  return (
    <div>
      <SectionHeader title="Cupons" subtitle="Códigos promocionais" />
      <div className="table-wrap glass">
        <table className="table">
          <thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Usos</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.code}>
                <td className="font-bold" style={{ color: 'var(--gold)' }}>{c.code}</td><td>{c.type}</td><td>{c.value}</td><td>{c.uses}</td>
                <td><Badge tone={c.status === 'Ativo' ? 'neon' : 'muted'}>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
