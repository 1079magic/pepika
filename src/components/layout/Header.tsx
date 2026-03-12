'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, Gift, Home, Lamp, Gem, DoorOpen, Hash } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'
import { categories } from '@/data/store'

const categoryIcons: Record<string, React.ReactNode> = {
  'door-name-plates': <DoorOpen className="w-4 h-4" />,
  'house-numbers': <Hash className="w-4 h-4" />,
  'home-decor': <Home className="w-4 h-4" />,
  'personalised-gifts': <Gift className="w-4 h-4" />,
  'led-signs': <Lamp className="w-4 h-4" />,
  'jewellery': <Gem className="w-4 h-4" />,
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopDropdown, setShopDropdown] = useState(false)
  const { toggleCart, itemCount } = useCart()

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-burgundy-900 text-white text-center py-2 px-4 text-sm font-medium tracking-wide">
        <span className="mr-1">🎁</span> Free shipping over <strong>€100</strong>
        <span className="mx-2 opacity-40">|</span>
        Code <strong>E2STUDIO10</strong> for 10% off
        <Link href="/category/door-name-plates" className="ml-2 underline underline-offset-2 hover:text-blush-100 transition-colors">
          Shop now →
        </Link>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-beige-100 shadow-sm">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="font-display text-3xl md:text-4xl font-bold text-burgundy-900 tracking-tight hover:text-mauve-500 transition-colors">
            STUDIO E2
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors rounded-lg hover:bg-blush-100/40">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShopDropdown(true)}
              onMouseLeave={() => setShopDropdown(false)}
            >
              <Link href="/shop" className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors rounded-lg hover:bg-blush-100/40">
                Shop <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', shopDropdown && 'rotate-180')} />
              </Link>
              {shopDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-beige-100 py-2 animate-fade-in">
                  <Link href="/shop" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors">
                    <ShoppingBag className="w-4 h-4" /> All Products
                  </Link>
                  <hr className="my-1 border-beige-100" />
                  {categories.map(cat => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal/80 hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors"
                    >
                      {categoryIcons[cat.slug]} {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors rounded-lg hover:bg-blush-100/40">
              About Us
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors rounded-lg hover:bg-blush-100/40">
              Contact
            </Link>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-lg hover:bg-beige-50 transition-colors text-olive-600"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="hidden sm:flex p-2.5 rounded-lg hover:bg-beige-50 transition-colors text-olive-600" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/account" className="hidden sm:flex p-2.5 rounded-lg hover:bg-beige-50 transition-colors text-olive-600" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-lg hover:bg-beige-50 transition-colors text-olive-600"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-burgundy-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-beige-50 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-beige-100 bg-white animate-fade-in">
            <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-mauve-400" />
              <input
                type="search"
                placeholder="Search products…"
                className="flex-1 bg-transparent outline-none text-charcoal placeholder:text-mauve-300"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-beige-50 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-beige-100 bg-white animate-fade-in">
            <nav className="container max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors">
                Home
              </Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors">
                All Products
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-charcoal/80 rounded-lg hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors"
                >
                  {categoryIcons[cat.slug]} {cat.name}
                </Link>
              ))}
              <hr className="my-2 border-beige-100" />
              <Link href="/about" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors">
                About Us
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-blush-100/50 hover:text-burgundy-900 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
