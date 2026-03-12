import { Star, ThumbsUp } from 'lucide-react'
import { Review } from '@/lib/types'

interface ReviewSectionProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
}

export default function ReviewSection({ reviews, averageRating, totalCount }: ReviewSectionProps) {
  // Generate distribution for the rating bar (simulated from average)
  const distribution = generateDistribution(averageRating, totalCount)

  return (
    <div>
      {/* Summary + Cards layout */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Rating Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50 h-fit">
          <div className="text-center mb-5">
            <p className="text-5xl font-bold text-burgundy-900 font-display">{averageRating}</p>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-mauve-500 text-mauve-500' : 'text-beige-200'}`}
                />
              ))}
            </div>
            <p className="text-sm text-olive-600 mt-1.5">Based on {totalCount} reviews</p>
          </div>

          {/* Rating distribution bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = distribution[stars] || 0
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
              return (
                <div key={stars} className="flex items-center gap-2.5 text-sm">
                  <span className="w-3 text-right text-olive-600 font-medium">{stars}</span>
                  <Star className="w-3 h-3 fill-mauve-400 text-mauve-400 shrink-0" />
                  <div className="flex-1 h-2 bg-beige-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mauve-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-xs text-mauve-400">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center text-sm font-bold text-burgundy-900 shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-mauve-500 text-mauve-500' : 'text-beige-200'}`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-[10px] uppercase tracking-wider text-mauve-400 font-medium bg-mauve-50 px-1.5 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <time className="text-xs text-mauve-300 whitespace-nowrap">{formatDate(review.date)}</time>
              </div>
              <p className="text-sm text-olive-600 leading-relaxed mt-3">{review.text}</p>
              <button className="flex items-center gap-1.5 text-xs text-mauve-400 hover:text-burgundy-900 mt-3 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helpers
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function generateDistribution(avg: number, total: number): Record<number, number> {
  // Simulate a realistic distribution based on average rating
  if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const weights: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const rounded = Math.round(avg)
  weights[rounded] = 0.55
  if (rounded < 5) weights[rounded + 1 > 5 ? 5 : rounded + 1] = 0.2
  if (rounded > 1) weights[rounded - 1 < 1 ? 1 : rounded - 1] = 0.15
  weights[rounded === 5 ? 4 : 5] += 0.07
  weights[rounded <= 2 ? 3 : 1] += 0.03
  const dist: Record<number, number> = {}
  let allocated = 0
  for (const star of [5, 4, 3, 2, 1]) {
    const count = Math.round(total * (weights[star] || 0))
    dist[star] = count
    allocated += count
  }
  // Fix rounding to match total
  dist[rounded] += total - allocated
  return dist
}
