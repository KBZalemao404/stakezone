import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product, StoreOrder } from '../data/types'
import { useToast } from './ToastContext'

interface CartCtx {
  items: CartItem[]
  favorites: string[]
  toggleFavorite: (id: string) => void
  addToCart: (p: Product, qty?: number, color?: string, size?: string) => void
  removeFromCart: (key: string) => void
  updateQty: (key: string, delta: number) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  cartOpen: boolean
  setCartOpen: (b: boolean) => void
  coupon: string | null
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  discount: number
  total: number
  orders: StoreOrder[]
  placeOrder: (address: string) => StoreOrder
  badgeKey: number
}

const Ctx = createContext<CartCtx | null>(null)

export const useCart = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const validCoupons: Record<string, number> = { STORE20: 0.2, BEMVINDO10: 0.1, VIP15: 0.15, FANATICO5: 0.05 }

const seedOrders: StoreOrder[] = [
  {
    id: 'ST-1042', status: 'enviado', placedAt: '10/08/2026',
    subtotal: 579.7, discount: 0, total: 579.7, address: 'Av. Paulista, 1000 — São Paulo/SP',
    items: [
      { product: { id: 'p1', name: 'Camisa Oficial StakeZone 2026', category: 'Camisetas', price: 349.9, image: '', gradient: '', rating: 0, description: '', stock: 0 }, qty: 1, color: 'Preto', size: 'M' },
      { product: { id: 'p4', name: 'Boné Edição Limitada Gold', category: 'Bonés', price: 129.9, image: '', gradient: '', rating: 0, description: '', stock: 0 }, qty: 1, color: 'Dourado', size: 'Único' },
      { product: { id: 'p9', name: 'Bola de Futebol Pro Match', category: 'Equipamentos', price: 99.9, image: '', gradient: '', rating: 0, description: '', stock: 0 }, qty: 1, color: 'Único', size: 'Único' },
    ],
  },
]

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>(['p1', 'p4'])
  const [cartOpen, setCartOpen] = useState(false)
  const [coupon, setCoupon] = useState<string | null>(null)
  const [orders, setOrders] = useState<StoreOrder[]>(seedOrders)
  const [badgeKey, setBadgeKey] = useState(0)
  const { toast } = useToast()

  const keyOf = (p: Product, color: string, size: string) => `${p.id}-${color}-${size}`

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const on = prev.includes(id)
      toast(on ? 'Removido dos favoritos' : 'Adicionado aos favoritos', undefined, 'info')
      return on ? prev.filter((x) => x !== id) : [...prev, id]
    })
  }, [toast])

  const addToCart = useCallback((p: Product, qty = 1, color = '', size = '') => {
    setItems((prev) => {
      const key = keyOf(p, color, size)
      const ex = prev.find((i) => keyOf(i.product, i.color, i.size) === key)
      if (ex) {
        return prev.map((i) => (keyOf(i.product, i.color, i.size) === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { product: p, qty, color, size }]
    })
    setBadgeKey((k) => k + 1)
    setCartOpen(true)
    toast('Produto adicionado', `${p.name} foi adicionado ao carrinho.`, 'gold')
  }, [toast])

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => keyOf(i.product, i.color, i.size) !== key))
  }, [])

  const updateQty = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (keyOf(i.product, i.color, i.size) === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [])

  const cartCount = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((a, i) => a + i.product.price * i.qty, 0), [items])
  const discount = useMemo(() => (coupon ? subtotal * (validCoupons[coupon] ?? 0) : 0), [coupon, subtotal])
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])

  const applyCoupon = useCallback((code: string) => {
    const c = code.trim().toUpperCase()
    if (validCoupons[c]) {
      setCoupon(c)
      toast('Cupom aplicado', `${c} — desconto de ${validCoupons[c] * 100}% aplicado.`, 'gold')
      return true
    }
    toast('Cupom inválido', 'O código informado não é válido.', 'error')
    return false
  }, [toast])

  const removeCoupon = useCallback(() => setCoupon(null), [])

  const placeOrder = useCallback((address: string): StoreOrder => {
    const order: StoreOrder = {
      id: `ST-${Math.floor(1043 + Math.random() * 8000)}`,
      items: [...items],
      subtotal, discount, coupon: coupon ?? undefined, total,
      status: 'processando', placedAt: 'Agora', address,
    }
    setOrders((prev) => [order, ...prev])
    setItems([])
    setCoupon(null)
    return order
  }, [items, subtotal, discount, coupon, total])

  const value = useMemo(
    () => ({
      items, favorites, toggleFavorite, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, subtotal, cartOpen, setCartOpen, coupon, applyCoupon, removeCoupon,
      discount, total, orders, placeOrder, badgeKey,
    }),
    [items, favorites, toggleFavorite, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal, cartOpen, coupon, applyCoupon, removeCoupon, discount, total, orders, placeOrder, badgeKey]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
