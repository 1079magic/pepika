'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Category, Product } from '@/lib/types'
import { sortProducts, SortOption } from '@/data/store'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'

interface Props {
  category: Category
  products: Product[]
}

export default function CategoryPageClient({ category, products }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const sorted = sortProducts(products, sortBy)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #F2D1C9 60%, #E8D5C4 100%)' }}>
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-olive-600 mb-6">
            <Link href="/" className="hover:text-burgundy-900 transition-colors">Home</Link>
            <span className="text-mauve-300">/</span>
            <Link href="/shop" className="hover:text-burgundy-900 transition-colors">Shop</Link>
            <span className="text-mauve-300">/</span>
            <span className="text-burgundy-900 font-medium">{category.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal">{category.name}</h1>
              <p className="mt-4 text-olive-600 leading-relaxed max-w-lg text-lg">{category.description}</p>
              <p className="mt-3 text-sm text-mauve-500">{products.length} products</p>
            </div>
            <div className="relative hidden lg:block aspect-[16/9] rounded-xl overflow-hidden shadow-lg ring-1 ring-mauve-200/30">
              <Image src={category.image} alt={category.name} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4">
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
