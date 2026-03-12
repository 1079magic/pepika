import { products, categories } from '@/data/store'
import ShopPageClient from './ShopPageClient'

export const metadata = {
  title: 'Shop All Products — STUDIO E2',
  description: 'Browse our full collection of personalised products. Name plates, house numbers, LED signs, jewellery and more.',
}

export default function ShopPage() {
  return <ShopPageClient allProducts={products} categories={categories} />
}
