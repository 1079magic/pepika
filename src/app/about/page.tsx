import Image from 'next/image'
import Link from 'next/link'
import { Award, Heart, Leaf, Users } from 'lucide-react'

export const metadata = {
  title: 'About Us — Pepika',
  description: 'Learn about Pepika — premium personalised products handcrafted in our Croatian workshop.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-sage-50">
        <div className="container max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                Crafted with passion in <span className="text-brand-500">Croatia</span>
              </h1>
              <p className="mt-5 text-sage-600 leading-relaxed text-lg">
                Pepika was born from a simple idea: that every home deserves something personal.
                We combine traditional craftsmanship with modern laser technology to create
                products that tell your story.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/products/workshop.jpg" alt="Our workshop" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-charcoal">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Quality First', desc: 'Every product is inspected before shipping. We use only premium materials built to last.' },
              { icon: Heart, title: 'Made with Love', desc: 'Each piece is individually crafted by our team. Mass production has no place here.' },
              { icon: Leaf, title: 'Sustainable', desc: 'We source materials responsibly and minimise waste in our production process.' },
              { icon: Users, title: 'Customer Focused', desc: 'Your satisfaction drives everything we do. We are here for you from order to delivery.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-sage-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage-700 text-white section-padding">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to create something unique?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Browse our collection and personalise the perfect product for your home or someone special.</p>
          <Link href="/shop" className="btn-primary bg-white text-sage-800 hover:bg-brand-50 px-8 py-3.5">
            Shop Now
          </Link>
        </div>
      </section>
    </>
  )
}
