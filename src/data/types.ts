export type SportId = 'futebol' | 'basquete' | 'tenis' | 'esports' | 'futebol-americano' | 'baseball' | 'mma'

export interface OddsMarkets {
  home: number
  draw: number
  away: number
  handicapHome: number
  handicapAway: number
  over: number
  under: number
}

export interface Match {
  id: string
  sport: SportId
  championship: string
  country: string
  home: string
  away: string
  homeScore?: number
  awayScore?: number
  live: boolean
  minute?: number
  startTime: string
  markets: OddsMarkets
  hot?: boolean
}

export interface SportMeta {
  id: SportId
  label: string
  icon: string
  color: string
}

export interface Selection {
  id: string
  matchId: string
  sport: SportId
  home: string
  away: string
  championship: string
  market: string
  marketLabel: string
  pick: string
  odds: number
  live?: boolean
  liveScore?: string
}

export interface BetRecord {
  id: string
  selections: Selection[]
  stake: number
  totalOdds: number
  potentialReturn: number
  status: 'won' | 'lost' | 'pending' | 'cancelled'
  placedAt: string
  type: 'simples' | 'combinada'
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  image: string
  gradient: string
  badge?: string
  rating: number
  colors?: string[]
  sizes?: string[]
  description: string
  stock: number
}

export interface CartItem {
  product: Product
  qty: number
  color: string
  size: string
}

export interface StoreOrder {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  coupon?: string
  total: number
  status: 'processando' | 'enviado' | 'entregue' | 'cancelado'
  placedAt: string
  address: string
}

export interface Promotion {
  id: string
  title: string
  desc: string
  tag: string
  type: 'bonus' | 'casino' | 'loja' | 'cashback'
  gradient: string
  tos: string
  active: boolean
}

export interface Transaction {
  id: string
  type: 'deposito' | 'saque' | 'aposta' | 'bonus' | 'reembolso' | 'loja'
  amount: number
  status: 'concluido' | 'pendente' | 'recusado'
  method: string
  date: string
  ref: string
}

export interface NotificationItem {
  id: string
  type: 'bet' | 'bonus' | 'store' | 'wallet' | 'system'
  title: string
  desc: string
  time: string
  read: boolean
}
