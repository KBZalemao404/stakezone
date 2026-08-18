import { Link } from 'react-router-dom'
import { Heart, ArrowLeft } from 'lucide-react'
import { PRODUCTS } from '../data/store'
import { useCart } from '../context/CartContext'
import { Button, EmptyState, SectionHeader } from '../components/ui'
import { ProductCard } from './Store'

export function FavoritesPage() {
  const { favorites } = useCart()
  const items = PRODUCTS.filter((p) => favorites.includes(p.id))

  return (
    <div className="page container">
      <SectionHeader
        title="Favoritos"
        subtitle="Seus produtos preferidos"
        action={<Link to="/loja"><Button variant="outline" size="sm"><ArrowLeft size={15} /> Voltar à loja</Button></Link>}
      />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Nenhum favorito ainda" desc="Toque no coração dos produtos para salvá-los aqui."
          action={<Link to="/loja"><Button>Explorar a loja</Button></Link>} />
      ) : (
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
