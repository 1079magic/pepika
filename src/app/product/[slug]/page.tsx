import { products, categories, getRelatedProducts, reviews } from '@/data/store'
import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) return { title: 'Product Not Found — Pepika' }
  return {
    title: `${product.name} — Pepika`,
    description: product.shortDescription,
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) notFound()

  const category = categories.find(c => c.id === product.categoryId) || null
  const related = getRelatedProducts(product)
  const productReviews = reviews.slice(0, 3)

  return (
    <ProductDetailClient
      product={product}
      category={category}
      related={related}
      reviews={productReviews}
    />
  )
}
