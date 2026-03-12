'use client'

import { useRef } from 'react'
import { ImagePlus, Type, Trash2, RotateCcw, Download, ArrowUp, ArrowDown, Layers, MousePointer } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CanvasState, CanvasActions } from '@/lib/use-canvas'

interface Props { state: CanvasState; actions: CanvasActions }

function Btn({ icon, label, onClick, disabled = false, variant = 'default' }: {
  icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; variant?: 'default' | 'danger' | 'primary'
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={label} className={cn(
      'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed',
      variant === 'default' && 'text-olive-600 hover:bg-beige-50 hover:text-charcoal',
      variant === 'danger' && 'text-red-400 hover:bg-red-50 hover:text-red-600',
      variant === 'primary' && 'bg-burgundy-900 text-white hover:bg-burgundy-950 disabled:bg-beige-200 disabled:text-beige-400',
    )}>
      {icon}<span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export default function EditorToolbar({ state, actions }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const has = !!state.activeObject

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-beige-100 overflow-x-auto shrink-0">
      <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-mauve-300 font-medium mr-1 select-none">Add</span>
      <Btn icon={<ImagePlus className="w-4 h-4" />} label="Add Photo" onClick={() => fileRef.current?.click()} />
      <Btn icon={<Type className="w-4 h-4" />} label="Add Text" onClick={() => actions.addText()} />
      <div className="w-px h-7 bg-beige-100 mx-1.5 shrink-0" />
      <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-mauve-300 font-medium mr-1 select-none">Layer</span>
      <Btn icon={<ArrowUp className="w-4 h-4" />} label="Forward" onClick={actions.bringForward} disabled={!has} />
      <Btn icon={<ArrowDown className="w-4 h-4" />} label="Backward" onClick={actions.sendBackward} disabled={!has} />
      <div className="w-px h-7 bg-beige-100 mx-1.5 shrink-0" />
      <Btn icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={actions.deleteSelected} disabled={!has} variant="danger" />
      <Btn icon={<RotateCcw className="w-4 h-4" />} label="Reset" onClick={actions.resetCanvas} disabled={state.objectCount === 0} />
      <div className="flex-1" />
      <div className="hidden md:flex items-center gap-2 text-xs text-mauve-400 mr-2">
        <Layers className="w-3.5 h-3.5" /><span>{state.objectCount} element{state.objectCount !== 1 ? 's' : ''}</span>
        {has && (<><span className="text-beige-200">|</span><MousePointer className="w-3.5 h-3.5" /><span className="text-mauve-500 font-medium">{state.activeObject?.type === 'i-text' ? 'Text' : 'Image'}</span></>)}
      </div>
      <Btn icon={<Download className="w-4 h-4" />} label="Export" onClick={() => {
        const d = actions.exportAsDataUrl(); if (!d) return
        const a = document.createElement('a'); a.download = 'pepika-design.png'; a.href = d; a.click()
      }} disabled={state.objectCount === 0} variant="primary" />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { actions.addImage(f); e.target.value = '' } }} />
    </div>
  )
}
