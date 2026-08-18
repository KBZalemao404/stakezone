import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket, CreditCard, Smartphone, Landmark, CheckCircle2, X, Lock, ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Button, Modal, Money, EmptyState } from '../components/ui'

const paymentMethods = [
  { id: 'pix', label: 'Pix', icon: Smartphone, desc: 'Aprovação imediata' },
  { id: 'card', label: 'Cartão de crédito', icon: CreditCard, desc: 'Em até 3x sem juros' },
  { id: 'boleto', label: 'Boleto bancário', icon: Landmark, desc: 'Compensação em 1 dia útil' },
]

export function CheckoutPage() {
  const { items, subtotal, discount, coupon, applyCoupon, removeCoupon, total, clearCart, placeOrder } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [method, setMethod] = useState('pix')
  const [address, setAddress] = useState('Av. Paulista, 1000 - São Paulo/SP')
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  const shipping = total >= 199 ? 0 : 19.9
  const keyOf = (color: string, size: string, id: string) => `${id}-${color}-${size}`

  const onConfirm = async () => {
    if (!address.trim()) { toast('Informe o endereço', 'Preencha o endereço de entrega.', 'error'); return }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1500))
    const order = placeOrder(address)
    setPlacing(false)
    setDone(order.id)
    toast('Pedido confirmado!', `Pedido ${order.id} registrado com sucesso.`)
  }

  if (items.length === 0 && !done) {
    return (
      <div className="page container">
        <EmptyState icon={ShoppingCartIcon} title="Seu carrinho está vazio" desc="Adicione produtos antes de finalizar a compra."
          action={<Link to="/loja"><Button>Ir para a loja</Button></Link>} />
      </div>
    )
  }

  return (
    <div className="page container">
      <h1 className="text-2xl" style={{ marginBottom: 4, letterSpacing: '-0.02em' }}>Checkout</h1>
      <p className="text-sm text-muted" style={{ marginBottom: 26 }}>Revise seus itens e confirme a entrega</p>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: 26 }}>
        <div className="stack" style={{ gap: 20 }}>
          {/* Items */}
          <section className="card" style={{ padding: 20 }}>
            <h3 className="text-lg" style={{ marginBottom: 16 }}>Itens do pedido</h3>
            {items.map((i) => (
              <div key={keyOf(i.color, i.size, i.product.id)} className="row" style={{ gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: i.product.gradient, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="text-sm font-bold">{i.product.name}</div>
                  <div className="text-xs text-muted">{i.color} · {i.size} · Qtd {i.qty}</div>
                </div>
                <span className="font-bold text-sm" style={{ color: 'var(--neon)' }}><Money value={i.product.price * i.qty} /></span>
              </div>
            ))}
          </section>

          {/* Coupon */}
          <section className="card" style={{ padding: 20 }}>
            <h3 className="text-lg" style={{ marginBottom: 14 }}>Cupom de desconto</h3>
            {coupon ? (
              <div className="row between" style={{ background: 'var(--gold-soft)', border: '1px solid rgba(255,209,102,0.3)', borderRadius: 12, padding: '12px 14px' }}>
                <span className="row" style={{ gap: 8, color: 'var(--gold)', fontWeight: 800 }}><Ticket size={16} /> {coupon}</span>
                <button className="btn btn-ghost" style={{ padding: 4, color: 'var(--red)' }} onClick={removeCoupon}><X size={15} /></button>
              </div>
            ) : (
              <div className="row" style={{ gap: 8 }}>
                <div className="row" style={{ gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px', flex: 1 }}>
                  <Ticket size={15} className="text-muted" />
                  <input className="input" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '11px 0' }} placeholder="Ex: STORE20" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <Button variant="outline" onClick={() => { if (code) applyCoupon(code) }}>Aplicar</Button>
              </div>
            )}
          </section>

          {/* Address */}
          <section className="card" style={{ padding: 20 }}>
            <h3 className="text-lg" style={{ marginBottom: 14 }}>Endereço de entrega</h3>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço completo" />
          </section>

          {/* Payment */}
          <section className="card" style={{ padding: 20 }}>
            <h3 className="text-lg" style={{ marginBottom: 14 }}>Pagamento</h3>
            <div className="stack" style={{ gap: 10 }}>
              {paymentMethods.map((m) => (
                <button key={m.id} className="row" style={{ gap: 12, padding: '14px 16px', borderRadius: 14, background: method === m.id ? 'var(--neon-soft)' : 'var(--surface-2)', border: `1px solid ${method === m.id ? 'var(--neon)' : 'var(--border)'}`, textAlign: 'left', width: '100%', color: 'var(--text)' }} onClick={() => setMethod(m.id)}>
                  <m.icon size={20} style={{ color: method === m.id ? 'var(--neon)' : 'var(--muted)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="text-sm font-bold">{m.label}</div>
                    <div className="text-xs text-muted">{m.desc}</div>
                  </div>
                  {method === m.id && <CheckCircle2 size={18} style={{ color: 'var(--neon)' }} />}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted" style={{ marginTop: 12 }}>
              <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />
              Ambiente de demonstração — nenhum pagamento real é processado.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="card" style={{ padding: 22, alignSelf: 'start', position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
          <h3 className="text-lg" style={{ marginBottom: 16 }}>Resumo do pedido</h3>
          <div className="row between text-sm" style={{ marginBottom: 10 }}>
            <span className="text-muted">Subtotal</span><span><Money value={subtotal} /></span>
          </div>
          {discount > 0 && (
            <div className="row between text-sm" style={{ marginBottom: 10, color: 'var(--neon)' }}>
              <span>Desconto ({coupon})</span><span>- <Money value={discount} /></span>
            </div>
          )}
          <div className="row between text-sm" style={{ marginBottom: 10 }}>
            <span className="text-muted">Frete</span>
            <span>{shipping === 0 ? <span className="text-neon">Grátis</span> : <Money value={shipping} />}</span>
          </div>
          <div className="divider" />
          <div className="row between text-lg font-bold" style={{ marginBottom: 16 }}>
            <span>Total</span><span style={{ color: 'var(--neon)' }}><Money value={total + shipping} /></span>
          </div>
          <Button block size="lg" onClick={onConfirm} disabled={placing}>
            {placing ? 'Processando pedido...' : `Confirmar pedido · ${method === 'pix' ? 'Pix' : method === 'card' ? 'Cartão' : 'Boleto'}`}
          </Button>
          <Link to="/loja" className="btn btn-ghost btn-block text-sm" style={{ marginTop: 10 }}>Continuar comprando</Link>
        </aside>
      </div>

      <Modal open={!!done} onClose={() => { navigate('/loja/pedidos'); }} title="Pedido confirmado">
        <div className="center" style={{ flexDirection: 'column', gap: 12, padding: '6px 0', textAlign: 'center' }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'var(--neon-soft)', color: 'var(--neon)', display: 'grid', placeItems: 'center' }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl">Compra realizada!</h3>
          <p className="text-sm text-muted">Seu pedido <strong className="text-dim">{done}</strong> foi registrado. Acompanhe em "Meus pedidos".</p>
          <Button block onClick={() => { clearCart(); navigate('/loja/pedidos') }}>Acompanhar pedido</Button>
          <Button block variant="ghost" onClick={() => { clearCart(); navigate('/loja') }}>Continuar comprando</Button>
        </div>
      </Modal>
    </div>
  )
}