'use client'

import { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react'

export interface CanvasEditorHandle {
  addText: (text?: string) => void
  addImage: (url: string) => void
  deleteSelected: () => void
  resetCanvas: () => void
  exportImage: () => string | null
  getCanvas: () => any
}

interface CanvasEditorProps {
  width?: number
  height?: number
  backgroundImage?: string
  onSelectionChange?: (hasSelection: boolean, type?: string) => void
  onModified?: () => void
}

let fabricLib: any = null

const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(
  ({ width = 600, height = 600, backgroundImage, onSelectionChange, onModified }, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvasRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [scale, setScale] = useState(1)

    const updateScale = useCallback(() => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      setScale(Math.min(w / width, 1))
    }, [width])

    useEffect(() => {
      let fc: any = null
      let keyHandler: ((e: KeyboardEvent) => void) | null = null

      const init = async () => {
        const mod = await import('fabric')
        fabricLib = mod.fabric || mod

        if (!canvasElRef.current) return

        fc = new fabricLib.Canvas(canvasElRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          selection: true,
          preserveObjectStacking: true,
        })
        fabricCanvasRef.current = fc

        if (backgroundImage) {
          fabricLib.Image.fromURL(backgroundImage, (img: any) => {
            if (!img || !fc) return
            img.scaleToWidth(width)
            img.scaleToHeight(height)
            fc.setBackgroundImage(img, fc.renderAll.bind(fc), {
              originX: 'left', originY: 'top',
            })
          }, { crossOrigin: 'anonymous' })
        }

        fc.on('selection:created', (e: any) => onSelectionChange?.(true, e.selected?.[0]?.type))
        fc.on('selection:updated', (e: any) => onSelectionChange?.(true, e.selected?.[0]?.type))
        fc.on('selection:cleared', () => onSelectionChange?.(false))
        fc.on('object:modified', () => onModified?.())
        fc.on('object:added', () => onModified?.())
        fc.on('object:removed', () => onModified?.())

        keyHandler = (e: KeyboardEvent) => {
          const active = fc?.getActiveObject()
          if (!active) return
          if ((e.key === 'Delete' || e.key === 'Backspace') && !active.isEditing) {
            e.preventDefault()
            fc.remove(active)
            fc.discardActiveObject()
            fc.renderAll()
          }
        }
        window.addEventListener('keydown', keyHandler)
        setIsLoading(false)
        updateScale()
      }

      init()

      return () => {
        if (keyHandler) window.removeEventListener('keydown', keyHandler)
        if (fc) { fc.dispose(); fabricCanvasRef.current = null }
      }
    }, [width, height, backgroundImage, onSelectionChange, onModified, updateScale])

    useEffect(() => {
      updateScale()
      window.addEventListener('resize', updateScale)
      return () => window.removeEventListener('resize', updateScale)
    }, [updateScale])

    const controlStyle = {
      cornerColor: '#A67C89',
      cornerStrokeColor: '#A67C89',
      borderColor: '#A67C89',
      cornerSize: 10,
      cornerStyle: 'circle' as const,
      transparentCorners: false,
    }

    useImperativeHandle(ref, () => ({
      addText: (text = 'Your Text') => {
        const fc = fabricCanvasRef.current
        if (!fc || !fabricLib) return
        const t = new fabricLib.IText(text, {
          left: width / 2 - 80, top: height / 2 - 20,
          fontFamily: 'Outfit, sans-serif', fontSize: 32,
          fill: '#632B30', fontWeight: '600', editable: true, padding: 8,
          ...controlStyle,
        })
        fc.add(t); fc.setActiveObject(t); fc.renderAll()
      },

      addImage: (url: string) => {
        const fc = fabricCanvasRef.current
        if (!fc || !fabricLib) return
        fabricLib.Image.fromURL(url, (img: any) => {
          if (!img || !fc) return
          const maxW = width * 0.6, maxH = height * 0.6
          const s = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1)
          img.set({
            left: width / 2 - (img.width! * s) / 2,
            top: height / 2 - (img.height! * s) / 2,
            scaleX: s, scaleY: s, ...controlStyle,
          })
          fc.add(img); fc.setActiveObject(img); fc.renderAll()
        }, { crossOrigin: 'anonymous' })
      },

      deleteSelected: () => {
        const fc = fabricCanvasRef.current
        if (!fc) return
        const active = fc.getActiveObject()
        if (!active) return
        if (active.type === 'activeSelection') {
          active.forEachObject((o: any) => fc.remove(o))
          fc.discardActiveObject()
        } else { fc.remove(active) }
        fc.renderAll()
      },

      resetCanvas: () => {
        const fc = fabricCanvasRef.current
        if (!fc) return
        fc.getObjects().forEach((o: any) => fc.remove(o))
        fc.discardActiveObject(); fc.renderAll()
      },

      exportImage: () => {
        const fc = fabricCanvasRef.current
        if (!fc) return null
        return fc.toDataURL({ format: 'png', quality: 1, multiplier: 2 })
      },

      getCanvas: () => fabricCanvasRef.current,
    }))

    return (
      <div ref={containerRef} className="w-full">
        <div
          className="relative mx-auto rounded-2xl overflow-hidden shadow-lg ring-1 ring-beige-100 bg-white"
          style={{ width: width * scale, height: height * scale }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width, height }}>
            <canvas ref={canvasElRef} />
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-mauve-300 border-t-burgundy-900 rounded-full animate-spin" />
                <p className="text-sm text-olive-600">Loading editor…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

CanvasEditor.displayName = 'CanvasEditor'
export default CanvasEditor
