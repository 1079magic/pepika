export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  featured?: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: string
  categorySlug: string
  badge?: 'bestseller' | 'new' | 'sale' | 'limited'
  rating: number
  reviewCount: number
  personalizable: boolean
  personalizationOptions?: PersonalizationOption[]
  variants?: ProductVariant[]
  features?: string[]
  material?: string
  dimensions?: string
  deliveryDays?: number
}

export interface PersonalizationOption {
  type: 'text' | 'image' | 'select' | 'color'
  label: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  options?: string[]
}

export interface ProductVariant {
  id: string
  name: string
  price?: number
  image?: string
}

export interface CartItem {
  product: Product
  quantity: number
  personalization?: Record<string, string>
  variant?: ProductVariant
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  verified: boolean
}
