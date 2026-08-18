import { useEffect, useRef, useState } from 'react'
import { Goal, Target, Volleyball, Gamepad2, Shield, CircleDot, Swords } from 'lucide-react'
import type { SportId } from '../../data/types'
import { teamColor } from '../../data/sports'

export interface OddsBtnProps {
  odds: number
  label?: string
  selected?: boolean
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

export function OddsButton({ odds, label, selected, onClick, disabled }: OddsBtnProps) {
  const [dir, setDir] = useState<'up' | 'down' | null>(null)
  const prev = useRef(odds)

  useEffect(() => {
    if (prev.current !== odds) {
      setDir(odds > prev.current ? 'up' : 'down')
      prev.current = odds
      const t = setTimeout(() => setDir(null), 600)
      return () => clearTimeout(t)
    }
    prev.current = odds
  }, [odds])

  return (
    <button
      className={`odds-btn${selected ? ' selected' : ''}${dir === 'up' ? ' odds-up' : dir === 'down' ? ' odds-down' : ''}`}
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span>{odds.toFixed(2)}</span>
      {label && <small>{label}</small>}
    </button>
  )
}

export function TeamAvatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter((w) => /^[A-Za-zÀ-ú]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span className="team-avatar" style={{ width: size, height: size, background: teamColor(name), fontSize: size * 0.34 }}>
      {initials}
    </span>
  )
}

export function LiveBadge({ minute }: { minute?: number }) {
  return (
    <span className="badge badge-live">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', animation: 'pulseLive 1.5s infinite' }} />
      AO VIVO {minute ? `${minute}'` : ''}
    </span>
  )
}

export function SportIcon({ sport, size = 16 }: { sport: SportId; size?: number }) {
  const map = {
    futebol: Goal, basquete: Target, tenis: Volleyball, esports: Gamepad2,
    'futebol-americano': Shield, baseball: CircleDot, mma: Swords,
  }
  const Icon = map[sport] ?? Goal
  return <Icon size={size} aria-hidden />
}

export function SportDot({ sport }: { sport: SportId }) {
  const colors: Record<SportId, string> = {
    futebol: '#22ff88', basquete: '#ff9f43', tenis: '#ffd166', esports: '#00d4ff',
    'futebol-americano': '#ff4d6d', baseball: '#7aa2ff', mma: '#c792ff',
  }
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[sport], display: 'inline-block' }} />
}
