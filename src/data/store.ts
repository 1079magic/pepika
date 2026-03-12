import { Category, Product, Review } from '@/lib/types'

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Door Name Plates',
    slug: 'door-name-plates',
    description: 'Premium laser-engraved name plates for your front door. Choose from aluminium, acrylic, and wood finishes.',
    image: '/images/products/name-plates-for-doors.jpg',
    productCount: 5,
    featured: true,
  },
  {
    id: 'cat-2',
    name: 'House Numbers',
    slug: 'house-numbers',
    description: 'Elegant house number signs crafted from premium materials. Made to withstand all weather conditions.',
    image: '/images/products/house-numbers.png',
    productCount: 3,
    featured: true,
  },
  {
    id: 'cat-3',
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Personalised home décor pieces that add a unique touch to any room. Clocks, boards, frames, and more.',
    image: '/images/products/home-decor.jpg',
    productCount: 4,
    featured: true,
  },
  {
    id: 'cat-4',
    name: 'Personalised Gifts',
    slug: 'personalised-gifts',
    description: 'Unique personalised gifts for every occasion. Made with love in Croatia.',
    image: '/images/products/personalised-gifts.jpg',
    productCount: 4,
    featured: true,
  },
  {
    id: 'cat-5',
    name: 'LED Signs',
    slug: 'led-signs',
    description: 'Custom LED neon signs for your home, business, or events. Energy-efficient and stunning.',
    image: '/images/products/led-signs.jpg',
    productCount: 2,
    featured: true,
  },
  {
    id: 'cat-6',
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Personalised jewellery pieces. Engrave names, dates, or special messages.',
    image: '/images/products/jewellery.jpg',
    productCount: 2,
    featured: true,
  },
]

export const products: Product[] = [
  // ── DOOR NAME PLATES (5) ──
  {
    id: 'prod-1',
    name: 'Premium Aluminium Name Plate',
    slug: 'premium-aluminium-name-plate',
    description: 'Our flagship door name plate, laser-engraved on brushed aluminium. Weather-resistant and built to last a lifetime. Each plate is carefully crafted in our Croatian workshop using state-of-the-art laser technology.\n\nThe brushed aluminium finish gives a modern, elegant look that complements any door style. UV-resistant coating ensures your name plate looks perfect for years to come.',
    shortDescription: 'Laser-engraved brushed aluminium name plate with weather-resistant coating.',
    price: 49.99,
    images: ['/images/products/premium-name-plate.jpg', '/images/products/name-plate-for-door-1.jpg', '/images/products/name-plate-for-door-2.jpg'],
    categoryId: 'cat-1',
    categorySlug: 'door-name-plates',
    badge: 'bestseller',
    rating: 4.9,
    reviewCount: 127,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Family Name', placeholder: 'Enter your family name', required: true, maxLength: 30 },
      { type: 'text', label: 'Address Line', placeholder: 'e.g. 42 Elm Street', maxLength: 40 },
      { type: 'select', label: 'Finish', options: ['Brushed Silver', 'Matte Black', 'Gold'] },
      { type: 'select', label: 'Size', options: ['Standard (20×10cm)', 'Large (30×15cm)', 'XL (40×20cm)'] },
    ],
    features: ['Laser-engraved precision', 'Weather-resistant aluminium', 'UV-protective coating', 'Easy mounting hardware included', 'Handmade in Croatia'],
    material: 'Brushed Aluminium',
    dimensions: '20 × 10 cm (Standard)',
    deliveryDays: 5,
  },
  {
    id: 'prod-2',
    name: 'Acrylic Name Plate',
    slug: 'acrylic-name-plate',
    description: 'Modern transparent acrylic name plate with elegant laser-engraved text. The transparent design creates a floating effect on your door.',
    shortDescription: 'Modern acrylic name plate with floating transparent design.',
    price: 39.99,
    images: ['/images/products/acrylic-name-plate.jpg', '/images/products/name-plate-for-door-3.jpg'],
    categoryId: 'cat-1',
    categorySlug: 'door-name-plates',
    badge: 'new',
    rating: 4.7,
    reviewCount: 43,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Family Name', placeholder: 'Enter your family name', required: true, maxLength: 30 },
      { type: 'select', label: 'Thickness', options: ['5mm', '8mm', '10mm'] },
    ],
    features: ['Crystal-clear acrylic', 'Floating effect design', 'Indoor & outdoor use', 'UV resistant'],
    material: 'Premium Acrylic',
    dimensions: '20 × 10 cm',
    deliveryDays: 5,
  },
  {
    id: 'prod-3',
    name: 'Standard Name Plate',
    slug: 'standard-name-plate',
    description: 'Classic and affordable name plate for your door. Clean design with clear, precise laser engraving.',
    shortDescription: 'Affordable classic name plate with precise laser engraving.',
    price: 24.99,
    images: ['/images/products/standard-name-plate.jpg', '/images/products/name-plate-for-door-4.jpg'],
    categoryId: 'cat-1',
    categorySlug: 'door-name-plates',
    rating: 4.5,
    reviewCount: 89,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Name', placeholder: 'Enter name', required: true, maxLength: 25 },
    ],
    material: 'Aluminium',
    dimensions: '15 × 8 cm',
    deliveryDays: 3,
  },
  {
    id: 'prod-9',
    name: 'Wooden Name Plate',
    slug: 'wooden-name-plate',
    description: 'Rustic wooden name plate with hand-finished edges and precision laser engraving. Natural oak grain makes each piece unique.',
    shortDescription: 'Hand-finished oak name plate with natural wood grain.',
    price: 44.99,
    images: ['/images/products/name-plate.png', '/images/products/name-plate-for-door-5.JPG'],
    categoryId: 'cat-1',
    categorySlug: 'door-name-plates',
    rating: 4.6,
    reviewCount: 31,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Family Name', placeholder: 'Enter your family name', required: true, maxLength: 25 },
      { type: 'text', label: 'House Number', placeholder: 'Optional house number', maxLength: 6 },
    ],
    material: 'Solid Oak',
    dimensions: '25 × 12 cm',
    deliveryDays: 7,
  },
  {
    id: 'prod-11',
    name: 'Luxury Door Name Plate',
    slug: 'luxury-door-name-plate',
    description: 'Our finest name plate, featuring a dual-tone brushed finish with gold accent borders. Premium grade materials for discerning homeowners.',
    shortDescription: 'Dual-tone luxury name plate with gold accents.',
    price: 79.99,
    images: ['/images/products/name-plate-for-door-2.jpg', '/images/products/premium-name-plate.jpg'],
    categoryId: 'cat-1',
    categorySlug: 'door-name-plates',
    badge: 'limited',
    rating: 5.0,
    reviewCount: 12,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Family Name', placeholder: 'Enter your family name', required: true, maxLength: 25 },
      { type: 'text', label: 'Address', placeholder: 'Optional address line', maxLength: 40 },
      { type: 'select', label: 'Border', options: ['Gold', 'Silver', 'Rose Gold'] },
    ],
    material: 'Premium Aluminium with Gold Finish',
    dimensions: '30 × 15 cm',
    deliveryDays: 10,
  },

  // ── HOUSE NUMBERS (3) ──
  {
    id: 'prod-4',
    name: 'Modern House Number Sign',
    slug: 'modern-house-number-sign',
    description: 'Sleek modern house number sign. Bold, clear numbers visible from the street. Available in multiple finishes.',
    shortDescription: 'Bold modern house number sign visible from the street.',
    price: 34.99,
    images: ['/images/products/house-numbers.png'],
    categoryId: 'cat-2',
    categorySlug: 'house-numbers',
    badge: 'bestseller',
    rating: 4.8,
    reviewCount: 67,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'House Number', placeholder: 'e.g. 42', required: true, maxLength: 6 },
      { type: 'select', label: 'Finish', options: ['Matte Black', 'Brushed Silver', 'Bronze'] },
      { type: 'select', label: 'Size', options: ['Small (15cm)', 'Medium (20cm)', 'Large (30cm)'] },
    ],
    material: 'Stainless Steel',
    dimensions: '20 × 20 cm',
    deliveryDays: 5,
  },
  {
    id: 'prod-13',
    name: 'Floating House Number',
    slug: 'floating-house-number',
    description: 'Elegant floating house numbers mounted with hidden spacers for a sleek, modern look. Each digit is individually cut from stainless steel.',
    shortDescription: 'Individual floating digits with hidden spacers for a modern look.',
    price: 19.99,
    images: ['/images/products/house-numbers.png'],
    categoryId: 'cat-2',
    categorySlug: 'house-numbers',
    badge: 'new',
    rating: 4.7,
    reviewCount: 22,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Number', placeholder: 'e.g. 7', required: true, maxLength: 1 },
      { type: 'select', label: 'Finish', options: ['Matte Black', 'Brushed Silver'] },
    ],
    material: 'Stainless Steel',
    dimensions: '15 cm height per digit',
    deliveryDays: 5,
  },
  {
    id: 'prod-14',
    name: 'Illuminated House Number Plaque',
    slug: 'illuminated-house-number-plaque',
    description: 'Backlit house number plaque with warm LED lighting. Looks stunning at night and helps visitors find your home easily.',
    shortDescription: 'LED backlit house number plaque — visible day and night.',
    price: 64.99,
    images: ['/images/products/house-numbers.png'],
    categoryId: 'cat-2',
    categorySlug: 'house-numbers',
    rating: 4.9,
    reviewCount: 15,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'House Number', placeholder: 'e.g. 42A', required: true, maxLength: 5 },
      { type: 'select', label: 'LED Color', options: ['Warm White', 'Cool White'] },
    ],
    material: 'Aluminium + LED',
    dimensions: '25 × 25 cm',
    deliveryDays: 7,
  },

  // ── HOME DÉCOR (4) ──
  {
    id: 'prod-5',
    name: 'Personalised Wall Clock',
    slug: 'personalised-wall-clock',
    description: 'Beautiful personalised wall clock. Add your family name, a special date, or a meaningful message. Perfect gift for housewarmings and weddings.',
    shortDescription: 'Custom wall clock with your personal message or family name.',
    price: 54.99,
    originalPrice: 64.99,
    images: ['/images/products/wall-clock.jpg', '/images/products/wall-clock-2.jpg'],
    categoryId: 'cat-3',
    categorySlug: 'home-decor',
    badge: 'sale',
    rating: 4.6,
    reviewCount: 34,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Main Text', placeholder: 'e.g. The Smiths', required: true, maxLength: 25 },
      { type: 'text', label: 'Subtitle', placeholder: 'e.g. Est. 2020', maxLength: 30 },
      { type: 'select', label: 'Style', options: ['Modern Minimalist', 'Classic Roman', 'Rustic'] },
    ],
    material: 'Wood & Acrylic',
    dimensions: '30 cm diameter',
    deliveryDays: 7,
  },
  {
    id: 'prod-10',
    name: 'Personalised Chopping Board',
    slug: 'personalised-chopping-board',
    description: 'Premium bamboo chopping board with personalised laser engraving. A perfect housewarming or wedding gift.',
    shortDescription: 'Engraved bamboo chopping board — ideal for gifts.',
    price: 34.99,
    images: ['/images/products/home-decor.jpg'],
    categoryId: 'cat-3',
    categorySlug: 'home-decor',
    rating: 4.5,
    reviewCount: 45,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Names', placeholder: 'e.g. Tom & Sarah', required: true, maxLength: 30 },
      { type: 'text', label: 'Date', placeholder: 'e.g. 15.06.2024', maxLength: 15 },
    ],
    material: 'Bamboo',
    dimensions: '35 × 25 cm',
    deliveryDays: 5,
  },
  {
    id: 'prod-15',
    name: 'Engraved Photo Frame',
    slug: 'engraved-photo-frame',
    description: 'Solid wood photo frame with custom laser engraving around the border. Fits standard 10×15cm photos.',
    shortDescription: 'Wooden photo frame with personalised laser-engraved border.',
    price: 29.99,
    images: ['/images/products/home-decor.jpg'],
    categoryId: 'cat-3',
    categorySlug: 'home-decor',
    badge: 'new',
    rating: 4.4,
    reviewCount: 19,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Engraving Text', placeholder: 'e.g. Our Wedding Day', required: true, maxLength: 30 },
    ],
    material: 'Solid Walnut',
    dimensions: '18 × 23 cm (fits 10×15 photo)',
    deliveryDays: 5,
  },
  {
    id: 'prod-16',
    name: 'Personalised Coaster Set',
    slug: 'personalised-coaster-set',
    description: 'Set of 4 engraved slate coasters with a bamboo holder. Perfect housewarming gift or personal treat.',
    shortDescription: 'Set of 4 engraved slate coasters with bamboo holder.',
    price: 27.99,
    images: ['/images/products/home-decor.jpg'],
    categoryId: 'cat-3',
    categorySlug: 'home-decor',
    rating: 4.3,
    reviewCount: 28,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Text on Coasters', placeholder: 'e.g. Family Name or Initials', required: true, maxLength: 15 },
    ],
    material: 'Natural Slate + Bamboo',
    dimensions: '10 × 10 cm each',
    deliveryDays: 5,
  },

  // ── PERSONALISED GIFTS (4) ──
  {
    id: 'prod-7',
    name: 'Personalised Gift Box',
    slug: 'personalised-gift-box',
    description: 'A beautifully crafted wooden gift box with personalised laser engraving. Fill it with your own treasures or let us create a curated gift set.',
    shortDescription: 'Engraved wooden gift box — perfect for any special occasion.',
    price: 29.99,
    images: ['/images/products/personalised-gifts.jpg'],
    categoryId: 'cat-4',
    categorySlug: 'personalised-gifts',
    rating: 4.7,
    reviewCount: 56,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Recipient Name', placeholder: 'Who is this for?', required: true, maxLength: 25 },
      { type: 'text', label: 'Message', placeholder: 'Add a personal message', maxLength: 60 },
    ],
    material: 'Solid Wood',
    dimensions: '25 × 18 × 10 cm',
    deliveryDays: 5,
  },
  {
    id: 'prod-12',
    name: 'Workshop Tour Experience',
    slug: 'workshop-tour-experience',
    description: 'Visit our workshop in Croatia and create your own personalised product guided by our craftspeople. A unique experience gift.',
    shortDescription: 'Visit our Croatian workshop and create your own piece.',
    price: 99.99,
    images: ['/images/products/workshop.jpg'],
    categoryId: 'cat-4',
    categorySlug: 'personalised-gifts',
    badge: 'new',
    rating: 5.0,
    reviewCount: 8,
    personalizable: false,
    material: 'Experience',
    deliveryDays: 1,
  },
  {
    id: 'prod-17',
    name: 'Custom Map Print',
    slug: 'custom-map-print',
    description: 'A beautifully rendered map centred on a location meaningful to you. Perfect for commemorating where you met, got married, or called home.',
    shortDescription: 'Personalised map print of any location in the world.',
    price: 39.99,
    images: ['/images/products/personalised-gifts.jpg'],
    categoryId: 'cat-4',
    categorySlug: 'personalised-gifts',
    badge: 'bestseller',
    rating: 4.8,
    reviewCount: 62,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Location', placeholder: 'e.g. Paris, France', required: true, maxLength: 40 },
      { type: 'text', label: 'Title', placeholder: 'e.g. Where It All Began', maxLength: 30 },
      { type: 'select', label: 'Style', options: ['Modern Minimal', 'Classic', 'Watercolour'] },
    ],
    material: 'Premium Art Paper',
    dimensions: '30 × 40 cm',
    deliveryDays: 5,
  },
  {
    id: 'prod-18',
    name: 'Personalised Keyring',
    slug: 'personalised-keyring',
    description: 'Compact stainless steel keyring with custom engraving. A small but meaningful gift that travels everywhere.',
    shortDescription: 'Engraved stainless steel keyring — compact and personal.',
    price: 14.99,
    images: ['/images/products/personalised-gifts.jpg'],
    categoryId: 'cat-4',
    categorySlug: 'personalised-gifts',
    rating: 4.4,
    reviewCount: 73,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Engraving', placeholder: 'e.g. Drive safe, I love you', required: true, maxLength: 25 },
    ],
    material: 'Stainless Steel',
    dimensions: '4 × 2.5 cm',
    deliveryDays: 3,
  },

  // ── LED SIGNS (2) ──
  {
    id: 'prod-6',
    name: 'Custom LED Neon Sign',
    slug: 'custom-led-neon-sign',
    description: 'Design your own LED neon sign. Perfect for homes, weddings, businesses, and events. Energy efficient and long-lasting.',
    shortDescription: 'Design your own custom LED neon sign for any occasion.',
    price: 89.99,
    images: ['/images/products/led-signs.jpg', '/images/products/led-sign-2.jpg'],
    categoryId: 'cat-5',
    categorySlug: 'led-signs',
    badge: 'new',
    rating: 4.9,
    reviewCount: 21,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Your Text', placeholder: 'What should your sign say?', required: true, maxLength: 20 },
      { type: 'color', label: 'LED Color', options: ['Warm White', 'Cool White', 'Pink', 'Blue', 'Red', 'Green', 'Yellow'] },
      { type: 'select', label: 'Size', options: ['Small (40cm)', 'Medium (60cm)', 'Large (80cm)', 'XL (100cm)'] },
    ],
    material: 'LED Flex Neon on Acrylic',
    dimensions: '60 cm (Medium)',
    deliveryDays: 10,
  },
  {
    id: 'prod-19',
    name: 'LED Name Light',
    slug: 'led-name-light',
    description: 'A compact LED light spelling out a name or word. Perfect nightlight for kids or decorative accent for any shelf.',
    shortDescription: 'Compact LED name light — perfect as a nightlight or accent.',
    price: 44.99,
    images: ['/images/products/led-sign-2.jpg'],
    categoryId: 'cat-5',
    categorySlug: 'led-signs',
    rating: 4.6,
    reviewCount: 35,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Name', placeholder: 'e.g. Emma', required: true, maxLength: 10 },
      { type: 'color', label: 'Color', options: ['Warm White', 'Pink', 'Blue'] },
    ],
    material: 'LED + Acrylic Base',
    dimensions: '30 cm wide',
    deliveryDays: 7,
  },

  // ── JEWELLERY (2) ──
  {
    id: 'prod-8',
    name: 'Engraved Silver Earrings',
    slug: 'engraved-silver-earrings',
    description: 'Elegant sterling silver earrings with custom laser engraving. Add initials, a date, or a small symbol for a truly personal piece.',
    shortDescription: 'Sterling silver earrings with custom laser engraving.',
    price: 44.99,
    images: ['/images/products/earrings.jpg', '/images/products/jewellery.jpg'],
    categoryId: 'cat-6',
    categorySlug: 'jewellery',
    badge: 'limited',
    rating: 4.8,
    reviewCount: 18,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Engraving Text', placeholder: 'e.g. A & J', required: true, maxLength: 10 },
      { type: 'select', label: 'Style', options: ['Round Drop', 'Oval', 'Heart'] },
    ],
    material: '925 Sterling Silver',
    dimensions: '1.5 cm',
    deliveryDays: 7,
  },
  {
    id: 'prod-20',
    name: 'Personalised Silver Pendant',
    slug: 'personalised-silver-pendant',
    description: 'Delicate sterling silver pendant with hand-engraved initials or a short word. Comes on a 45cm chain.',
    shortDescription: 'Sterling silver pendant with hand-engraved initials.',
    price: 54.99,
    images: ['/images/products/jewellery.jpg'],
    categoryId: 'cat-6',
    categorySlug: 'jewellery',
    badge: 'new',
    rating: 4.9,
    reviewCount: 11,
    personalizable: true,
    personalizationOptions: [
      { type: 'text', label: 'Initials / Word', placeholder: 'e.g. AJ or Love', required: true, maxLength: 8 },
      { type: 'select', label: 'Chain Length', options: ['40cm', '45cm', '50cm'] },
    ],
    material: '925 Sterling Silver',
    dimensions: '1.2 cm pendant',
    deliveryDays: 7,
  },
]

export const reviews: Review[] = [
  { id: 'rev-1', author: 'Marija K.', rating: 5, date: '2025-02-15', text: 'Absolutely stunning name plate! The engraving is incredibly precise and the aluminium finish is gorgeous. Our neighbours keep asking where we got it.', verified: true },
  { id: 'rev-2', author: 'Thomas B.', rating: 5, date: '2025-01-28', text: 'Ordered as a housewarming gift and it was a huge hit. Fast delivery to Germany and beautifully packaged.', verified: true },
  { id: 'rev-3', author: 'Ana S.', rating: 4, date: '2025-03-01', text: 'Great quality product. Only wish there were more font options, but the result is still beautiful.', verified: true },
  { id: 'rev-4', author: 'Michael R.', rating: 5, date: '2025-02-20', text: 'Second order from Pepika and the quality is consistently excellent. The LED sign we ordered for our shop looks amazing.', verified: true },
  { id: 'rev-5', author: 'Elena V.', rating: 5, date: '2025-01-10', text: 'The personalised wall clock was the perfect wedding gift. Beautiful craftsmanship and arrived in perfect condition.', verified: true },
  { id: 'rev-6', author: 'Stefan M.', rating: 5, date: '2025-03-05', text: 'Got the custom map print for our anniversary. My wife cried happy tears. The paper quality is outstanding.', verified: true },
  { id: 'rev-7', author: 'Laura P.', rating: 4, date: '2025-02-08', text: 'Love the silver pendant. Delicate and beautifully engraved. Chain could be a bit sturdier but overall very happy.', verified: true },
]

// ── HELPER FUNCTIONS ──

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.categorySlug === categorySlug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.badge === 'bestseller' || p.rating >= 4.8).slice(0, 8)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit)
}

export function getNewProducts(limit = 4): Product[] {
  return products.filter(p => p.badge === 'new').slice(0, limit)
}

export function getProductsByPriceRange(min: number, max: number): Product[] {
  return products.filter(p => p.price >= min && p.price <= max)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.shortDescription.toLowerCase().includes(q) ||
    p.material?.toLowerCase().includes(q)
  )
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export function sortProducts(prods: Product[], sortBy: SortOption): Product[] {
  const sorted = [...prods]
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0))
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.badge === 'bestseller' ? 1 : 0) - (a.badge === 'bestseller' ? 1 : 0))
  }
}
