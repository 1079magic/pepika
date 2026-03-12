import { categories, getProductsByCategory } from '@/data/store'
import { notFound } from 'next/navigation'
import CategoryPageClient from './CategoryPageClient'

export function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = categories.find(c => c.slug === params.slug)
  if (!cat) return { title: 'Category Not Found — STUDIO E2' }
  return {
    title: `${cat.name} — STUDIO E2`,
    description: cat.description,
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find(c => c.slug === params.slug)
  if (!category) notFound()

  const products = getProductsByCategory(params.slug)

  return <CategoryPageClient category={category} products={products} />
}
