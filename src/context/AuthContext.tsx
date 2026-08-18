import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { NotificationItem, Transaction } from '../data/types'

export interface User {
  name: string
  email: string
  username: string
  verified: boolean
  twoFactor: boolean
  level: number
  joinedAt: string
}

interface AuthCtx {
  user: User
  isLogged: boolean
  login: (email?: string) => void
  logout: () => void
  balance: number
  bonusBalance: number
  addBalance: (n: number) => void
  removeBalance: (n: number) => void
  transactions: Transaction[]
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void
  notifications: NotificationItem[]
  markAllRead: () => void
  updateUser: (patch: Partial<User>) => void
}

const Ctx = createContext<AuthCtx | null>(null)

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const initialTx: Transaction[] = [
  { id: 'tx1', type: 'deposito', amount: 500, status: 'concluido', method: 'Pix', date: 'Hoje, 09:12', ref: 'DEP-88421' },
  { id: 'tx2', type: 'bonus', amount: 100, status: 'concluido', method: 'Bônus de boas-vindas', date: 'Hoje, 09:13', ref: 'BONUS-WELCOME' },
  { id: 'tx3', type: 'aposta', amount: -50, status: 'concluido', method: 'Aposta simples', date: 'Ontem, 21:40', ref: 'BET-22091' },
  { id: 'tx4', type: 'saque', amount: -200, status: 'pendente', method: 'Pix', date: 'Ontem, 18:05', ref: 'WD-11032' },
]

const initialNotifs: NotificationItem[] = [
  { id: 'n1', type: 'bonus', title: 'Bônus de boas-vindas ativado!', desc: 'R$ 100,00 de bônus foram creditados na sua conta.', time: 'há 2h', read: false },
  { id: 'n2', type: 'bet', title: 'Aposta encerrada', desc: 'Sua aposta #22091 em Flamengo venceu. Retorno de R$ 92,50.', time: 'há 5h', read: false },
  { id: 'n3', type: 'store', title: 'Pedido enviado', desc: 'O pedido #ST-1042 saiu para entrega. Rastreie agora.', time: 'ontem', read: true },
  { id: 'n4', type: 'wallet', title: 'Saque em processamento', desc: 'Sua retirada de R$ 200,00 está sendo processada.', time: 'ontem', read: true },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: 'Rafael Santos',
    email: 'rafa.santos@email.com',
    username: 'rafael_goat',
    verified: true,
    twoFactor: false,
    level: 2,
    joinedAt: 'Março de 2025',
  })
  const [isLogged, setIsLogged] = useState(true)
  const [balance, setBalance] = useState(3250.5)
  const [bonusBalance, setBonusBalance] = useState(100)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTx)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifs)

  const login = useCallback(() => setIsLogged(true), [])
  const logout = useCallback(() => setIsLogged(false), [])

  const addBalance = useCallback((n: number) => setBalance((b) => b + n), [])
  const removeBalance = useCallback((n: number) => setBalance((b) => b - n), [])

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions((prev) => [{ ...t, id: `tx-${Date.now()}`, date: 'Agora' }, ...prev])
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => ({ ...u, ...patch }))
  }, [])

  const value = useMemo(
    () => ({
      user, isLogged, login, logout, balance, bonusBalance, addBalance, removeBalance,
      transactions, addTransaction, notifications, markAllRead, updateUser,
    }),
    [user, isLogged, balance, bonusBalance, transactions, notifications, login, logout, addBalance, removeBalance, addTransaction, markAllRead, updateUser]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
