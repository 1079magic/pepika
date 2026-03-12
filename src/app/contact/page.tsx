import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact Us — STUDIO E2',
  description: 'Get in touch with STUDIO E2. We are here to help with orders, personalisation, and any questions.',
}

export default function ContactPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #F2D1C9 60%, #E8D5C4 100%)' }}>
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal">Contact Us</h1>
          <p className="mt-3 text-olive-600 max-w-lg text-lg">Have a question about your order or need help with personalisation? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-beige-100/50">
              <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Send a Message</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">First Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Last Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Subject</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all bg-white">
                    <option>General Enquiry</option>
                    <option>Order Question</option>
                    <option>Personalisation Help</option>
                    <option>Wholesale / Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
                  <textarea rows={5} className="w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all resize-none" />
                </div>
                <button className="btn-primary w-full">Send Message</button>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: 'office@e2studio.hr', href: 'mailto:office@e2studio.hr' },
                    { icon: Phone, label: 'Phone', value: '+385 91 469 22 19', href: 'tel:+385914692219' },
                    { icon: MapPin, label: 'Location', value: 'Ulica Petra Krešimira IV 36, Slavonski Brod, Hrvatska' },
                    { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9:00–17:00 CET' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blush-100 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-burgundy-900" />
                      </div>
                      <div>
                        <p className="text-sm text-olive-600">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-charcoal font-medium hover:text-burgundy-900 transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-charcoal font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-olive-600 text-white rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold mb-3">Wholesale & Business</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">Interested in bulk orders or branded products? We offer special pricing for businesses.</p>
                <a href="mailto:office@e2studio.hr" className="inline-flex items-center gap-2 text-sm font-medium text-beige-100 hover:text-white transition-colors">
                  office@e2studio.hr →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
