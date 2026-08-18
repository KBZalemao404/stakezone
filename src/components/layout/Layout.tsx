import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { CartDrawer } from '../store/CartDrawer'
import { BetSlipDrawer } from '../betting/BetSlipDrawer'

export function Layout() {
  return (
    <>
      <Navbar />
      <main className="page-transition">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <BetSlipDrawer />
    </>
  )
}
