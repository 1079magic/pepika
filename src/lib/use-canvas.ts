'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
type FabricCanvas = any
type FabricObject = any

export interface CanvasState {
  canvas: FabricCanvas | null
  activeObject: FabricObject | null
  canUndo: boolean
  canRedo: boolean
  objectCount: number
}

export interface CanvasActions {
  initCanvas: (el: HTMLCanvasElement, w: number, h: number, bg?: string) => void
  addText: (text?: string) => void
  addImage: (file: File) => void
  addImageFromUrl: (url: string) => void
  deleteSelected: () => void
  resetCanvas: () => void
  bringForward: () => void
  sendBackward: () => void
  exportAsDataUrl: () => string | null
  exportAsJSON: () => string | null
  setActiveProperty: (prop: string, value: any) => void
  getActiveProperty: (prop: string) => any
}

export function useCanvas(): [CanvasState, CanvasActions] {
  const canvasRef = useRef<FabricCanvas>(null)
  const [activeObject, setActiveObject] = useState<FabricObject>(null)
  const [objectCount, setObjectCount] = useState(0)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const historyRef = useRef<string[]>([])
  const historyIdx = useRef(-1)

  const saveHist = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    historyRef.current = historyRef.current.slice(0, historyIdx.current + 1)
    historyRef.current.push(JSON.stringify(c.toJSON()))
    historyIdx.current = historyRef.current.length - 1
    setCanUndo(historyIdx.current > 0); setCanRedo(false)
  }, [])

  const sync = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    setObjectCount(c.getObjects().length)
    setActiveObject(c.getActiveObject() || null)
  }, [])

  const initCanvas = useCallback((el: HTMLCanvasElement, w: number, h: number, bg?: string) => {
    import('fabric').then(({ fabric }) => {
      if (canvasRef.current) canvasRef.current.dispose()
      const c = new fabric.Canvas(el, {
        width: w, height: h, backgroundColor: '#ffffff',
        preserveObjectStacking: true, selection: true,
      })
      fabric.Object.prototype.set({
        transparentCorners: false, cornerColor: '#A67C89', cornerStrokeColor: '#A67C89',
        borderColor: '#A67C89', cornerSize: 10, cornerStyle: 'circle',
        borderDashArray: [4, 4], padding: 8,
      })
      c.on('selection:created', sync); c.on('selection:updated', sync)
      c.on('selection:cleared', () => { setActiveObject(null); sync() })
      c.on('object:modified', () => { saveHist(); sync() })
      c.on('object:added', () => { saveHist(); sync() })
      c.on('object:removed', () => { saveHist(); sync() })

      if (bg) {
        fabric.Image.fromURL(bg, (img: any) => {
          if (!img) return
          const s = Math.min(w / (img.width||1), h / (img.height||1))
          img.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'center', left: w/2, top: h/2 })
          c.setBackgroundImage(img, c.renderAll.bind(c))
        }, { crossOrigin: 'anonymous' })
      }
      canvasRef.current = c; saveHist(); sync()

      const onKey = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
        if ((e.key === 'Delete' || e.key === 'Backspace') && c.getActiveObject() && !c.getActiveObject().isEditing) {
          c.remove(c.getActiveObject()); c.discardActiveObject(); c.renderAll()
        }
      }
      window.addEventListener('keydown', onKey)
    })
  }, [saveHist, sync])

  const addText = useCallback((text = 'Your Text') => {
    import('fabric').then(({ fabric }) => {
      const c = canvasRef.current; if (!c) return
      const t = new fabric.IText(text, {
        left: c.width/2, top: c.height/2, originX: 'center', originY: 'center',
        fontFamily: 'Outfit', fontSize: 32, fill: '#632B30', fontWeight: '600', textAlign: 'center', editable: true,
      })
      c.add(t); c.setActiveObject(t); c.renderAll()
    })
  }, [])

  const addImage = useCallback((file: File) => {
    import('fabric').then(({ fabric }) => {
      const c = canvasRef.current; if (!c) return
      const r = new FileReader()
      r.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, (img: any) => {
          if (!img) return
          const m = Math.min(c.width, c.height) * 0.4
          const s = Math.min(m/(img.width||1), m/(img.height||1))
          img.set({ left: c.width/2, top: c.height/2, originX: 'center', originY: 'center', scaleX: s, scaleY: s })
          c.add(img); c.setActiveObject(img); c.renderAll()
        })
      }
      r.readAsDataURL(file)
    })
  }, [])

  const addImageFromUrl = useCallback((url: string) => {
    import('fabric').then(({ fabric }) => {
      const c = canvasRef.current; if (!c) return
      fabric.Image.fromURL(url, (img: any) => {
        if (!img) return
        const m = Math.min(c.width, c.height) * 0.4
        const s = Math.min(m/(img.width||1), m/(img.height||1))
        img.set({ left: c.width/2, top: c.height/2, originX: 'center', originY: 'center', scaleX: s, scaleY: s })
        c.add(img); c.setActiveObject(img); c.renderAll()
      }, { crossOrigin: 'anonymous' })
    })
  }, [])

  const deleteSelected = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const a = c.getActiveObject(); if (a) { c.remove(a); c.discardActiveObject(); c.renderAll() }
  }, [])

  const resetCanvas = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    c.getObjects().slice().forEach((o: any) => c.remove(o)); c.discardActiveObject(); c.renderAll()
  }, [])

  const bringForward = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const a = c.getActiveObject(); if (a) { c.bringForward(a); c.renderAll() }
  }, [])

  const sendBackward = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const a = c.getActiveObject(); if (a) { c.sendBackwards(a); c.renderAll() }
  }, [])

  const exportAsDataUrl = useCallback(() => {
    const c = canvasRef.current; if (!c) return null
    return c.toDataURL({ format: 'png', quality: 1, multiplier: 2 })
  }, [])

  const exportAsJSON = useCallback(() => {
    const c = canvasRef.current; if (!c) return null
    return JSON.stringify(c.toJSON())
  }, [])

  const setActiveProperty = useCallback((p: string, v: any) => {
    const c = canvasRef.current; if (!c) return
    const a = c.getActiveObject(); if (!a) return
    a.set(p, v); c.renderAll(); saveHist(); sync()
  }, [saveHist, sync])

  const getActiveProperty = useCallback((p: string) => {
    const c = canvasRef.current; if (!c) return undefined
    const a = c.getActiveObject(); if (!a) return undefined
    return a.get(p)
  }, [])

  useEffect(() => { return () => { if (canvasRef.current) { canvasRef.current.dispose(); canvasRef.current = null } } }, [])

  return [
    { canvas: canvasRef.current, activeObject, canUndo, canRedo, objectCount },
    { initCanvas, addText, addImage, addImageFromUrl, deleteSelected, resetCanvas, bringForward, sendBackward, exportAsDataUrl, exportAsJSON, setActiveProperty, getActiveProperty },
  ]
}
