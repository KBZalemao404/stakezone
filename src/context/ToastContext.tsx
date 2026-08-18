import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, X, ShoppingBag } from 'lucide-react'

export interface ToastData {
  id: number
  title: string
  desc?: string
  type?: 'success' | 'info' | 'gold' | 'error'
}

interface ToastCtx {
  toast: (title: string, desc?: string, type?: ToastData['type']) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const idRef = useRef(0)

  const toast = useCallback((title: string, desc?: string, type: ToastData['type'] = 'success') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, title, desc, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = t.type === 'error' ? AlertTriangle : t.type === 'gold' ? ShoppingBag : CheckCircle2
          return (
            <div key={t.id} className={`toast ${t.type === 'gold' ? 'gold' : t.type === 'error' ? 'error' : ''}`}>
              <Icon size={19} style={{ color: t.type === 'gold' ? 'var(--gold)' : t.type === 'error' ? 'var(--red)' : 'var(--neon)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="toast-title">{t.title}</div>
                {t.desc && <div className="toast-desc">{t.desc}</div>}
              </div>
              <button onClick={() => remove(t.id)} aria-label="Fechar notificação" className="btn btn-ghost" style={{ padding: 4, borderRadius: 8, width: 28, height: 28 }}>
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}
