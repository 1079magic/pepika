import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Palette, Award, Sparkles } from 'lucide-react'
import { categories, getFeaturedProducts, getNewProducts, reviews } from '@/data/store'
import ProductCard from '@/components/product/ProductCard'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const newest = getNewProducts()

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #F2D1C9 40%, #E8D5C4 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20.5z\' fill=\'%23632B30\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
        <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm text-burgundy-900 text-sm font-medium rounded-full mb-6 border border-mauve-200/50">
                <Award className="w-4 h-4" /> Handcrafted in Croatia
              </span>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal leading-[1.1]">
                Gifts that tell
                <span className="text-burgundy-900 block italic">your story</span>
              </h1>
              <p className="mt-5 text-lg text-olive-600 leading-relaxed">
                Premium personalised products — from laser-engraved name plates to custom LED signs.
                Each piece is crafted with care in our Croatian workshop.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/shop" className="btn-primary text-base px-8 py-3.5 gap-2">
                  Shop All Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/personalised-gifts" className="btn-outline text-base px-8 py-3.5">
                  Gift Finder
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-olive-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-mauve-500" />
                  <span>Free shipping €100+</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-mauve-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-mauve-500" />
                  <span>Fully customisable</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-mauve-200/30">
                <Image src="/images/products/premium-name-plate.jpg" alt="Premium personalised name plate" fill className="object-cover" priority />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg px-5 py-4 flex items-center gap-3 border border-beige-100">
                <div className="w-12 h-12 rounded-full bg-blush-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-burgundy-900 fill-burgundy-900" />
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal">4.9 / 5 Rating</p>
                  <p className="text-xs text-olive-600">Based on 500+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section-padding bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-mauve-500 font-medium mb-2">Explore</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">Shop by Category</h2>
            <div className="separator-ornament max-w-xs mx-auto mt-4"><Sparkles className="w-4 h-4 text-mauve-400" /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group relative overflow-hidden rounded-xl aspect-[3/4] shadow-sm hover:shadow-lg transition-all duration-300">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{cat.productCount} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="section-padding" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-mauve-500 font-medium mb-2">Bestsellers</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">Featured Products</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-burgundy-900 hover:text-mauve-600 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link href="/shop" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section-padding bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-mauve-500 font-medium mb-2">Simple Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">How It Works</h2>
            <div className="separator-ornament max-w-xs mx-auto mt-4"><Sparkles className="w-4 h-4 text-mauve-400" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Choose your product', desc: 'Browse our collection of premium personalised products.' },
              { step: '02', title: 'Personalise it', desc: 'Add your text, photos, and choose your style options.' },
              { step: '03', title: 'We craft it', desc: 'Our artisans handcraft your order in our Croatian workshop.' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-blush-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-mauve-100 transition-colors">
                  <span className="font-display text-2xl font-bold text-burgundy-900">{item.step}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-olive-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GIFT FINDER CTA ═══ */}
      <section className="relative overflow-hidden bg-burgundy-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container max-w-7xl mx-auto px-4 py-16 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Not sure what to get?
                <br />
                <span className="text-blush-100 italic">Try our Gift Finder</span>
              </h2>
              <p className="mt-4 text-white/70 max-w-lg leading-relaxed">
                Tell us who the gift is for, the occasion, and your budget — we&apos;ll suggest the perfect personalised gift.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-white text-burgundy-900 font-medium rounded-lg hover:bg-blush-100 transition-all shadow-sm">
                Find the Perfect Gift <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative hidden lg:flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="rounded-xl overflow-hidden shadow-lg aspect-square relative ring-2 ring-white/10">
                  <Image src="/images/products/led-signs.jpg" alt="LED signs" fill className="object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-square relative mt-8 ring-2 ring-white/10">
                  <Image src="/images/products/wall-clock.jpg" alt="Wall clock" fill className="object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-square relative -mt-4 ring-2 ring-white/10">
                  <Image src="/images/products/earrings.jpg" alt="Earrings" fill className="object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-square relative mt-4 ring-2 ring-white/10">
                  <Image src="/images/products/personalised-gifts.jpg" alt="Gift box" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section-padding" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-mauve-500 font-medium mb-2">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-beige-100/50">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-mauve-500 text-mauve-500" />
                  ))}
                </div>
                <p className="text-sm text-olive-600 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-xs font-bold text-burgundy-900">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{review.author}</p>
                    {review.verified && <p className="text-xs text-mauve-400">Verified Purchase</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="bg-white border-t border-beige-100">
        <div className="container max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over €100' },
              { icon: Shield, title: 'Secure Payments', desc: 'Stripe & PayPal' },
              { icon: Palette, title: 'Fully Customisable', desc: 'Make it yours' },
              { icon: Award, title: 'Handcrafted', desc: 'Made in Croatia' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center">
                <item.icon className="w-7 h-7 text-burgundy-900 mb-3" />
                <h4 className="text-sm font-semibold text-charcoal">{item.title}</h4>
                <p className="text-xs text-olive-600 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
