import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { BetRecord, Selection } from '../data/types'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

interface BetSlipCtx {
  selections: Selection[]
  addSelection: (s: Selection) => void
  removeSelection: (id: string) => void
  clearSlip: () => void
  stake: number
  setStake: (n: number) => void
  hasStake: boolean
  setHasStake: (b: boolean) => void
  placeBet: () => Promise<BetRecord>
  isPlacing: boolean
  placedBets: BetRecord[]
  open: boolean
  setOpen: (b: boolean) => void
  activeTab: 'aposta' | 'historico'
  setActiveTab: (t: 'aposta' | 'historico') => void
  totalOdds: number
  potentialReturn: number
}

const Ctx = createContext<BetSlipCtx | null>(null)

export const useBetSlip = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBetSlip must be used within BetSlipProvider')
  return ctx
}

const seedBets: BetRecord[] = [
  {
    id: 'BET-22091', type: 'simples', stake: 50, totalOdds: 1.85, potentialReturn: 92.5,
    status: 'won', placedAt: 'Ontem, 21:40',
    selections: [{ id: 's1', matchId: 'f1', sport: 'futebol', home: 'Flamengo', away: 'Palmeiras', championship: 'Brasileirão', market: 'home', marketLabel: 'Vitória', pick: 'Flamengo', odds: 1.85 }],
  },
  {
    id: 'BET-22090', type: 'combinada', stake: 25, totalOdds: 5.6, potentialReturn: 140,
    status: 'pending', placedAt: 'Hoje, 08:15',
    selections: [
      { id: 's2', matchId: 'f5', sport: 'futebol', home: 'Manchester City', away: 'Arsenal', championship: 'Premier League', market: 'over', marketLabel: 'Total de gols', pick: 'Mais de 2.5', odds: 1.65 },
      { id: 's3', matchId: 'b1', sport: 'basquete', home: 'Los Angeles Lakers', away: 'Golden State Warriors', championship: 'NBA', market: 'home', marketLabel: 'Vitória', pick: 'Lakers', odds: 1.55 },
      { id: 's4', matchId: 't2', sport: 'tenis', home: 'Novak Djokovic', away: 'Alexander Zverev', championship: 'Roland Garros', market: 'home', marketLabel: 'Vitória', pick: 'Djokovic', odds: 1.45 },
    ],
  },
  {
    id: 'BET-22089', type: 'simples', stake: 100, totalOdds: 1.6, potentialReturn: 160,
    status: 'lost', placedAt: 'Ontem, 15:30',
    selections: [{ id: 's5', matchId: 'a2', sport: 'futebol-americano', home: 'Dallas Cowboys', away: 'Philadelphia Eagles', championship: 'NFL', market: 'home', marketLabel: 'Vitória', pick: 'Cowboys', odds: 1.6 }],
  },
]

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<Selection[]>([])
  const [stake, setStake] = useState(10)
  const [hasStake, setHasStake] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [placedBets, setPlacedBets] = useState<BetRecord[]>(seedBets)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'aposta' | 'historico'>('aposta')
  const { toast } = useToast()
  const { removeBalance, addBalance, addTransaction } = useAuth()

  const addSelection = useCallback(
    (s: Selection) => {
      setSelections((prev) => {
        const exists = prev.find((x) => x.id === s.id)
        if (exists) {
          toast('Seleção removida', `${s.pick} foi removida do cupom.`, 'info')
          return prev.filter((x) => x.id !== s.id)
        }
        toast('Seleção adicionada', `${s.pick} a ${s.odds.toFixed(2)} entrou no cupom.`)
        return [...prev, s]
      })
      setOpen(true)
      setActiveTab('aposta')
    },
    [toast]
  )

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clearSlip = useCallback(() => setSelections([]), [])

  const totalOdds = useMemo(
    () => selections.reduce((acc, s) => acc * s.odds, 1),
    [selections]
  )
  const potentialReturn = useMemo(() => totalOdds * stake, [totalOdds, stake])

  const placeBet = useCallback(async (): Promise<BetRecord> => {
    const rec: BetRecord = {
      id: `BET-${Math.floor(22000 + Math.random() * 9000)}`,
      type: selections.length > 1 ? 'combinada' : 'simples',
      stake,
      totalOdds,
      potentialReturn,
      status: 'pending',
      placedAt: 'Agora',
      selections: [...selections],
    }
    setIsPlacing(true)
    await new Promise((r) => setTimeout(r, 1400))
    setIsPlacing(false)
    setPlacedBets((prev) => [rec, ...prev])
    removeBalance(stake)
    addTransaction({ type: 'aposta', amount: -stake, status: 'pendente', method: rec.type === 'simples' ? 'Aposta simples' : 'Aposta combinada', ref: rec.id })
    setSelections([])
    setHasStake(false)
    return rec
  }, [selections, stake, totalOdds, potentialReturn, removeBalance, addTransaction])

  const value = useMemo(
    () => ({
      selections, addSelection, removeSelection, clearSlip, stake, setStake,
      hasStake, setHasStake, placeBet, isPlacing, placedBets, open, setOpen,
      activeTab, setActiveTab, totalOdds, potentialReturn,
    }),
    [selections, addSelection, removeSelection, clearSlip, stake, hasStake, placeBet, isPlacing, placedBets, open, activeTab, totalOdds, potentialReturn]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
