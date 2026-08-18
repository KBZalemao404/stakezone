import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Button, Money } from '../ui'

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeFromCart, updateQty, subtotal, total, discount, coupon, removeCoupon, cartCount } = useCart()
  const navigate = useNavigate()

  const keyOf = (color: string, size: string, id: string) => `${id}-${color}-${size}`

  return (
    <>
      {cartOpen && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0, zIndex: 240 }} onClick={() => setCartOpen(false)}>
          <aside
            className="anim-slide-up"
            style={{ width: 'min(430px, 100vw)', height: '100vh', background: 'var(--bg-2)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Carrinho de compras"
          >
            <div className="row between" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="row" style={{ gap: 10 }}>
                <ShoppingBag size={18} style={{ color: 'var(--gold)' }} />
                <h3 className="text-lg">Seu carrinho</h3>
                <span className="badge badge-gold">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {items.length === 0 && (
                <div className="center" style={{ height: '100%', flexDirection: 'column', gap: 10, color: 'var(--muted)', textAlign: 'center' }}>
                  <ShoppingBag size={40} style={{ opacity: 0.4 }} />
                  <p className="text-sm">Seu carrinho está vazio.</p>
                  <Button variant="outline" size="sm" onClick={() => { setCartOpen(false); navigate('/loja') }}>
                    Explorar a loja
                  </Button>
                </div>
              )}

              {items.map((i) => (
                <div key={keyOf(i.color, i.size, i.product.id)} className="slip-item" style={{ padding: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: i.product.gradient, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm font-bold" style={{ lineHeight: 1.25 }}>{i.product.name}</div>
                    <div className="text-xs text-muted" style={{ marginTop: 3 }}>
                      {i.color} · {i.size}
                    </div>
                    <div className="row between" style={{ marginTop: 8 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: 4, borderRadius: 7 }} onClick={() => updateQty(keyOf(i.color, i.size, i.product.id), -1)} aria-label="Diminuir quantidade">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm" style={{ width: 22, textAlign: 'center' }}>{i.qty}</span>
                        <button className="btn btn-ghost" style={{ padding: 4, borderRadius: 7 }} onClick={() => updateQty(keyOf(i.color, i.size, i.product.id), 1)} aria-label="Aumentar quantidade">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="font-bold text-sm" style={{ color: 'var(--neon)' }}>
                        <Money value={i.product.price * i.qty} />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: 5, color: 'var(--red)' }} onClick={() => removeFromCart(keyOf(i.color, i.size, i.product.id))} aria-label="Remover item">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '18px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                {coupon && (
                  <div className="row between" style={{ marginBottom: 10 }}>
                    <span className="badge badge-gold">Cupom {coupon}</span>
                    <button className="text-xs" style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 700 }} onClick={removeCoupon}>
                      Remover
                    </button>
                  </div>
                )}
                <div className="row between text-sm text-muted" style={{ marginBottom: 6 }}>
                  <span>Subtotal</span><span><Money value={subtotal} /></span>
                </div>
                {discount > 0 && (
                  <div className="row between text-sm" style={{ marginBottom: 6, color: 'var(--neon)' }}>
                    <span>Desconto</span><span>- <Money value={discount} /></span>
                  </div>
                )}
                <div className="row between text-lg font-bold" style={{ margin: '10px 0 14px' }}>
                  <span>Total</span><span style={{ color: 'var(--neon)' }}><Money value={total} /></span>
                </div>
                <Button block onClick={() => { setCartOpen(false); navigate('/loja/checkout') }}>
                  Finalizar compra
                </Button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  )
}
