import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl text-white mb-2">Stay in the loop</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">Get 10% off your first order and be the first to know about new products and offers.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-brand-400 transition-colors"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-2xl font-bold text-white">Pepika</Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Premium personalised products, handcrafted in Croatia. From name plates to jewellery — each piece tells your story.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/category/door-name-plates" className="hover:text-brand-400 transition-colors">Door Name Plates</Link></li>
              <li><Link href="/category/house-numbers" className="hover:text-brand-400 transition-colors">House Numbers</Link></li>
              <li><Link href="/category/home-decor" className="hover:text-brand-400 transition-colors">Home Décor</Link></li>
              <li><Link href="/category/personalised-gifts" className="hover:text-brand-400 transition-colors">Personalised Gifts</Link></li>
              <li><Link href="/category/led-signs" className="hover:text-brand-400 transition-colors">LED Signs</Link></li>
              <li><Link href="/category/jewellery" className="hover:text-brand-400 transition-colors">Jewellery</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">Our Workshop</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" />
                <span>Osijek, Croatia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-brand-400" />
                <a href="mailto:hello@pepika.com" className="hover:text-brand-400 transition-colors">hello@pepika.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-brand-400" />
                <a href="tel:+385991234567" className="hover:text-brand-400 transition-colors">+385 99 123 4567</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Pepika. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
