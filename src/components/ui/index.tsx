import { type ButtonHTMLAttributes, type ReactNode, useEffect, useState } from 'react'
import { X, type LucideIcon } from 'lucide-react'

/* ============ Logo ============ */
export function Logo({ size = 38 }: { size?: number }) {
  return (
    <span className="logo">
      <span className="logo-mark" style={{ width: size, height: size, borderRadius: 11 }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 64 64" fill="none" aria-hidden>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22ff88" />
              <stop offset="1" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <path d="M36 8 L18 36 h12 L26 56 L46 26 h-13 z" fill="url(#lg)" />
        </svg>
      </span>
      <span>Stake<span style={{ color: 'var(--neon)' }}>Zone</span></span>
    </span>
  )
}

/* ============ Button ============ */
type BtnVariant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}
export function Button({ variant = 'primary', size = 'md', block, className = '', children, ...rest }: BtnProps) {
  return (
    <button
      className={`btn btn-${variant}${size !== 'md' ? ` btn-${size}` : ''}${block ? ' btn-block' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ============ Badge ============ */
export function Badge({ children, tone = 'neon', className = '' }: { children: ReactNode; tone?: 'neon' | 'gold' | 'muted' | 'blue' | 'live' | 'red'; className?: string }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>
}

/* ============ Section Header ============ */
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="row between wrap gap-3" style={{ marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.45rem', letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ============ Skeleton ============ */
export function Skeleton({ width = '100%', height = 16, radius = 12, style }: { width?: string | number; height?: number; radius?: number; style?: React.CSSProperties }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
}

export function SkeletonCard({ lines = 3, height = 150 }: { lines?: number; height?: number }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <Skeleton height={height} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${80 - i * 12}%`} height={12} style={{ marginTop: 12 }} />
      ))}
    </div>
  )
}

/* ============ Modal ============ */
export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.05rem' }}>{title}</h3>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Fechar" style={{ padding: 8, borderRadius: 10 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
        {footer && <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border)' }}>{footer}</div>}
      </div>
    </div>
  )
}

/* ============ Confirmation Modal ============ */
export function ConfirmModal({ open, onClose, onConfirm, title, desc, confirmLabel = 'Confirmar', loading }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; desc: ReactNode; confirmLabel?: string; loading?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="stack gap-2">{desc}</div>
      <div className="row gap-3" style={{ marginTop: 22, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? 'Processando...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

/* ============ Stat Card ============ */
export function StatCard({ icon: Icon, label, value, delta, tone = 'neon' }: { icon: LucideIcon; label: string; value: string; delta?: string; tone?: 'neon' | 'gold' | 'red' | 'blue' }) {
  const color = tone === 'gold' ? 'var(--gold)' : tone === 'red' ? 'var(--red)' : tone === 'blue' ? '#7aa2ff' : 'var(--neon)'
  return (
    <div className="card card-hover luminous" style={{ padding: 18 }}>
      <div className="row between">
        <div className="badge" style={{ background: `${color}1f`, color }}><Icon size={14} /></div>
        {delta && <span className="text-xs font-bold" style={{ color }}>{delta}</span>}
      </div>
      <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 12 }}>{value}</div>
      <div className="text-muted text-sm" style={{ marginTop: 2 }}>{label}</div>
    </div>
  )
}

/* ============ Empty State ============ */
export function EmptyState({ icon: Icon, title, desc, action }: { icon: LucideIcon; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="card center" style={{ padding: '44px 24px', textAlign: 'center', flexDirection: 'column', gap: 8 }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--surface-3)', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '1.05rem', marginTop: 6 }}>{title}</h3>
      <p className="text-muted text-sm">{desc}</p>
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </div>
  )
}

/* ============ Tabs ============ */
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
      {tabs.map((t) => (
        <button key={t} className={`sports-tab ${active === t ? 'active' : ''}`} onClick={() => onChange(t)}>
          {t}
        </button>
      ))}
    </div>
  )
}

/* ============ Avatar ============ */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.32 }}>{initials}</span>
}

/* ============ useCountUp hook ============ */
export function useCountUp(target: number, duration = 700) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setVal(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

export function Money({ value, animated = false }: { value: number; animated?: boolean }) {
  const v = animated ? useCountUp(value) : value
  return <>{v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</>
}
