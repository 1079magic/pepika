import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact Us — Pepika',
  description: 'Get in touch with Pepika. We are here to help with orders, personalisation, and any questions.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-sage-50">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">Contact Us</h1>
          <p className="mt-3 text-sage-600 max-w-lg">Have a question about your order or need help with personalisation? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Send a Message</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">First Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-sage-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Last Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-sage-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-sage-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Subject</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-sage-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white">
                    <option>General Enquiry</option>
                    <option>Order Question</option>
                    <option>Personalisation Help</option>
                    <option>Wholesale / Business</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
                  <textarea rows={5} className="w-full px-4 py-2.5 rounded-lg border border-sage-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none" />
                </div>
                <button className="btn-primary w-full">Send Message</button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: 'hello@pepika.com', href: 'mailto:hello@pepika.com' },
                    { icon: Phone, label: 'Phone', value: '+385 99 123 4567', href: 'tel:+385991234567' },
                    { icon: MapPin, label: 'Location', value: 'Osijek, Croatia' },
                    { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9:00–17:00 CET' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm text-sage-500">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-charcoal font-medium hover:text-brand-600 transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-charcoal font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sage-700 text-white rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold mb-3">Wholesale & Business</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Interested in bulk orders or branded products? We offer special pricing for businesses, events, and corporate gifts.
                </p>
                <a href="mailto:business@pepika.com" className="inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-white transition-colors">
                  business@pepika.com →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
