import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'technology',
    slug: 'technology',
    name: 'Technology',
    description: 'Engineering, product, AI/ML, and technical leadership',
    icon: 'Laptop',
    expertCount: 5,
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Finance',
    description: 'Investment banking, fundraising, CFO advisory, and financial strategy',
    icon: 'TrendingUp',
    expertCount: 4,
  },
  {
    id: 'marketing',
    slug: 'marketing',
    name: 'Marketing',
    description: 'Growth marketing, brand strategy, and customer acquisition',
    icon: 'Megaphone',
    expertCount: 3,
  },
  {
    id: 'legal',
    slug: 'legal',
    name: 'Legal',
    description: 'Corporate law, M&A, compliance, and regulatory affairs',
    icon: 'Scale',
    expertCount: 1,
  },
  {
    id: 'strategy',
    slug: 'strategy',
    name: 'Strategy',
    description: 'Business strategy, market entry, and strategic planning',
    icon: 'Target',
    expertCount: 12,
  },
  {
    id: 'operations',
    slug: 'operations',
    name: 'Operations',
    description: 'Operations excellence, supply chain, and process optimization',
    icon: 'Settings',
    expertCount: 4,
  },
  {
    id: 'hr',
    slug: 'hr',
    name: 'HR & Talent',
    description: 'People operations, hiring, culture, and organizational design',
    icon: 'Users',
    expertCount: 1,
  },
  {
    id: 'sales',
    slug: 'sales',
    name: 'Sales',
    description: 'Enterprise sales, sales leadership, and go-to-market strategy',
    icon: 'Handshake',
    expertCount: 1,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
