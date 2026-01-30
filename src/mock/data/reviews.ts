import type { Review } from '@/types'

export const reviews: Review[] = [
  {
    id: 'rev_001',
    expertId: 'exp_001',
    author: {
      name: 'Michael R.',
      title: 'CEO, TechStartup',
    },
    rating: 5,
    content: "Sarah's insights on our AI product strategy were invaluable. She helped us avoid months of wasted effort by identifying a critical flaw in our approach. Highly recommend.",
    date: '2024-01-15',
    helpful: 24,
  },
  {
    id: 'rev_002',
    expertId: 'exp_001',
    author: {
      name: 'Jessica L.',
      title: 'Product Manager',
    },
    rating: 5,
    content: 'I came to Sarah with a specific challenge around ML product prioritization. She provided a clear framework and actionable next steps within our 60-minute session.',
    date: '2024-01-10',
    helpful: 18,
  },
  {
    id: 'rev_003',
    expertId: 'exp_002',
    author: {
      name: 'David K.',
      title: 'Founder & CEO',
    },
    rating: 5,
    content: 'James helped us structure our Series B fundraise perfectly. His experience from the other side of the table was incredibly valuable.',
    date: '2024-01-12',
    helpful: 31,
  },
  {
    id: 'rev_004',
    expertId: 'exp_003',
    author: {
      name: 'Sarah M.',
      title: 'VP Marketing',
    },
    rating: 5,
    content: "Maria's growth playbook transformed our marketing strategy. We saw 3x improvement in CAC within two months of implementing her recommendations.",
    date: '2024-01-08',
    helpful: 27,
  },
  {
    id: 'rev_005',
    expertId: 'exp_004',
    author: {
      name: 'Tom H.',
      title: 'Startup Founder',
    },
    rating: 5,
    content: "David's legal guidance on our equity structure was exactly what we needed. He explained complex concepts in a way that was easy to understand.",
    date: '2024-01-05',
    helpful: 19,
  },
  {
    id: 'rev_006',
    expertId: 'exp_005',
    author: {
      name: 'Lisa C.',
      title: 'COO',
    },
    rating: 5,
    content: "Amanda helped us redesign our ops team structure as we scaled from 50 to 200 people. Her Stripe experience was directly applicable.",
    date: '2024-01-03',
    helpful: 22,
  },
  {
    id: 'rev_007',
    expertId: 'exp_007',
    author: {
      name: 'Mark T.',
      title: 'Sales Director',
    },
    rating: 5,
    content: "Jennifer's enterprise sales playbook was a game-changer. She helped us identify gaps in our process that we'd been blind to for months.",
    date: '2024-01-11',
    helpful: 35,
  },
  {
    id: 'rev_008',
    expertId: 'exp_008',
    author: {
      name: 'Alex P.',
      title: 'CTO',
    },
    rating: 5,
    content: "Michael's advice on scaling our engineering team was invaluable. His fintech experience was directly relevant to our challenges.",
    date: '2024-01-09',
    helpful: 28,
  },
  {
    id: 'rev_009',
    expertId: 'exp_015',
    author: {
      name: 'Emily W.',
      title: 'Founder',
    },
    rating: 5,
    content: "Nicole reviewed our pitch deck and completely transformed our narrative. We closed our round 3 weeks later. Worth every penny.",
    date: '2024-01-14',
    helpful: 42,
  },
  {
    id: 'rev_010',
    expertId: 'exp_015',
    author: {
      name: 'Chris B.',
      title: 'CEO',
    },
    rating: 5,
    content: "Having someone who's been both a founder and a VC is invaluable. Nicole knew exactly what questions investors would ask.",
    date: '2024-01-07',
    helpful: 38,
  },
]

export function getReviewsByExpertId(expertId: string): Review[] {
  return reviews.filter((review) => review.expertId === expertId)
}

export function getRecentReviews(limit = 5): Review[] {
  return reviews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}
