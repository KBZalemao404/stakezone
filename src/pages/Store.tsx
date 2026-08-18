import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Ticket, Search, Package, ArrowRight } from 'lucide-react'
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/store'
import type { Product } from '../data/types'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Badge, Button, SectionHeader, Money, EmptyState } from '../components/ui'

export function ProductMedia({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className="product-media" style={{ background: product.gradient }}>
      <span className="font-display" style={{ fontSize: '3rem', fontWeight: 700, opacity: 0.16, letterSpacing: '-0.05em' }}>
        SZ
      </span>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120px 120px at 80% 15%, rgba(255,255,255,0.28), transparent 60%)',
        }}
      />
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, addToCart } = useCart()
  const navigate = useNavigate()
  const fav = favorites.includes(product.id)

  return (
    <div className="product-card">
      <div className="product-media" onClick={() => navigate(`/loja/${product.id}`)} style={{ cursor: 'pointer' }}>
        <ProductMedia product={product} />
        {product.badge && <span className="product-discount">{product.badge}</span>}
        <button className="fav-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }} aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
          <Heart size={17} fill={fav ? 'currentColor' : 'none'} className={fav ? 'text-red' : ''} />
        </button>
      </div>
      <div style={{ padding: '14px 15px 16px' }}>
        <div className="row between" style={{ marginBottom: 7 }}>
          <Badge tone="muted" className="badge-muted">{product.category}</Badge>
          <span className="text-xs text-muted">★ {product.rating}</span>
        </div>
        <h3 className="text-sm font-bold" style={{ lineHeight: 1.3, minHeight: 40 }} onClick={() => navigate(`/loja/${product.id}`)}>
          {product.name}
        </h3>
        <div className="row between" style={{ marginTop: 12 }}>
          <div className="price-line">
            <span className="price-now"><Money value={product.price} /></span>
            {product.oldPrice && <span className="price-was"><Money value={product.oldPrice} /></span>}
          </div>
          <button
            className="btn btn-primary btn-sm"
            aria-label={`Adicionar ${product.name} ao carrinho`}
            onClick={() => addToCart(product, 1, product.colors?.[0] ?? 'Único', product.sizes?.[0] ?? 'Único')}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function StorePage() {
  const [cat, setCat] = useState('Todos')
  const [query, setQuery] = useState('')
  const { favorites } = useCart()
  const { toast } = useToast()

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (cat !== 'Todos' && p.category !== cat) return false
        if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [cat, query]
  )

  return (
    <div className="page container">
      <SectionHeader
        title="StakeZone Store"
        subtitle="Camisetas, bonés, acessórios e itens exclusivos da sua plataforma"
        action={
          <div className="row" style={{ gap: 10 }}>
            <Link to="/loja/favoritos" className="btn btn-outline">
              <Heart size={16} /> Favoritos ({favorites.length})
            </Link>
            <Link to="/loja/pedidos" className="btn btn-outline">
              <Package size={16} /> Meus pedidos
            </Link>
          </div>
        }
      />

      {/* coupon banner */}
      <div className="promo-card" style={{ background: 'linear-gradient(120deg, #2b1a08, #14101d)', marginBottom: 24, minHeight: 0, padding: '20px 24px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--gold-soft)', color: 'var(--gold)', display: 'grid', placeItems: 'center' }}>
            <Ticket size={22} />
          </span>
          <div>
            <h3 className="text-lg">Cupom de primeira compra: <span className="text-gold">STORE20</span></h3>
            <p className="text-sm text-muted">Ganhe 20% de desconto na sua primeira compra. Frete grátis acima de R$ 199.</p>
          </div>
        </div>
        <Button variant="gold" size="sm" onClick={() => { navigator.clipboard?.writeText('STORE20'); toast('Cupom copiado', 'Cole o cupom no checkout para aplicar o desconto.', 'gold') }}>
          Copiar cupom
        </Button>
      </div>

      {/* categories */}
      <div className="row wrap" style={{ gap: 8, marginBottom: 18 }}>
        {PRODUCT_CATEGORIES.map((c) => (
          <button key={c} className={`sports-tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c}
            {c !== 'Todos' && (
              <span className="badge badge-muted" style={{ padding: '1px 7px', fontSize: '0.6rem' }}>
                {PRODUCTS.filter((p) => p.category === c).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 22, maxWidth: 420 }}>
        <div className="row" style={{ gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px', flex: 1 }}>
          <Search size={15} className="text-muted" />
          <input
            className="input"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '10px 0' }}
            placeholder="Buscar produtos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="Nenhum produto encontrado" desc="Tente outra categoria ou termo de busca." />
      ) : (
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <div className="row center" style={{ marginTop: 40 }}>
        <Link to="/esportes" className="btn btn-outline">
          Aposte e ganhe mais para trocar por produtos <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
