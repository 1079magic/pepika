'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCanvas } from '@/lib/use-canvas'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import EditorToolbar from '@/components/editor/EditorToolbar'
import CanvasEditor from '@/components/editor/CanvasEditor'
import EditorSidebar from '@/components/editor/EditorSidebar'
import type { Product } from '@/lib/types'

interface Props { product: Product }

export default function EditorPageClient({ product }: Props) {
  const [canvasState, canvasActions] = useCanvas()
  const { addItem } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  const handleAddToCart = () => {
    const designData = canvasActions.exportAsJSON()
    const personalization: Record<string, string> = {}
    if (designData) personalization['__design'] = designData
    personalization['Custom Design'] = 'Yes'
    addItem(product, 1, personalization)
  }

  const previewDataUrl = previewMode ? canvasActions.exportAsDataUrl() : null

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 6.5rem)' }}>
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-beige-100 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/product/${product.slug}`} className="flex items-center gap-1.5 text-sm text-olive-600 hover:text-burgundy-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-6 bg-beige-100" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-beige-50 relative shrink-0">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-charcoal leading-tight">{product.name}</p>
              <p className="text-xs text-mauve-400">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreviewMode(!previewMode)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${previewMode ? 'bg-mauve-500 text-white' : 'text-olive-600 hover:bg-beige-50 border border-beige-200'}`}>
            <Eye className="w-4 h-4" /><span className="hidden sm:inline">{previewMode ? 'Edit' : 'Preview'}</span>
          </button>
          <button onClick={handleAddToCart} disabled={canvasState.objectCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-burgundy-900 text-white rounded-lg text-sm font-medium hover:bg-burgundy-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            <ShoppingBag className="w-4 h-4" /><span className="hidden sm:inline">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      {!previewMode && <EditorToolbar state={canvasState} actions={canvasActions} />}

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden relative">
        {previewMode && previewDataUrl ? (
          <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#f5f0ed' }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-mauve-400 font-medium mb-4">Design Preview</p>
              <div className="rounded-xl shadow-2xl ring-1 ring-beige-200/50 overflow-hidden inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewDataUrl} alt="Preview" className="max-w-[600px] max-h-[600px]" />
              </div>
              <div className="mt-6 flex gap-3 justify-center">
                <button onClick={() => setPreviewMode(false)} className="btn-outline text-sm px-5 py-2">Back to Editor</button>
                <button onClick={handleAddToCart} className="btn-primary text-sm px-5 py-2 gap-2">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart — {formatPrice(product.price)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CanvasEditor initCanvas={canvasActions.initCanvas} productImage={product.images[0]} />
        )}

        {!previewMode && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-16 bg-white border border-beige-200 rounded-l-lg flex items-center justify-center shadow-sm">
            {sidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}

        {!previewMode && sidebarOpen && <EditorSidebar state={canvasState} actions={canvasActions} />}
      </div>

      {/* BOTTOM BAR (mobile) */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2.5 bg-white border-t border-beige-100 shrink-0">
        <div className="flex items-center gap-2 text-xs text-mauve-400">
          <Sparkles className="w-3.5 h-3.5" />{canvasState.objectCount} element{canvasState.objectCount !== 1 ? 's' : ''}
        </div>
        <button onClick={handleAddToCart} disabled={canvasState.objectCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-burgundy-900 text-white rounded-lg text-sm font-medium disabled:opacity-40">
          <ShoppingBag className="w-4 h-4" /> Add — {formatPrice(product.price)}
        </button>
      </div>
    </div>
  )
}
