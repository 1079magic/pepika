import Link from 'next/link'
import { Wand2, ArrowLeft } from 'lucide-react'
import { products } from '@/data/store'

export function generateStaticParams() {
  return products.map(p => ({ productId: p.id }))
}

export function generateMetadata({ params }: { params: { productId: string } }) {
  const product = products.find(p => p.id === params.productId)
  return { title: product ? `Personalise ${product.name} — Pepika` : 'Editor — Pepika' }
}

export default function EditorPage({ params }: { params: { productId: string } }) {
  const product = products.find(p => p.id === params.productId)

  return (
    <section className="min-h-[70vh] flex items-center justify-center" style={{ backgroundColor: '#faf7f4' }}>
      <div className="text-center px-4 max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-mauve-50 flex items-center justify-center mx-auto mb-6">
          <Wand2 className="w-10 h-10 text-mauve-500" />
        </div>
        <h1 className="font-display text-4xl font-bold text-charcoal mb-3">
          Personalisation Editor
        </h1>
        <p className="text-olive-600 mb-2">
          {product
            ? <>The advanced editor for <strong className="text-burgundy-900">{product.name}</strong> is coming soon.</>
            : 'The advanced personalisation editor is coming soon.'
          }
        </p>
        <p className="text-sm text-mauve-400 mb-8">
          Upload photos, drag elements, choose fonts, and preview your design in real time.
        </p>
        <div className="flex gap-3 justify-center">
          {product && (
            <Link href={`/product/${product.slug}`} className="btn-primary gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Product
            </Link>
          )}
          <Link href="/shop" className="btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  )
}
