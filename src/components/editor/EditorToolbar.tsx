'use client'

import { useRef } from 'react'
import { ImagePlus, Type, Trash2, RotateCcw, Download, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorToolbarProps {
  onAddImage: (url: string) => void
  onAddText: () => void
  onDelete: () => void
  onReset: () => void
  onExport: () => void
  hasSelection: boolean
  selectionType?: string
  onTextStyle?: (style: string, value: any) => void
  onTextColor?: (color: string) => void
  onTextAlign?: (align: string) => void
}

const COLORS = ['#632B30','#A67C89','#6B683B','#1a1a1a','#ffffff','#E8D5C4','#c0392b','#2980b9','#27ae60','#f39c12']

export default function EditorToolbar({
  onAddImage, onAddText, onDelete, onReset, onExport,
  hasSelection, selectionType, onTextStyle, onTextColor, onTextAlign,
}: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') onAddImage(reader.result) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const isText = selectionType === 'i-text' || selectionType === 'text' || selectionType === 'textbox'

  return (
    <div className="space-y-3">
      {/* Add Elements */}
      <Panel title="Add Elements">
        <div className="flex flex-wrap gap-2">
          <Btn icon={<ImagePlus className="w-4 h-4" />} label="Add Photo" onClick={() => fileRef.current?.click()} />
          <Btn icon={<Type className="w-4 h-4" />} label="Add Text" onClick={onAddText} />
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </Panel>

      {/* Text Formatting */}
      {hasSelection && isText && (
        <Panel title="Text Style" animated>
          <div className="flex flex-wrap gap-2 mb-3">
            <Btn icon={<Bold className="w-4 h-4" />} label="Bold" small onClick={() => onTextStyle?.('fontWeight', 'bold')} />
            <Btn icon={<Italic className="w-4 h-4" />} label="Italic" small onClick={() => onTextStyle?.('fontStyle', 'italic')} />
            <div className="w-px bg-beige-200 mx-0.5" />
            <Btn icon={<AlignLeft className="w-4 h-4" />} label="Left" small onClick={() => onTextAlign?.('left')} />
            <Btn icon={<AlignCenter className="w-4 h-4" />} label="Center" small onClick={() => onTextAlign?.('center')} />
            <Btn icon={<AlignRight className="w-4 h-4" />} label="Right" small onClick={() => onTextAlign?.('right')} />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-mauve-400 font-semibold mb-1.5 px-0.5">Color</p>
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map(c => (
              <button key={c} onClick={() => onTextColor?.(c)}
                className="w-7 h-7 rounded-full border-2 border-beige-200 hover:border-mauve-400 transition-all hover:scale-110"
                style={{ backgroundColor: c }} aria-label={`Color ${c}`} />
            ))}
          </div>
        </Panel>
      )}

      {/* Selection Actions */}
      {hasSelection && (
        <Panel title="Selected" animated>
          <Btn icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={onDelete} variant="danger" />
        </Panel>
      )}

      {/* Canvas */}
      <Panel title="Canvas">
        <div className="flex flex-wrap gap-2">
          <Btn icon={<RotateCcw className="w-4 h-4" />} label="Reset" onClick={onReset} />
          <Btn icon={<Download className="w-4 h-4" />} label="Export" onClick={onExport} variant="primary" />
        </div>
      </Panel>
    </div>
  )
}

function Panel({ title, children, animated }: { title: string; children: React.ReactNode; animated?: boolean }) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-beige-100 p-3', animated && 'animate-fade-in')}>
      <p className="text-[10px] uppercase tracking-widest text-mauve-400 font-semibold mb-2 px-0.5">{title}</p>
      {children}
    </div>
  )
}

function Btn({ icon, label, onClick, variant = 'default', small }: {
  icon: React.ReactNode; label: string; onClick?: () => void
  variant?: 'default' | 'primary' | 'danger'; small?: boolean
}) {
  return (
    <button onClick={onClick} title={label} className={cn(
      'flex items-center gap-1.5 font-medium rounded-xl transition-all',
      small ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs',
      variant === 'default' && 'bg-beige-50 text-olive-600 hover:bg-beige-100 hover:text-charcoal border border-beige-100',
      variant === 'primary' && 'bg-burgundy-900 text-white hover:bg-burgundy-950 shadow-sm',
      variant === 'danger' && 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    )}>
      {icon}<span>{label}</span>
    </button>
  )
}
