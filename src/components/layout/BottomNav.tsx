import { NavLink } from 'react-router-dom'
import { Home, Trophy, ShoppingBag, Wallet, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useBetSlip } from '../../context/BetSlipContext'

const items = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/apostas', label: 'Apostas', icon: Trophy },
  { to: '/loja', label: 'Loja', icon: ShoppingBag },
  { to: '/carteira', label: 'Carteira', icon: Wallet },
  { to: '/conta', label: 'Perfil', icon: User },
]

export function BottomNav() {
  const { cartCount } = useCart()
  const { selections } = useBetSlip()

  return (
    <nav className="bottom-nav" aria-label="Navegação móvel">
      {items.map((i) => {
        const isStore = i.to === '/loja'
        const isBets = i.to === '/apostas'
        const count = isStore ? cartCount : isBets ? selections.length : 0
        return (
          <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
            <span className="bn-icon">
              <i.icon size={21} strokeWidth={2.2} />
              {count > 0 && <span className="bn-badge">{count > 9 ? '9+' : count}</span>}
            </span>
            <span>{i.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
