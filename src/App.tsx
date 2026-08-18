import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { SportsPage } from './pages/Sports'
import { LivePage } from './pages/Live'
import { StorePage } from './pages/Store'
import { ProductDetailPage } from './pages/ProductDetail'
import { FavoritesPage } from './pages/Favorites'
import { CheckoutPage } from './pages/Checkout'
import { OrdersPage } from './pages/Orders'
import { PromotionsPage } from './pages/Promotions'
import { WalletPage } from './pages/Wallet'
import { AccountPage } from './pages/Account'
import { AuthPage } from './pages/Auth'
import { TermsPage, PrivacyPage, ResponsibleGamingPage } from './pages/Legal'
import { AdminPage } from './pages/Admin'
import { Button } from './components/ui'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="page container center" style={{ minHeight: '60vh', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: '5rem', fontWeight: 700, background: 'var(--grad-neon)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>404</div>
      <h2 className="text-xl">Página não encontrada</h2>
      <p className="text-muted text-sm">O conteúdo que você procura não existe ou foi movido.</p>
      <Link to="/"><Button>Voltar ao início</Button></Link>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/esportes" element={<SportsPage />} />
          <Route path="/apostas" element={<SportsPage />} />
          <Route path="/ao-vivo" element={<LivePage />} />
          <Route path="/loja" element={<StorePage />} />
          <Route path="/loja/favoritos" element={<FavoritesPage />} />
          <Route path="/loja/checkout" element={<CheckoutPage />} />
          <Route path="/loja/pedidos" element={<OrdersPage />} />
          <Route path="/loja/:id" element={<ProductDetailPage />} />
          <Route path="/promocoes" element={<PromotionsPage />} />
          <Route path="/carteira" element={<WalletPage />} />
          <Route path="/conta" element={<AccountPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/jogo-responsavel" element={<ResponsibleGamingPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
