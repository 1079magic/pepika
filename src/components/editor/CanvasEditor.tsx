'use client'

import { useRef, useEffect, useState } from 'react'
import type { CanvasActions } from '@/lib/use-canvas'

interface CanvasEditorProps {
  initCanvas: CanvasActions['initCanvas']
  productImage?: string
}

export default function CanvasEditor({ initCanvas, productImage }: CanvasEditorProps) {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized || !canvasElRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const size = Math.min(rect.width - 48, rect.height - 48, 600)
    initCanvas(canvasElRef.current, size, size, productImage)
    setInitialized(true)
  }, [initCanvas, productImage, initialized])

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-[400px]" style={{ backgroundColor: '#f5f0ed' }}>
      <div className="relative">
        <div className="rounded-xl shadow-lg ring-1 ring-beige-200/50 overflow-hidden bg-white">
          <canvas ref={canvasElRef} />
        </div>
        {!initialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
            <p className="text-sm text-mauve-400 animate-pulse">Loading editor…</p>
          </div>
        )}
      </div>
    </div>
  )
}
