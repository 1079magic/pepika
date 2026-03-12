import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-white border-b border-beige-100" aria-label="Breadcrumb">
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm text-olive-600 overflow-x-auto whitespace-nowrap">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-mauve-300" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-burgundy-900 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-charcoal font-medium truncate max-w-[200px]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
