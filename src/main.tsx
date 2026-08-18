import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { BetSlipProvider } from './context/BetSlipContext'
import { CartProvider } from './context/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <BetSlipProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </BetSlipProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
)
