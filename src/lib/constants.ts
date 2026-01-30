// App constants
export const APP_NAME = 'OnFrontiers'
export const APP_DESCRIPTION = 'Connect with world-class experts for personalized consultations'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Pricing
export const PLATFORM_FEE_PERCENT = 25 // 25% service fee
export const MIN_SESSION_PRICE = 5000 // $50 minimum
export const MAX_SESSION_PRICE = 100000 // $1000 maximum

// Session durations
export const SESSION_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
] as const

// Categories
export const CATEGORIES = [
  { id: 'technology', name: 'Technology', slug: 'technology', icon: 'Laptop' },
  { id: 'finance', name: 'Finance', slug: 'finance', icon: 'TrendingUp' },
  { id: 'marketing', name: 'Marketing', slug: 'marketing', icon: 'Megaphone' },
  { id: 'legal', name: 'Legal', slug: 'legal', icon: 'Scale' },
  { id: 'strategy', name: 'Strategy', slug: 'strategy', icon: 'Target' },
  { id: 'operations', name: 'Operations', slug: 'operations', icon: 'Settings' },
  { id: 'hr', name: 'HR & Talent', slug: 'hr', icon: 'Users' },
  { id: 'sales', name: 'Sales', slug: 'sales', icon: 'Handshake' },
] as const

// Languages
export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Portuguese',
  'Arabic',
  'Hindi',
  'Korean',
] as const

// Timezones (common ones)
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
] as const

// Navigation
export const NAV_ITEMS = [
  { label: 'Find Experts', href: '/experts' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
] as const

export const FOOTER_LINKS = {
  product: [
    { label: 'Find Experts', href: '/experts' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'For Experts', href: '/become-expert' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Trust & Safety', href: '/trust-and-safety' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
} as const

// Social links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/onfrontiers',
  linkedin: 'https://linkedin.com/company/onfrontiers',
  facebook: 'https://facebook.com/onfrontiers',
} as const
