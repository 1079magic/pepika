'use client'

import { useState, useEffect } from 'react'
import { Type, Palette, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CanvasState, CanvasActions } from '@/lib/use-canvas'

interface Props { state: CanvasState; actions: CanvasActions }

const FONTS = ['Outfit', 'Cormorant Garamond', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact']
const COLORS = ['#632B30', '#A67C89', '#6B683B', '#1a1a1a', '#ffffff', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1']
const SIZES = [12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72]

function Tog({ icon, active, onClick }: { icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-all', active ? 'bg-burgundy-900 text-white shadow-sm' : 'bg-beige-50 text-olive-600 hover:bg-beige-100')}>{icon}</button>
}

export default function EditorSidebar({ state, actions }: Props) {
  const { activeObject } = state
  const isText = activeObject?.type === 'i-text'
  const [ff, setFf] = useState('Outfit')
  const [fs, setFs] = useState(32)
  const [fc, setFc] = useState('#632B30')
  const [fw, setFw] = useState('600')
  const [fi, setFi] = useState('normal')
  const [fu, setFu] = useState(false)
  const [ta, setTa] = useState('center')
  const [op, setOp] = useState(100)

  useEffect(() => {
    if (!activeObject) return
    setOp(Math.round((activeObject.opacity || 1) * 100))
    if (isText) {
      setFf(activeObject.fontFamily || 'Outfit'); setFs(activeObject.fontSize || 32)
      setFc(activeObject.fill || '#632B30'); setFw(activeObject.fontWeight || '400')
      setFi(activeObject.fontStyle || 'normal'); setFu(!!activeObject.underline)
      setTa(activeObject.textAlign || 'center')
    }
  }, [activeObject, isText])

  const set = (p: string, v: any) => actions.setActiveProperty(p, v)

  if (!activeObject) {
    return (
      <div className="w-full lg:w-64 shrink-0 bg-white border-l border-beige-100 p-5 hidden lg:flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-beige-50 flex items-center justify-center mb-4">
          <Palette className="w-7 h-7 text-mauve-300" />
        </div>
        <p className="text-sm font-medium text-charcoal mb-1">No Element Selected</p>
        <p className="text-xs text-mauve-400 leading-relaxed">Click an element on the canvas to edit its properties.</p>
      </div>
    )
  }

  return (
    <div className="w-full lg:w-64 shrink-0 bg-white border-l border-beige-100 overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="pb-3 border-b border-beige-100">
          <h3 className="text-xs uppercase tracking-widest text-mauve-400 font-semibold">{isText ? 'Text Properties' : 'Image Properties'}</h3>
        </div>

        {/* Opacity */}
        <div>
          <label className="text-xs font-medium text-charcoal mb-2 block">Opacity: {op}%</label>
          <input type="range" min={10} max={100} value={op} onChange={e => { const v = +e.target.value; setOp(v); set('opacity', v/100) }}
            className="w-full h-1.5 bg-beige-100 rounded-full appearance-none cursor-pointer accent-mauve-500" />
        </div>

        {isText && (<>
          {/* Font */}
          <div>
            <label className="text-xs font-medium text-charcoal mb-1.5 flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-mauve-400" /> Font</label>
            <select value={ff} onChange={e => { setFf(e.target.value); set('fontFamily', e.target.value) }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-beige-200 bg-white outline-none focus:border-mauve-400 transition-all">
              {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-medium text-charcoal mb-1.5 block">Size</label>
            <select value={fs} onChange={e => { const v = +e.target.value; setFs(v); set('fontSize', v) }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-beige-200 bg-white outline-none focus:border-mauve-400 transition-all">
              {SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium text-charcoal mb-1.5 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-mauve-400" /> Color</label>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => { setFc(c); set('fill', c) }}
                  className={cn('w-7 h-7 rounded-full border-2 transition-all hover:scale-110', fc === c ? 'border-charcoal scale-110 shadow-md' : 'border-beige-200')}
                  style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
            <input type="color" value={fc} onChange={e => { setFc(e.target.value); set('fill', e.target.value) }}
              className="w-full h-8 rounded-lg border border-beige-200 cursor-pointer" />
          </div>

          {/* Style */}
          <div>
            <label className="text-xs font-medium text-charcoal mb-1.5 block">Style</label>
            <div className="flex gap-1">
              <Tog icon={<Bold className="w-4 h-4" />} active={fw === 'bold' || fw === '700'} onClick={() => { const n = fw === 'bold' || fw === '700' ? '400' : 'bold'; setFw(n); set('fontWeight', n) }} />
              <Tog icon={<Italic className="w-4 h-4" />} active={fi === 'italic'} onClick={() => { const n = fi === 'italic' ? 'normal' : 'italic'; setFi(n); set('fontStyle', n) }} />
              <Tog icon={<Underline className="w-4 h-4" />} active={fu} onClick={() => { setFu(!fu); set('underline', !fu) }} />
            </div>
          </div>

          {/* Align */}
          <div>
            <label className="text-xs font-medium text-charcoal mb-1.5 block">Alignment</label>
            <div className="flex gap-1">
              {[{ v: 'left', i: <AlignLeft className="w-4 h-4" /> }, { v: 'center', i: <AlignCenter className="w-4 h-4" /> }, { v: 'right', i: <AlignRight className="w-4 h-4" /> }].map(o => (
                <Tog key={o.v} icon={o.i} active={ta === o.v} onClick={() => { setTa(o.v); set('textAlign', o.v) }} />
              ))}
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}
