'use client'

import { useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import EditorToolbar from '@/components/editor/EditorToolbar'
import EditorSidebar from '@/components/editor/EditorSidebar'

interface CanvasEditorHandle {
  addText: (text?: string) => void
  addImage: (url: string) => void
  deleteSelected: () => void
  resetCanvas: () => void
  exportImage: () => string | null
  getCanvas: () => any
}

const CanvasEditor = dynamic(
  () => import('../../../components/editor/CanvasEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-[600px] mx-auto rounded-2xl bg-white border border-beige-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-mauve-300 border-t-burgundy-900 rounded-full animate-spin" />
          <p className="text-sm text-olive-600">Loading editor…</p>
        </div>
      </div>
    ),
  }
)

export default function EditorPageClient({ product }: { product: Product }) {
  const editorRef = useRef<CanvasEditorHandle>(null)
  const [hasSelection, setHasSelection] = useState(false)
  const [selectionType, setSelectionType] = useState<string | undefined>()
  const [hasDesign, setHasDesign] = useState(false)
  const { addItem } = useCart()

  const handleSelectionChange = useCallback((selected: boolean, type?: string) => {
    setHasSelection(selected)
    setSelectionType(type)
  }, [])

  const handleModified = useCallback(() => setHasDesign(true), [])
  const handleAddText = useCallback(() => editorRef.current?.addText(), [])
  const handleAddImage = useCallback((url: string) => editorRef.current?.addImage(url), [])
  const handleDelete = useCallback(() => editorRef.current?.deleteSelected(), [])
  const handleReset = useCallback(() => { editorRef.current?.resetCanvas(); setHasDesign(false) }, [])

  const handleExport = useCallback(() => {
    const dataUrl = editorRef.current?.exportImage()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `pepika-${product.slug}-design.png`
    link.href = dataUrl
    link.click()
  }, [product.slug])

  const handleTextStyle = useCallback((style: string, value: any) => {
    const canvas = editorRef.current?.getCanvas()
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj || (obj.type !== 'i-text' && obj.type !== 'textbox')) return
    if (style === 'fontWeight') obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold')
    else if (style === 'fontStyle') obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic')
    else obj.set(style, value)
    canvas.renderAll()
  }, [])

  const handleTextColor = useCallback((color: string) => {
    const canvas = editorRef.current?.getCanvas()
    const obj = canvas?.getActiveObject()
    if (obj) { obj.set('fill', color); canvas.renderAll() }
  }, [])

  const handleTextAlign = useCallback((align: string) => {
    const canvas = editorRef.current?.getCanvas()
    const obj = canvas?.getActiveObject()
    if (obj) { obj.set('textAlign', align); canvas.renderAll() }
  }, [])

  const handleAddToCart = useCallback(() => {
    addItem(product, 1, { design: 'Custom design applied' })
  }, [product, addItem])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0ec' }}>
      {/* Editor Header */}
      <div className="bg-white border-b border-beige-100 sticky top-0 z-40">
        <div className="container max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-xl md:text-2xl font-bold text-burgundy-900">
            Personalisation Editor
          </h1>
          <span className="hidden sm:inline-flex px-2.5 py-1 bg-mauve-50 text-mauve-600 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-mauve-200">
            {product.name}
          </span>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="container max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[220px_1fr_260px] gap-5">
          {/* Left — Toolbar */}
          <aside className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-20">
              <EditorToolbar
                onAddImage={handleAddImage} onAddText={handleAddText}
                onDelete={handleDelete} onReset={handleReset} onExport={handleExport}
                hasSelection={hasSelection} selectionType={selectionType}
                onTextStyle={handleTextStyle} onTextColor={handleTextColor} onTextAlign={handleTextAlign}
              />
            </div>
          </aside>

          {/* Center — Canvas */}
          <main className="order-1 lg:order-2">
            <CanvasEditor
              ref={editorRef}
              width={600}
              height={600}
              backgroundImage={product.images[0]}
              onSelectionChange={handleSelectionChange}
              onModified={handleModified}
            />
            <p className="text-center text-[11px] text-mauve-400 mt-3">
              Click to select · Double-click text to edit · Drag to reposition · Delete key to remove
            </p>
          </main>

          {/* Right — Sidebar */}
          <aside className="order-3">
            <div className="lg:sticky lg:top-20">
              <EditorSidebar product={product} onAddToCart={handleAddToCart} hasDesign={hasDesign} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
