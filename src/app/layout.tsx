import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import CartToast from '@/components/layout/CartToast'

export const metadata: Metadata = {
  title: 'STUDIO E2 — Premium Personalised Products',
  description: 'Premium laser-engraved name plates, house numbers & personalised gifts. Handcrafted in Croatia by STUDIO E2.',
  keywords: ['personalised gifts', 'name plates', 'laser engraving', 'house numbers', 'Croatia', 'STUDIO E2'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  )
}
