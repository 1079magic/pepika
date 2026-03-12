import Link from 'next/link'
import { products, categories } from '@/data/store'
import ProductCard from '@/components/product/ProductCard'

export const metadata = {
  title: 'Shop All Products — Pepika',
  description: 'Browse our full collection of personalised products. Name plates, house numbers, LED signs, jewellery and more.',
}

export default function ShopPage() {
  return (
    <>
      <section className="bg-sage-50">
        <div className="container max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-2 text-sm text-sage-500 mb-4">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">Shop</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">All Products</h1>
          <p className="mt-2 text-sage-600">{products.length} personalised products — handcrafted in Croatia</p>
        </div>
      </section>

      <section className="bg-cream section-padding">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-full">All</span>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 text-sm font-medium bg-white text-sage-600 rounded-full border border-sage-200 hover:border-brand-400 hover:text-brand-600 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
