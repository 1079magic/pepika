import { products } from '@/data/store'
import { notFound } from 'next/navigation'
import EditorPageClient from './EditorPageClient'

export function generateStaticParams() {
  return products.filter(p => p.personalizable).map(p => ({ productId: p.id }))
}

export function generateMetadata({ params }: { params: { productId: string } }) {
  const product = products.find(p => p.id === params.productId)
  return {
    title: product ? `Personalise ${product.name} — STUDIO E2` : 'Editor — STUDIO E2',
    description: product ? `Design your personalised ${product.name}` : undefined,
  }
}

export default function EditorPage({ params }: { params: { productId: string } }) {
  const product = products.find(p => p.id === params.productId)
  if (!product) notFound()
  return <EditorPageClient product={product} />
}
