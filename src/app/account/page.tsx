import Link from 'next/link'
import { User, Package, Heart, Settings, LogIn } from 'lucide-react'

export const metadata = {
  title: 'My Account — Pepika',
}

export default function AccountPage() {
  return (
    <section className="bg-cream section-padding">
      <div className="container max-w-3xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-charcoal mb-8">My Account</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <User className="w-16 h-16 text-sage-200 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-charcoal mb-2">Sign in to your account</h2>
          <p className="text-sage-500 mb-6 max-w-sm mx-auto">Track orders, save favourites, and manage your personalisation history.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-primary gap-2">
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button className="btn-outline">Create Account</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Package, title: 'My Orders', desc: 'Track your order status' },
            { icon: Heart, title: 'Wishlist', desc: 'Your saved products' },
            { icon: Settings, title: 'Settings', desc: 'Account preferences' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <item.icon className="w-8 h-8 text-sage-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-charcoal">{item.title}</h3>
              <p className="text-xs text-sage-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
