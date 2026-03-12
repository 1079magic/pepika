'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useState } from 'react'
import { CartItem, Product, ProductVariant } from '@/lib/types'

// Generate a unique cart item key — same product with different personalization = different line items
function cartItemKey(productId: string, personalization?: Record<string, string>): string {
  if (!personalization || Object.keys(personalization).length === 0) return productId
  const sorted = Object.entries(personalization).sort(([a], [b]) => a.localeCompare(b))
  return `${productId}::${sorted.map(([k, v]) => `${k}=${v}`).join('|')}`
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number; personalization?: Record<string, string>; variant?: ProductVariant }
  | { type: 'REMOVE_ITEM'; key: string }
  | { type: 'UPDATE_QUANTITY'; key: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = cartItemKey(action.product.id, action.personalization)
      const existing = state.items.find(i => cartItemKey(i.product.id, i.personalization) === key)
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map(i =>
            cartItemKey(i.product.id, i.personalization) === key
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, {
          product: action.product,
          quantity: action.quantity || 1,
          personalization: action.personalization,
          variant: action.variant,
        }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => cartItemKey(i.product.id, i.personalization) !== action.key) }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => cartItemKey(i.product.id, i.personalization) !== action.key) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          cartItemKey(i.product.id, i.personalization) === action.key
            ? { ...i, quantity: action.quantity }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'HYDRATE':
      return { ...state, items: action.items }
    default:
      return state
  }
}

// Toast notification state
interface Toast {
  id: number
  message: string
  productName: string
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, personalization?: Record<string, string>, variant?: ProductVariant) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemKey: (item: CartItem) => string
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  toasts: Toast[]
  dismissToast: (id: number) => void
}

const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 7.99

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const [toasts, setToasts] = useState<Toast[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pepika-cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'HYDRATE', items: parsed })
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('pepika-cart', JSON.stringify(state.items))
    } catch {
      // ignore
    }
  }, [state.items, hydrated])

  const showToast = useCallback((productName: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message: 'Added to cart', productName }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addItem = useCallback((product: Product, quantity?: number, personalization?: Record<string, string>, variant?: ProductVariant) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, personalization, variant })
    showToast(product.name)
  }, [showToast])

  const removeItem = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_ITEM', key })
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', key, quantity })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  const getItemKey = useCallback((item: CartItem) => cartItemKey(item.product.id, item.personalization), [])

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addItem, removeItem, updateQuantity, clearCart,
      toggleCart, openCart, closeCart, getItemKey,
      itemCount, subtotal, shipping, total,
      toasts, dismissToast,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export { cartItemKey }
