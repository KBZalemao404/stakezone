import { useMemo, useState } from 'react'
import { X, Trophy, Receipt, Minus, CheckCircle2, Clock, TrendingUp, Trash2, Lightbulb } from 'lucide-react'
import { useBetSlip } from '../../context/BetSlipContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { Button, Modal, Money } from '../ui'
import type { BetRecord } from '../../data/types'

export function BetSlipDrawer() {
  const {
    selections, removeSelection, clearSlip, stake, setStake, hasStake, setHasStake,
    placeBet, isPlacing, open, setOpen, activeTab, setActiveTab, totalOdds, potentialReturn,
  } = useBetSlip()
  const { bonusBalance } = useAuth()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastBet, setLastBet] = useState<BetRecord | null>(null)

  const canBet = selections.length > 0 && hasStake && stake > 0

  const onConfirm = async () => {
    setConfirmOpen(false)
    const rec = await placeBet()
    setLastBet(rec)
    toast('Aposta confirmada!', `Sua aposta ${rec.id} foi registrada. Boa sorte!`)
  }

  const quick = [5, 10, 25, 50, 100]

  return (
    <>
      <button
        className="betslip-fab"
        aria-label="Abrir cupom de apostas"
        onClick={() => { setOpen(true); setActiveTab('aposta') }}
      >
        <Trophy size={20} />
        {selections.length > 0 && <span className="fab-badge anim-scale-in">{selections.length}</span>}
      </button>

      {open && (
        <>
          <div className="modal-overlay" style={{ zIndex: 230, backdropFilter: 'blur(4px)' }} onClick={() => setOpen(false)} />
          <aside className="betslip-drawer anim-slide-up" role="dialog" aria-label="Cupom de apostas">
            <div className="row between" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              <h3 className="text-base">Cupom de apostas</h3>
              <button className="btn btn-ghost" style={{ padding: 7 }} onClick={() => setOpen(false)} aria-label="Fechar cupom">
                <X size={17} />
              </button>
            </div>

            <div className="betslip-tabs">
              <button className={`betslip-tab${activeTab === 'aposta' ? ' active' : ''}`} onClick={() => setActiveTab('aposta')}>
                Cupom ({selections.length})
              </button>
              <button className={`betslip-tab${activeTab === 'historico' ? ' active' : ''}`} onClick={() => setActiveTab('historico')}>
                Histórico
              </button>
            </div>

            {activeTab === 'historico' ? (
              <div className="betslip-body">
                <BetHistory />
              </div>
            ) : selections.length === 0 ? (
              <div className="betslip-body center" style={{ flexDirection: 'column', gap: 10, textAlign: 'center', color: 'var(--muted)' }}>
                <Receipt size={40} style={{ opacity: 0.4 }} />
                <p className="text-sm">Seu cupom está vazio.</p>
                <p className="text-xs">Selecione as odds em uma partida para começar.</p>
              </div>
            ) : (
              <div className="betslip-body">
                {selections.map((s) => (
                  <div key={s.id} className="slip-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                        <span className="badge badge-muted" style={{ fontSize: '0.6rem' }}>{s.marketLabel}</span>
                        {s.live && <span className="badge badge-live" style={{ fontSize: '0.6rem' }}>LIVE {s.liveScore}</span>}
                      </div>
                      <div className="text-sm font-bold" style={{ lineHeight: 1.3 }}>
                        {s.home} vs {s.away}
                      </div>
                      <div className="text-xs text-muted" style={{ marginTop: 3 }}>
                        {s.pick} <span style={{ color: 'var(--neon)', fontWeight: 800 }}>@ {s.odds.toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="btn btn-ghost" style={{ padding: 5, color: 'var(--red)', flexShrink: 0 }} onClick={() => removeSelection(s.id)} aria-label="Remover seleção">
                      <X size={15} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-ghost text-xs" style={{ marginBottom: 14, padding: 6 }} onClick={clearSlip}>
                  <Trash2 size={13} /> Limpar cupom
                </button>

                {selections.length > 1 && (
                  <div className="row" style={{ gap: 8, marginBottom: 12, background: 'var(--gold-soft)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                    <TrendingUp size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    <div className="text-xs" style={{ color: 'var(--gold)' }}>
                      Combinada — odd total <strong>{(totalOdds).toFixed(2)}</strong>. Acerto em todas as seleções.
                    </div>
                  </div>
                )}

                <label className="field-label">Valor da aposta (R$)</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  value={stake}
                  onChange={(e) => { setStake(Number(e.target.value)); setHasStake(true) }}
                  placeholder="Digite o valor"
                />
                <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
                  {quick.map((v) => (
                    <button key={v} className="badge badge-muted" style={{ cursor: 'pointer' }} onClick={() => { setStake(v); setHasStake(true) }}>
                      R$ {v}
                    </button>
                  ))}
                  <span className="badge badge-gold">Bônus disponível: <Money value={bonusBalance} /></span>
                </div>

                <div className="stack" style={{ gap: 10, marginTop: 16, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div className="row between text-sm">
                    <span className="text-muted">Odd total</span>
                    <span className="font-bold" style={{ color: 'var(--neon)' }}>{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="row between text-sm">
                    <span className="text-muted">Retorno potencial</span>
                    <span className="font-bold text-lg"><Money value={potentialReturn} /></span>
                  </div>
                  <div className="row between text-sm">
                    <span className="text-muted">Lucro estimado</span>
                    <span className="font-bold" style={{ color: 'var(--gold)' }}><Money value={Math.max(0, potentialReturn - stake)} /></span>
                  </div>
                </div>

                <div className="row" style={{ gap: 6, marginTop: 10 }}>
                  <Lightbulb size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <p className="text-xs text-muted">Você precisa ter saldo suficiente para confirmar a aposta. Valores fictícios.</p>
                </div>

                <Button block size="lg" style={{ marginTop: 16 }} disabled={!canBet || isPlacing} onClick={() => setConfirmOpen(true)}>
                  {isPlacing ? 'Processando...' : `Confirmar aposta · R$ ${stake.toFixed(2)}`}
                </Button>
              </div>
            )}
          </aside>
        </>
      )}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar aposta"
        footer={
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Voltar</Button>
            <Button onClick={onConfirm} disabled={isPlacing}>
              <CheckCircle2 size={16} /> {isPlacing ? 'Enviando...' : 'Confirmar agora'}
            </Button>
          </div>
        }
      >
        <div className="stack" style={{ gap: 14 }}>
          <p className="text-sm text-dim">
            Você está prestes a confirmar uma aposta de <strong>R$ {stake.toFixed(2)}</strong> em{' '}
            <strong>{selections.length}</strong> seleção(ões).
          </p>
          <div className="stack" style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, gap: 8 }}>
            <div className="row between text-sm"><span className="text-muted">Odd combinada</span><strong>{totalOdds.toFixed(2)}</strong></div>
            <div className="row between text-sm"><span className="text-muted">Retorno potencial</span><strong style={{ color: 'var(--neon)' }}><Money value={potentialReturn} /></strong></div>
          </div>
          <p className="text-xs text-muted">Demo — nenhuma aposta real é processada.</p>
        </div>
      </Modal>

      {lastBet && (
        <Modal open onClose={() => setLastBet(null)} title="Aposta registrada">
          <div className="center" style={{ flexDirection: 'column', gap: 12, padding: '6px 0', textAlign: 'center' }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'var(--neon-soft)', color: 'var(--neon)', display: 'grid', placeItems: 'center' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl">Boa sorte!</h3>
            <p className="text-sm text-muted">Sua aposta <strong className="text-dim">{lastBet.id}</strong> foi confirmada com sucesso.</p>
            <div className="stack" style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, gap: 8, width: '100%' }}>
              <div className="row between text-sm"><span className="text-muted">Valor</span><strong>R$ {lastBet.stake.toFixed(2)}</strong></div>
              <div className="row between text-sm"><span className="text-muted">Retorno potencial</span><strong style={{ color: 'var(--neon)' }}>R$ {lastBet.potentialReturn.toFixed(2)}</strong></div>
              <div className="row between text-sm"><span className="text-muted">Tipo</span><strong>{lastBet.type}</strong></div>
            </div>
            <Button block variant="outline" onClick={() => { setLastBet(null); setActiveTab('historico') }}>
              Ver no histórico
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

function BetHistory() {
  const { placedBets } = useBetSlip()
  const sorted = useMemo(() => [...placedBets].sort((a, b) => (a.placedAt === b.placedAt ? 0 : a.placedAt === 'Agora' ? -1 : 1)), [placedBets])
  return (
    <div className="stack" style={{ gap: 10 }}>
      {sorted.map((b) => (
        <div key={b.id} className="card" style={{ padding: 14, borderRadius: 14 }}>
          <div className="row between">
            <span className="text-xs text-muted">{b.id} · {b.placedAt}</span>
            <span className={`status status-${b.status}`}>{b.status === 'pending' ? 'Aberta' : b.status === 'won' ? 'Ganha' : b.status === 'lost' ? 'Perdida' : 'Cancelada'}</span>
          </div>
          <div className="stack" style={{ gap: 6, marginTop: 10 }}>
            {b.selections.slice(0, 3).map((s) => (
              <div key={s.id} className="row between text-xs" style={{ gap: 10 }}>
                <span className="text-muted" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.pick}
                </span>
                <span className="font-bold" style={{ color: 'var(--neon)', flexShrink: 0 }}>{s.odds.toFixed(2)}</span>
              </div>
            ))}
            {b.selections.length > 3 && <span className="text-xs text-muted">+{b.selections.length - 3} seleções</span>}
          </div>
          <div className="divider" />
          <div className="row between text-sm">
            <span className="text-muted">R$ {b.stake.toFixed(2)} · Odd {b.totalOdds.toFixed(2)}</span>
            <span className={`font-bold ${b.status === 'won' ? 'text-neon' : b.status === 'lost' ? 'text-red' : ''}`}>
              {b.status === 'won' ? `+ R$ ${(b.potentialReturn - b.stake).toFixed(2)}` : b.status === 'lost' ? '- R$ ' + b.stake.toFixed(2) : `→ R$ ${b.potentialReturn.toFixed(2)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
