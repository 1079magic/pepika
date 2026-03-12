import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-24 px-4">
      <h1 className="font-display text-7xl font-bold text-beige-200 mb-4">404</h1>
      <h2 className="font-display text-2xl font-bold text-charcoal mb-3">Page Not Found</h2>
      <p className="text-olive-600 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  )
}
