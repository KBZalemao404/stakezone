import { useState } from 'react'
import { Gift, Ticket, TrendingUp, Copy, Lock } from 'lucide-react'
import { PROMOTIONS } from '../data/store'
import { Badge, Button, SectionHeader } from '../components/ui'
import { useToast } from '../context/ToastContext'

export function PromotionsPage() {
  const { toast } = useToast()
  const [tosOpen, setTosOpen] = useState<string | null>(null)
  const active = PROMOTIONS.filter((p) => p.active)
  const inactive = PROMOTIONS.filter((p) => !p.active)

  const render = (id: string, title: string, desc: string, tag: string, gradient: string, tos: string, enabled: boolean) => (
    <div key={id} className="promo-card" style={{ background: `linear-gradient(150deg, ${gradient.includes('rgba') ? '#151525' : 'var(--surface-2)'}, var(--surface))`, minHeight: 240 }}>
      <div className="promo-bg" style={{ background: `radial-gradient(420px 200px at 85% 10%, ${gradient.replace('rgba', 'rgba').replace('0.9', '0.25').replace('0.8', '0.2')}, transparent 60%)` }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="row between">
          <Badge tone="gold">{tag}</Badge>
          {!enabled && <Badge tone="muted">Em breve</Badge>}
        </div>
        <h3 className="text-xl" style={{ marginTop: 14 }}>{title}</h3>
        <p className="text-sm text-muted" style={{ marginTop: 8 }}>{desc}</p>
        <div className="row" style={{ gap: 10, marginTop: 'auto', paddingTop: 22 }}>
          <Button disabled={!enabled} onClick={() => { toast('Promoção ativada (demo)', 'Bônus de demonstração aplicado.', 'gold') }}>
            <Gift size={16} /> Ativar bônus
          </Button>
          <Button variant="outline" disabled={!enabled} onClick={() => setTosOpen(id)}>Termos</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page container">
      <SectionHeader
        title="Promoções e bônus"
        subtitle="Aproveite ofertas exclusivas — todas sujeitas a termos e condições"
      />

      <div className="card" style={{ padding: '22px 24px', marginBottom: 28, background: 'linear-gradient(130deg, rgba(255,209,102,0.1), var(--surface))' }}>
        <div className="row between wrap" style={{ gap: 16 }}>
          <div>
            <h2 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ticket size={18} style={{ color: 'var(--gold)' }} /> Cupom de primeira compra
            </h2>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>20% de desconto na StakeZone Store. Use o código abaixo no checkout.</p>
          </div>
          <Button variant="gold" onClick={() => { navigator.clipboard?.writeText('STORE20'); toast('Cupom copiado', 'Use STORE20 no checkout da loja.', 'gold') }}>
            <Copy size={16} /> Copiar STORE20
          </Button>
        </div>
      </div>

      <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {active.map((p) => render(p.id, p.title, p.desc, p.tag, p.gradient, p.tos, p.active))}
      </div>

      {inactive.length > 0 && (
        <>
          <h3 className="text-xl" style={{ margin: '40px 0 18px' }}>Em breve</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {inactive.map((p) => render(p.id, p.title, p.desc, p.tag, p.gradient, p.tos, p.active))}
          </div>
        </>
      )}

      <div className="row" style={{ gap: 8, marginTop: 40, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
        <Lock size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
        <p className="text-xs text-muted">
          Todos os bônus e promoções estão sujeitos a termos e condições completos, incluindo requisitos de
          rollover, prazo de validade e exclusões de mercados. Apostas de demonstração não possuem valor real.
          Jogue com responsabilidade. 18+.
        </p>
      </div>

      {tosOpen && (
        <div className="modal-overlay" onClick={() => setTosOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: 24 }}>
            <h3 className="text-lg" style={{ marginBottom: 12 }}>Termos e condições da promoção</h3>
            <p className="text-sm text-dim" style={{ lineHeight: 1.7 }}>
              {PROMOTIONS.find((p) => p.id === tosOpen)?.tos}
            </p>
            <p className="text-xs text-muted" style={{ marginTop: 14 }}>
              Demais condições: 1. O bônus é creditado uma única vez por usuário. 2. Requer rollover conforme
              descrito. 3. A StakeZone reserva-se o direito de revogar bônus em caso de abuso. 4. Promoções de
              demonstração não têm valor monetário.
            </p>
            <Button block style={{ marginTop: 18 }} onClick={() => setTosOpen(null)}>Entendi</Button>
          </div>
        </div>
      )}
    </div>
  )
}
