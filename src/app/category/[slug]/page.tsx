import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { categories, getProductsByCategory } from '@/data/store'
import ProductCard from '@/components/product/ProductCard'

export function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = categories.find(c => c.slug === params.slug)
  if (!cat) return { title: 'Category Not Found — Pepika' }
  return {
    title: `${cat.name} — Pepika`,
    description: cat.description,
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find(c => c.slug === params.slug)
  if (!category) notFound()

  const products = getProductsByCategory(params.slug)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-sage-50 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-sage-500 mb-6">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brand-600 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">{category.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">{category.name}</h1>
              <p className="mt-4 text-sage-600 leading-relaxed max-w-lg">{category.description}</p>
              <p className="mt-3 text-sm text-sage-400">{products.length} products</p>
            </div>
            <div className="relative hidden lg:block aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
              <Image src={category.image} alt={category.name} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-cream">
        <div className="container max-w-7xl mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sage-500 text-lg">No products in this category yet.</p>
              <Link href="/shop" className="btn-primary mt-6 inline-flex">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
