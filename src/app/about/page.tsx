import Image from 'next/image'
import Link from 'next/link'
import { Award, Heart, Leaf, Users, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'About Us — STUDIO E2',
  description: 'Learn about STUDIO E2 — premium personalised products handcrafted in our Croatian workshop.',
}

export default function AboutPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #F2D1C9 60%, #E8D5C4 100%)' }}>
        <div className="container max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal leading-tight">
                Crafted with passion in <span className="text-burgundy-900 italic">Croatia</span>
              </h1>
              <p className="mt-5 text-olive-600 leading-relaxed text-lg">
                STUDIO E2 was born from a simple idea: that every home deserves something personal.
                We combine traditional craftsmanship with modern laser technology to create
                products that tell your story.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-mauve-200/30">
              <Image src="/images/products/workshop.jpg" alt="Our workshop" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-charcoal">Our Values</h2>
            <div className="separator-ornament max-w-xs mx-auto mt-4"><Sparkles className="w-4 h-4 text-mauve-400" /></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Quality First', desc: 'Every product is inspected before shipping. We use only premium materials built to last.' },
              { icon: Heart, title: 'Made with Love', desc: 'Each piece is individually crafted by our team. Mass production has no place here.' },
              { icon: Leaf, title: 'Sustainable', desc: 'We source materials responsibly and minimise waste in our production process.' },
              { icon: Users, title: 'Customer Focused', desc: 'Your satisfaction drives everything we do. We are here for you from order to delivery.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blush-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-burgundy-900" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-olive-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burgundy-900 text-white section-padding">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Ready to create something unique?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Browse our collection and personalise the perfect product.</p>
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-burgundy-900 font-medium rounded-lg hover:bg-blush-100 transition-all">
            Shop Now
          </Link>
        </div>
      </section>
    </>
  )
}
