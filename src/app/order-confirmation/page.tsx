'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import OrderConfirmationContent from './OrderConfirmationContent'

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#faf7f4' }}>
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-mauve-500 animate-spin mx-auto mb-4" />
        <p className="text-olive-600">Loading your order details…</p>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
