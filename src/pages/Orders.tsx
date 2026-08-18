import { Link } from 'react-router-dom'
import { Package, ArrowLeft, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button, EmptyState, Money, SectionHeader, Badge } from '../components/ui'

const statusTone: Record<string, 'neon' | 'gold' | 'blue' | 'muted'> = {
  processando: 'gold', enviado: 'blue', entregue: 'neon', cancelado: 'muted',
}

export function OrdersPage() {
  const { orders } = useCart()

  return (
    <div className="page container">
      <SectionHeader
        title="Meus pedidos"
        subtitle="Acompanhe o status das suas compras na loja"
        action={<Link to="/loja"><Button variant="outline" size="sm"><ArrowLeft size={15} /> Voltar à loja</Button></Link>}
      />

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="Nenhum pedido ainda" desc="Seus pedidos aparecerão aqui."
          action={<Link to="/loja"><Button>Explorar a loja</Button></Link>} />
      ) : (
        <div className="stack stagger" style={{ gap: 16 }}>
          {orders.map((o) => (
            <article key={o.id} className="card card-hover" style={{ padding: 20 }}>
              <div className="row between wrap" style={{ gap: 10, marginBottom: 14 }}>
                <div>
                  <div className="row" style={{ gap: 10 }}>
                    <Package size={17} style={{ color: 'var(--neon)' }} />
                    <span className="font-bold">{o.id}</span>
                    <span className="text-xs text-muted">· {o.placedAt}</span>
                  </div>
                  <div className="row" style={{ gap: 5, marginTop: 6, color: 'var(--muted)' }}>
                    <MapPin size={13} />
                    <span className="text-xs">{o.address}</span>
                  </div>
                </div>
                <Badge tone={statusTone[o.status]}>{o.status}</Badge>
              </div>

              <div className="stack" style={{ gap: 10 }}>
                {o.items.map((i, idx) => (
                  <div key={idx} className="row" style={{ gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 9, background: i.product.gradient || 'var(--surface-3)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-bold">{i.product.name}</div>
                      <div className="text-xs text-muted">{i.color} · {i.size} · Qtd {i.qty}</div>
                    </div>
                    <span className="text-sm font-bold"><Money value={i.product.price * i.qty} /></span>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div className="row between text-sm">
                <span className="text-muted">
                  Subtotal <Money value={o.subtotal} />
                  {o.discount > 0 && <> · Desconto <span className="text-neon">- <Money value={o.discount} /></span></>}
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--neon)' }}>Total <Money value={o.total} /></span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
