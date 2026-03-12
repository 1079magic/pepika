'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product, Category } from '@/lib/types'
import { sortProducts, SortOption } from '@/data/store'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'

interface Props {
  allProducts: Product[]
  categories: Category[]
}

export default function ShopPageClient({ allProducts, categories }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? allProducts.filter(p => p.categorySlug === activeCategory)
    : allProducts
  const sorted = sortProducts(filtered, sortBy)

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #F2D1C9 60%, #E8D5C4 100%)' }}>
        <div className="container max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-2 text-sm text-olive-600 mb-4">
            <Link href="/" className="hover:text-burgundy-900 transition-colors">Home</Link>
            <span className="text-mauve-300">/</span>
            <span className="text-burgundy-900 font-medium">Shop</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal">All Products</h1>
          <p className="mt-2 text-olive-600 text-lg">{allProducts.length} personalised products — handcrafted in Croatia</p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                !activeCategory
                  ? 'bg-burgundy-900 text-white border-burgundy-900'
                  : 'bg-white text-olive-600 border-beige-200 hover:border-mauve-400 hover:text-burgundy-900'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-burgundy-900 text-white border-burgundy-900'
                    : 'bg-white text-olive-600 border-beige-200 hover:border-mauve-400 hover:text-burgundy-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <ProductFilters
            totalCount={sorted.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <ProductGrid products={sorted} />
        </div>
      </section>
    </>
  )
}
