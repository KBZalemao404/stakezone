import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wallet, Gift, CreditCard, Smartphone, Landmark, CheckCircle2, Clock, XCircle, History, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Modal, Money, StatCard, Badge } from '../components/ui'

const methods = [
  { id: 'pix', label: 'Pix', icon: Smartphone, desc: 'Aprovação imediata' },
  { id: 'card', label: 'Cartão de crédito', icon: CreditCard, desc: 'Débito imediato' },
  { id: 'boleto', label: 'Boleto', icon: Landmark, desc: '1 dia útil' },
]

const statusCfg = { concluido: { tone: 'neon' as const, label: 'Concluído', icon: CheckCircle2 }, pendente: { tone: 'gold' as const, label: 'Pendente', icon: Clock }, recusado: { tone: 'muted' as const, label: 'Recusado', icon: XCircle } }

const txTypeLabel: Record<string, string> = { deposito: 'Depósito', saque: 'Saque', aposta: 'Aposta', bonus: 'Bônus', reembolso: 'Reembolso', loja: 'Loja' }

export function WalletPage() {
  const { balance, bonusBalance, addBalance, removeBalance, transactions, addTransaction } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState('todos')
  const [depOpen, setDepOpen] = useState(false)
  const [wdOpen, setWdOpen] = useState(false)
  const [amount, setAmount] = useState(100)
  const [method, setMethod] = useState('pix')
  const [processing, setProcessing] = useState(false)

  const filtered = useMemo(() => transactions.filter((t) => tab === 'todos' || t.type === tab), [transactions, tab])

  const doDeposit = async () => {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1300))
    setProcessing(false)
    setDepOpen(false)
    addBalance(amount)
    addTransaction({ type: 'deposito', amount, status: 'concluido', method: methods.find((m) => m.id === method)?.label ?? 'Pix', ref: `DEP-${Math.floor(90000 + Math.random() * 9999)}` })
    toast('Depósito realizado!', `R$ ${amount.toFixed(2)} creditados na sua conta.`)
  }

  const doWithdraw = async () => {
    if (amount > balance) { toast('Saldo insuficiente', 'O valor do saque é maior que seu saldo.', 'error'); return }
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1300))
    setProcessing(false)
    setWdOpen(false)
    removeBalance(amount)
    addTransaction({ type: 'saque', amount: -amount, status: 'pendente', method: methods.find((m) => m.id === method)?.label ?? 'Pix', ref: `WD-${Math.floor(11000 + Math.random() * 9999)}` })
    toast('Saque solicitado', 'Sua solicitação está em processamento.', 'gold')
  }

  return (
    <div className="page container">
      <div className="row between wrap" style={{ gap: 14, marginBottom: 24 }}>
        <div>
          <h1 className="text-2xl" style={{ letterSpacing: '-0.02em' }}>Carteira</h1>
          <p className="text-sm text-muted">Deposite, saque e acompanhe suas movimentações</p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Button onClick={() => setDepOpen(true)}><ArrowDownLeft size={17} /> Depositar</Button>
          <Button variant="outline" onClick={() => setWdOpen(true)}><ArrowUpRight size={17} /> Sacar</Button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card luminous" style={{ padding: 22, background: 'linear-gradient(150deg, rgba(34,255,136,0.12), var(--surface))', border: '1px solid rgba(34,255,136,0.25)' }}>
          <div className="row between">
            <span className="text-sm text-muted">Saldo disponível</span>
            <Wallet size={18} style={{ color: 'var(--neon)' }} />
          </div>
          <div className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginTop: 10, color: 'var(--neon)' }}>
            <Money value={balance} animated />
          </div>
          <span className="badge badge-neon" style={{ marginTop: 8 }}>Para apostas e compras</span>
        </div>

        <StatCard icon={Gift} label="Bônus disponível" value={`R$ ${bonusBalance.toFixed(2)}`} tone="gold" />
        <StatCard icon={TrendingUp} label="Total movimentado (mês)" value="R$ 1.842,00" delta="+12%" tone="blue" />
        <StatCard icon={History} label="Apostas este mês" value="23" delta="+4" tone="neon" />
      </div>

      {/* Methods */}
      <section className="card" style={{ padding: 20, marginBottom: 28 }}>
        <h3 className="text-lg" style={{ marginBottom: 14 }}>Métodos de pagamento</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {methods.map((m) => (
            <div key={m.id} className="card" style={{ padding: 16, borderRadius: 14, cursor: 'pointer' }} onClick={() => { setMethod(m.id); setDepOpen(true) }}>
              <m.icon size={20} style={{ color: 'var(--neon)' }} />
              <div className="text-sm font-bold" style={{ marginTop: 8 }}>{m.label}</div>
              <div className="text-xs text-muted">{m.desc}</div>
              <span className="badge badge-neon" style={{ marginTop: 8 }}>Disponível</span>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section>
        <div className="row between wrap" style={{ gap: 10, marginBottom: 14 }}>
          <h3 className="text-lg">Histórico financeiro</h3>
          <div className="row wrap" style={{ gap: 6 }}>
            {['todos', 'deposito', 'saque', 'aposta', 'bonus'].map((t) => (
              <button key={t} className={`sports-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ fontSize: '0.76rem', padding: '7px 12px' }}>
                {t === 'todos' ? 'Todos' : txTypeLabel[t]}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap glass">
          <table className="table">
            <thead>
              <tr><th>Tipo</th><th>Referência</th><th>Método</th><th>Data</th><th>Status</th><th style={{ textAlign: 'right' }}>Valor</th></tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const st = statusCfg[t.status]
                const positive = t.amount > 0
                return (
                  <tr key={t.id}>
                    <td><span className="row" style={{ gap: 8 }}>{txTypeLabel[t.type]} <span className={positive ? 'text-neon' : 'text-red'}>{positive ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}</span></span></td>
                    <td className="text-muted">{t.ref}</td>
                    <td className="text-muted">{t.method}</td>
                    <td className="text-muted">{t.date}</td>
                    <td><Badge tone={st.tone}><st.icon size={12} /> {st.label}</Badge></td>
                    <td style={{ textAlign: 'right' }} className={`font-bold ${positive ? 'text-neon' : 'text-red'}`}>
                      {positive ? '+' : ''}<Money value={t.amount} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted" style={{ marginTop: 10 }}>Demo — saldos e transações são fictícios.</p>
      </section>

      {/* Deposit modal */}
      <Modal open={depOpen} onClose={() => setDepOpen(false)} title="Depositar fundos" footer={
        <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={() => setDepOpen(false)}>Cancelar</Button>
          <Button onClick={doDeposit} disabled={processing}>{processing ? 'Processando...' : 'Depositar agora'}</Button>
        </div>
      }>
        <label className="field-label">Valor do depósito</label>
        <input type="number" className="input" min={10} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
          {[50, 100, 250, 500].map((v) => (
            <button key={v} className="badge badge-muted" style={{ cursor: 'pointer' }} onClick={() => setAmount(v)}>R$ {v}</button>
          ))}
          <span className="badge badge-gold">+100% de bônus até R$ 1.000</span>
        </div>
        <label className="field-label" style={{ marginTop: 18 }}>Método de pagamento</label>
        <div className="stack" style={{ gap: 8 }}>
          {methods.map((m) => (
            <button key={m.id} className="row" style={{ gap: 12, padding: '12px 14px', borderRadius: 12, background: method === m.id ? 'var(--neon-soft)' : 'var(--surface-2)', border: `1px solid ${method === m.id ? 'var(--neon)' : 'var(--border)'}`, color: 'var(--text)', textAlign: 'left' }} onClick={() => setMethod(m.id)}>
              <m.icon size={18} style={{ color: method === m.id ? 'var(--neon)' : 'var(--muted)' }} />
              <div style={{ flex: 1 }}>
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-xs text-muted">{m.desc}</div>
              </div>
              {method === m.id && <CheckCircle2 size={16} style={{ color: 'var(--neon)' }} />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Withdraw modal */}
      <Modal open={wdOpen} onClose={() => setWdOpen(false)} title="Sacar fundos" footer={
        <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={() => setWdOpen(false)}>Cancelar</Button>
          <Button variant="gold" onClick={doWithdraw} disabled={processing}>{processing ? 'Processando...' : 'Confirmar saque'}</Button>
        </div>
      }>
        <label className="field-label">Valor do saque</label>
        <input type="number" className="input" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="row between text-sm" style={{ marginTop: 12, background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
          <span className="text-muted">Saldo disponível</span>
          <strong className="text-neon"><Money value={balance} /></strong>
        </div>
        <p className="text-xs text-muted" style={{ marginTop: 10 }}>
          Saques são processados em até 1 dia útil. Valores fictícios.
        </p>
      </Modal>
    </div>
  )
}
