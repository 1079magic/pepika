'use client'

import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react'
import { SortOption } from '@/data/store'

interface ProductFiltersProps {
  totalCount: number
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  priceRange?: [number, number]
  onPriceRangeChange?: (range: [number, number]) => void
}

export default function ProductFilters({ totalCount, sortBy, onSortChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-beige-100">
      <p className="text-sm text-olive-600">
        Showing <span className="font-semibold text-charcoal">{totalCount}</span> products
      </p>

      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-mauve-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm bg-white border border-beige-200 rounded-lg px-3 py-2 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all text-charcoal cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Price Range Chips (UI placeholder) */}
        <div className="hidden md:flex items-center gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'Under €30', value: 'under30' },
            { label: '€30–€60', value: '30-60' },
            { label: '€60+', value: '60plus' },
          ].map(chip => (
            <button
              key={chip.value}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                chip.value === 'all'
                  ? 'bg-burgundy-900 text-white border-burgundy-900'
                  : 'bg-white text-olive-600 border-beige-200 hover:border-mauve-400 hover:text-burgundy-900'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
