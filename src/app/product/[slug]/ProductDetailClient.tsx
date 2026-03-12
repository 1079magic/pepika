'use client'

import { Sparkles } from 'lucide-react'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import PersonalizationForm from '@/components/product/PersonalizationForm'
import ReviewSection from '@/components/product/ReviewSection'
import ProductGrid from '@/components/product/ProductGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { Product, Category, Review } from '@/lib/types'

interface Props {
  product: Product
  category: Category | null
  related: Product[]
  reviews: Review[]
}

export default function ProductDetailClient({ product, category, related, reviews }: Props) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: product.name },
  ]

  return (
    <>
      <Breadcrumb items={breadcrumbs} />

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Left — Gallery */}
            <ProductGallery
              images={product.images}
              name={product.name}
              badge={product.badge}
            />

            {/* Right — Info + Personalization + Cart */}
            <div className="space-y-6">
              <ProductInfo product={product} />
              <PersonalizationForm product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT DESCRIPTION — TABS STYLE ═══ */}
      <section className="bg-white border-t border-beige-100">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-charcoal mb-6">About This Product</h2>
            <div className="text-olive-600 leading-relaxed whitespace-pre-line text-[15px]">
              {product.description}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section className="border-t border-beige-100" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-display text-3xl font-bold text-charcoal">Customer Reviews</h2>
            <span className="text-sm text-mauve-400 font-medium bg-mauve-50 px-2.5 py-1 rounded-full">
              {product.reviewCount}
            </span>
          </div>
          <ReviewSection
            reviews={reviews}
            averageRating={product.rating}
            totalCount={product.reviewCount}
          />
        </div>
      </section>

      {/* ═══ RELATED PRODUCTS ═══ */}
      {related.length > 0 && (
        <section className="bg-white border-t border-beige-100">
          <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-display text-3xl font-bold text-charcoal">You May Also Like</h2>
              <div className="separator-ornament flex-1 max-w-[100px]">
                <Sparkles className="w-3 h-3 text-mauve-300" />
              </div>
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  )
}
