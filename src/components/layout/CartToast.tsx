'use client'

import { ShoppingBag, X, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartToast() {
  const { toasts, dismissToast } = useCart()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-beige-100 px-4 py-3 min-w-[280px] animate-slide-in-right"
        >
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal">{toast.message}</p>
            <p className="text-xs text-olive-600 truncate">{toast.productName}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:bg-beige-50 rounded transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5 text-mauve-400" />
          </button>
        </div>
      ))}
    </div>
  )
}
