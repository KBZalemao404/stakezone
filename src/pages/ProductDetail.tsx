import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Minus, Plus, Check, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react'
import { PRODUCTS } from '../data/store'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Badge, Button, Money, EmptyState } from '../components/ui'
import { ProductCard, ProductMedia } from './Store'

export function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id)
  const { favorites, toggleFavorite, addToCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [color, setColor] = useState(product?.colors?.[0] ?? 'Único')
  const [size, setSize] = useState(product?.sizes?.[0] ?? 'Único')
  const [qty, setQty] = useState(1)

  const related = useMemo(() => PRODUCTS.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4), [product])

  if (!product) {
    return (
      <div className="page container">
        <EmptyState icon={ShoppingCart} title="Produto não encontrado" desc="O produto que você procura não existe."
          action={<Link to="/loja"><Button>Voltar à loja</Button></Link>} />
      </div>
    )
  }

  const fav = favorites.includes(product.id)

  return (
    <div className="page container">
      <nav className="row" style={{ gap: 6, marginBottom: 22, color: 'var(--muted)' }} aria-label="Breadcrumb">
        <Link to="/loja" className="text-sm">Loja</Link>
        <ChevronRight size={14} />
        <Link to="/loja" className="text-sm">{(product as { category?: string }).category}</Link>
        <ChevronRight size={14} />
        <span className="text-sm text-dim">{product.name}</span>
      </nav>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        <div className="product-media anim-fade-up" style={{ aspectRatio: '4/3', borderRadius: 24, border: '1px solid var(--border)' }}>
          <ProductMedia product={product} />
          {product.badge && <span className="product-discount">{product.badge}</span>}
        </div>

        <div className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="row wrap" style={{ gap: 8 }}>
            <Badge tone="muted">{product.category}</Badge>
            {product.badge && <Badge tone="gold">{product.badge}</Badge>}
            <span className="text-sm text-muted">★ {product.rating} · {product.stock} em estoque</span>
          </div>
          <h1 className="text-2xl" style={{ marginTop: 14, letterSpacing: '-0.02em' }}>{product.name}</h1>
          <p className="text-sm text-dim" style={{ marginTop: 10 }}>{product.description}</p>

          <div className="price-line" style={{ marginTop: 18 }}>
            <span className="price-now" style={{ fontSize: '1.7rem' }}><Money value={product.price} /></span>
            {product.oldPrice && <span className="price-was" style={{ fontSize: '1.1rem' }}><Money value={product.oldPrice} /></span>}
            {product.oldPrice && (
              <span className="badge badge-gold">Economize <Money value={product.oldPrice - product.price} /></span>
            )}
          </div>

          {product.colors && (
            <div style={{ marginTop: 20 }}>
              <label className="field-label">Cor: <span className="text-dim">{color}</span></label>
              <div className="row" style={{ gap: 8 }}>
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className="btn btn-sm"
                    style={{
                      background: color === c ? 'var(--neon-soft)' : 'var(--surface-2)',
                      border: `1px solid ${color === c ? 'var(--neon)' : 'var(--border)'}`,
                      color: color === c ? 'var(--neon)' : 'var(--muted)',
                    }}
                    onClick={() => setColor(c)}
                  >
                    {color === c && <Check size={13} />} {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div style={{ marginTop: 16 }}>
              <label className="field-label">Tamanho: <span className="text-dim">{size}</span></label>
              <div className="row" style={{ gap: 8 }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className="btn btn-sm"
                    style={{
                      minWidth: 46,
                      background: size === s ? 'var(--neon-soft)' : 'var(--surface-2)',
                      border: `1px solid ${size === s ? 'var(--neon)' : 'var(--border)'}`,
                      color: size === s ? 'var(--neon)' : 'var(--muted)',
                    }}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="row" style={{ gap: 14, marginTop: 24 }}>
            <div className="row" style={{ gap: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade"><Minus size={16} /></button>
              <span className="font-bold" style={{ minWidth: 34, textAlign: 'center' }}>{qty}</span>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setQty((q) => q + 1)} aria-label="Aumentar quantidade"><Plus size={16} /></button>
            </div>
            <Button size="lg" style={{ flex: 1 }} onClick={() => { addToCart(product, qty, color, size); toast(`${qty}x ${product.name} adicionado`, undefined, 'gold') }}>
              <ShoppingCart size={18} /> Adicionar ao carrinho · <Money value={product.price * qty} />
            </Button>
            <Button variant="outline" size="lg" aria-label="Adicionar aos favoritos" onClick={() => toggleFavorite(product.id)}>
              <Heart size={19} fill={fav ? 'currentColor' : 'none'} className={fav ? 'text-red' : ''} />
            </Button>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginTop: 26 }}>
            {[
              { icon: Truck, label: 'Frete grátis +R$ 199' },
              { icon: RotateCcw, label: 'Troca em 30 dias' },
              { icon: ShieldCheck, label: 'Compra 100% segura' },
            ].map((b) => (
              <div key={b.label} className="card" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: 12 }}>
                <b.icon size={18} style={{ color: 'var(--neon)', margin: '0 auto 6px' }} />
                <div className="text-xs text-muted">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 44 }}>
          <h2 className="text-xl" style={{ marginBottom: 18 }}>Você também pode gostar</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
