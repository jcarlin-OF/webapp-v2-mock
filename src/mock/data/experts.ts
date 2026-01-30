import type { Expert, ProfileStatus, ClearanceLevel } from '@/types'
import { addDays, format, subHours, subDays } from 'date-fns'

// Simple seeded random number generator for deterministic results
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// Helper to generate deterministic availability based on expert index
function generateAvailability(expertIndex: number): Expert['availability'] {
  const slots = []
  // Use a fixed base date to avoid server/client mismatch
  const baseDate = new Date('2026-01-29T00:00:00.000Z')
  const random = seededRandom(expertIndex * 1000 + 42)

  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = addDays(baseDate, dayOffset)
    const dateStr = format(date, 'yyyy-MM-dd')

    // Skip some days based on seeded random for realism
    if (random() > 0.7) continue

    // Morning slots
    if (random() > 0.3) {
      slots.push({
        date: dateStr,
        startTime: '09:00',
        endTime: '09:30',
        available: true,
      })
      slots.push({
        date: dateStr,
        startTime: '10:00',
        endTime: '10:30',
        available: true,
      })
    }

    // Afternoon slots
    if (random() > 0.4) {
      slots.push({
        date: dateStr,
        startTime: '14:00',
        endTime: '14:30',
        available: true,
      })
      slots.push({
        date: dateStr,
        startTime: '15:00',
        endTime: '15:30',
        available: true,
      })
    }

    // Evening slots
    if (random() > 0.5) {
      slots.push({
        date: dateStr,
        startTime: '17:00',
        endTime: '17:30',
        available: true,
      })
    }
  }

  return {
    nextAvailable: slots.length > 0 ? slots[0].date : null,
    slots,
  }
}

// Helper to generate profile status fields based on expert index
function generateProfileStatus(expertIndex: number): {
  profileStatus: ProfileStatus
  claimedAt?: string
  responseTime?: number
  lastActiveAt?: string
  completedConsultations: number
  clearanceLevel?: ClearanceLevel
  clearanceVerified?: boolean
} {
  const random = seededRandom(expertIndex * 500 + 123)
  const now = new Date('2026-01-30T12:00:00.000Z')

  // Most experts are claimed, a few are unclaimed or pending
  let profileStatus: ProfileStatus = 'claimed'
  if (expertIndex === 12) profileStatus = 'unclaimed'
  if (expertIndex === 14) profileStatus = 'pending'

  // Response time varies: 30 min to 8 hours (in minutes)
  const responseTimes = [30, 45, 60, 90, 120, 180, 240, 360, 480]
  const responseTime = responseTimes[Math.floor(random() * responseTimes.length)]

  // Last active: within last few hours to last few days
  const hoursAgo = Math.floor(random() * 72) // 0-72 hours ago
  const lastActiveAt = subHours(now, hoursAgo).toISOString()

  // Claimed date: 3-18 months ago
  const claimedMonthsAgo = 3 + Math.floor(random() * 15)
  const claimedAt = profileStatus === 'claimed'
    ? subDays(now, claimedMonthsAgo * 30).toISOString()
    : undefined

  // Completed consultations: based on review count with some variance
  const baseConsultations = 10 + Math.floor(random() * 150)
  const completedConsultations = profileStatus === 'unclaimed' ? 0 : baseConsultations

  // Clearance levels - some experts have gov-con related clearances
  // Assign clearances to specific experts that fit the gov-con profile
  let clearanceLevel: ClearanceLevel | undefined
  let clearanceVerified: boolean | undefined

  // Alex Petrov (exp_010) - Cybersecurity expert - TS/SCI
  if (expertIndex === 9) {
    clearanceLevel = 'ts-sci'
    clearanceVerified = true
  }
  // Michael Chang (exp_008) - Fintech engineering - Secret
  else if (expertIndex === 7) {
    clearanceLevel = 'secret'
    clearanceVerified = true
  }
  // David Kim (exp_004) - M&A Law - Public Trust
  else if (expertIndex === 3) {
    clearanceLevel = 'public-trust'
    clearanceVerified = false
  }
  // Rachel Green (exp_013) - Healthcare Strategy - Secret (HIPAA related)
  else if (expertIndex === 12) {
    clearanceLevel = 'secret'
    clearanceVerified = false
  }
  // Sarah Chen (exp_001) - AI/ML Product - Top Secret
  else if (expertIndex === 0) {
    clearanceLevel = 'top-secret'
    clearanceVerified = true
  }

  return {
    profileStatus,
    claimedAt,
    responseTime,
    lastActiveAt,
    completedConsultations,
    clearanceLevel,
    clearanceVerified,
  }
}

export const experts: Expert[] = [
  {
    id: 'exp_001',
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    headline: 'Former Google Product Director | AI & Machine Learning Strategy',
    bio: `Sarah brings 15+ years of experience in product development at top technology companies. As a former Product Director at Google, she led teams responsible for launching AI-powered features used by billions of users.

She specializes in helping companies:
- Define and execute AI/ML product strategies
- Build and scale product organizations
- Navigate technical product decisions
- Prepare for leadership roles in tech

Sarah holds an MBA from Stanford GSB and a BS in Computer Science from MIT. She's advised over 100 companies ranging from early-stage startups to Fortune 500 enterprises.`,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    verified: true,
    rating: 4.97,
    reviewCount: 156,
    categories: ['technology', 'strategy'],
    expertise: ['Product Strategy', 'AI/ML Products', 'Team Leadership', 'Go-to-Market', 'Startup Advisory'],
    languages: ['English', 'Mandarin'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_001_30',
        name: 'Quick Consultation',
        duration: 30,
        price: 25000, // $250
        description: 'Focused discussion on a specific challenge or question',
      },
      {
        id: 'svc_001_60',
        name: 'Deep Dive Session',
        duration: 60,
        price: 45000, // $450
        description: 'Comprehensive strategy session with actionable recommendations',
      },
    ],
    availability: generateAvailability(0),
    credentials: [
      {
        type: 'experience',
        title: 'Product Director',
        organization: 'Google',
        year: 2023,
        description: 'Led AI/ML product initiatives',
      },
      {
        type: 'experience',
        title: 'Senior Product Manager',
        organization: 'Meta',
        year: 2018,
      },
      {
        type: 'education',
        title: 'MBA',
        organization: 'Stanford GSB',
        year: 2014,
      },
      {
        type: 'education',
        title: 'BS Computer Science',
        organization: 'MIT',
        year: 2010,
      },
    ],
    featuredReview: {
      id: 'rev_001',
      expertId: 'exp_001',
      author: {
        name: 'Michael R.',
        title: 'CEO, TechStartup',
      },
      rating: 5,
      content: 'Sarah\'s insights on our AI product strategy were invaluable. She helped us avoid months of wasted effort by identifying a critical flaw in our approach. Highly recommend.',
      date: '2024-01-15',
      helpful: 24,
    },
    ...generateProfileStatus(0),
  },
  {
    id: 'exp_002',
    slug: 'james-morrison',
    name: 'James Morrison',
    headline: 'Ex-Goldman Sachs MD | Investment Banking & Capital Markets Expert',
    bio: `With 20+ years on Wall Street, including 12 years as Managing Director at Goldman Sachs, I provide strategic guidance on capital markets, M&A, and financial strategy.

I help clients with:
- Fundraising strategy and investor positioning
- M&A preparation and negotiations
- IPO readiness and capital structure optimization
- Financial modeling and valuation
- Board-level financial strategy

I've executed over $50 billion in transactions across technology, healthcare, and consumer sectors. Currently serving as an advisor to several growth-stage companies and PE firms.`,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    verified: true,
    rating: 4.92,
    reviewCount: 89,
    categories: ['finance', 'strategy'],
    expertise: ['M&A Advisory', 'Fundraising', 'IPO Strategy', 'Valuation', 'Capital Markets'],
    languages: ['English'],
    timezone: 'America/New_York',
    services: [
      {
        id: 'svc_002_30',
        name: 'Quick Consultation',
        duration: 30,
        price: 35000,
        description: 'Targeted advice on specific financial questions',
      },
      {
        id: 'svc_002_60',
        name: 'Strategy Session',
        duration: 60,
        price: 60000,
        description: 'In-depth financial strategy and transaction advisory',
      },
    ],
    availability: generateAvailability(1),
    credentials: [
      {
        type: 'experience',
        title: 'Managing Director',
        organization: 'Goldman Sachs',
        year: 2022,
      },
      {
        type: 'experience',
        title: 'Vice President',
        organization: 'Morgan Stanley',
        year: 2010,
      },
      {
        type: 'education',
        title: 'MBA, Finance',
        organization: 'Wharton School',
        year: 2005,
      },
      {
        type: 'certification',
        title: 'CFA Charterholder',
        organization: 'CFA Institute',
        year: 2007,
      },
    ],
    ...generateProfileStatus(1),
  },
  {
    id: 'exp_003',
    slug: 'maria-rodriguez',
    name: 'Maria Rodriguez',
    headline: 'CMO & Growth Expert | Built Marketing Teams at Uber, Airbnb',
    bio: `I'm a hands-on marketing leader who's helped scale some of the most recognizable consumer brands. As former VP of Marketing at Uber and Head of Growth at Airbnb, I've driven billions in revenue through data-driven marketing strategies.

My areas of expertise include:
- Growth strategy and customer acquisition
- Brand building and positioning
- Marketing team structure and hiring
- Performance marketing optimization
- Market expansion and localization

I love working with ambitious founders who are ready to accelerate their growth journey.`,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    verified: true,
    rating: 4.89,
    reviewCount: 112,
    categories: ['marketing', 'strategy'],
    expertise: ['Growth Marketing', 'Brand Strategy', 'Customer Acquisition', 'Team Building', 'Performance Marketing'],
    languages: ['English', 'Spanish'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_003_30',
        name: 'Growth Check-in',
        duration: 30,
        price: 20000,
        description: 'Quick strategy check or specific marketing question',
      },
      {
        id: 'svc_003_60',
        name: 'Growth Strategy Session',
        duration: 60,
        price: 35000,
        description: 'Comprehensive marketing and growth strategy discussion',
      },
    ],
    availability: generateAvailability(2),
    credentials: [
      {
        type: 'experience',
        title: 'VP of Marketing',
        organization: 'Uber',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Head of Growth',
        organization: 'Airbnb',
        year: 2019,
      },
      {
        type: 'education',
        title: 'MBA',
        organization: 'Harvard Business School',
        year: 2012,
      },
    ],
    ...generateProfileStatus(2),
  },
  {
    id: 'exp_004',
    slug: 'david-kim',
    name: 'David Kim',
    headline: 'Former Partner at Kirkland & Ellis | M&A and Corporate Law',
    bio: `As a former partner at Kirkland & Ellis, one of the world's largest law firms, I bring deep expertise in complex transactions and corporate governance.

I advise on:
- M&A transaction structuring and negotiation
- Corporate governance best practices
- Founder equity and compensation structures
- Regulatory compliance and risk management
- Board formation and fiduciary duties

I've closed hundreds of deals totaling over $30 billion and now dedicate my time to helping entrepreneurs navigate the legal complexities of building and scaling businesses.`,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    verified: true,
    rating: 4.95,
    reviewCount: 67,
    categories: ['legal', 'strategy'],
    expertise: ['M&A Law', 'Corporate Governance', 'Startup Legal', 'Equity Structures', 'Regulatory Compliance'],
    languages: ['English', 'Korean'],
    timezone: 'America/New_York',
    services: [
      {
        id: 'svc_004_30',
        name: 'Legal Consultation',
        duration: 30,
        price: 30000,
        description: 'Quick legal guidance on specific questions',
      },
      {
        id: 'svc_004_60',
        name: 'Deep Dive Legal Review',
        duration: 60,
        price: 55000,
        description: 'Comprehensive legal strategy session',
      },
    ],
    availability: generateAvailability(3),
    credentials: [
      {
        type: 'experience',
        title: 'Partner',
        organization: 'Kirkland & Ellis',
        year: 2022,
      },
      {
        type: 'education',
        title: 'JD',
        organization: 'Yale Law School',
        year: 2008,
      },
      {
        type: 'certification',
        title: 'Bar Admission',
        organization: 'New York State Bar',
        year: 2008,
      },
    ],
    ...generateProfileStatus(3),
  },
  {
    id: 'exp_005',
    slug: 'amanda-foster',
    name: 'Amanda Foster',
    headline: 'COO & Operations Expert | Scaled Operations at Stripe, Square',
    bio: `I've spent my career building and optimizing operations at high-growth technology companies. Most recently, I served as VP of Operations at Stripe, where I helped scale the team from 500 to 4,000 employees.

I specialize in:
- Operational excellence and process optimization
- Scaling teams and organizational design
- Vendor management and procurement strategy
- Customer success and support operations
- International expansion logistics

I'm passionate about helping founders build the operational infrastructure needed to support rapid growth.`,
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
    verified: true,
    rating: 4.88,
    reviewCount: 94,
    categories: ['operations', 'strategy'],
    expertise: ['Operations Strategy', 'Team Scaling', 'Process Optimization', 'International Expansion', 'Customer Operations'],
    languages: ['English'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_005_30',
        name: 'Ops Check-in',
        duration: 30,
        price: 18000,
        description: 'Quick operational guidance or specific question',
      },
      {
        id: 'svc_005_60',
        name: 'Operations Strategy Session',
        duration: 60,
        price: 32000,
        description: 'In-depth operational planning and optimization',
      },
    ],
    availability: generateAvailability(4),
    credentials: [
      {
        type: 'experience',
        title: 'VP of Operations',
        organization: 'Stripe',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Operations',
        organization: 'Square',
        year: 2018,
      },
      {
        type: 'education',
        title: 'MBA',
        organization: 'Kellogg School of Management',
        year: 2013,
      },
    ],
    ...generateProfileStatus(4),
  },
  {
    id: 'exp_006',
    slug: 'robert-williams',
    name: 'Robert Williams',
    headline: 'CHRO & People Leader | Built HR at Netflix, Salesforce',
    bio: `I've led people operations at some of the world's most admired companies, including Netflix and Salesforce. I'm known for building high-performance cultures that attract and retain top talent.

Areas I can help with:
- HR strategy and organizational design
- Compensation and equity structures
- Performance management systems
- Hiring and recruiting strategies
- Culture building and employee engagement

I believe that people are every company's greatest competitive advantage, and I love helping founders build exceptional teams.`,
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    verified: true,
    rating: 4.91,
    reviewCount: 78,
    categories: ['hr', 'strategy'],
    expertise: ['HR Strategy', 'Compensation Design', 'Culture Building', 'Talent Acquisition', 'Performance Management'],
    languages: ['English'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_006_30',
        name: 'HR Quick Consult',
        duration: 30,
        price: 17500,
        description: 'Quick HR guidance or specific people question',
      },
      {
        id: 'svc_006_60',
        name: 'People Strategy Session',
        duration: 60,
        price: 30000,
        description: 'Comprehensive HR and organizational strategy',
      },
    ],
    availability: generateAvailability(5),
    credentials: [
      {
        type: 'experience',
        title: 'VP of People',
        organization: 'Netflix',
        year: 2022,
      },
      {
        type: 'experience',
        title: 'Director of HR',
        organization: 'Salesforce',
        year: 2017,
      },
      {
        type: 'education',
        title: 'MA Industrial Psychology',
        organization: 'Columbia University',
        year: 2009,
      },
    ],
    ...generateProfileStatus(5),
  },
  {
    id: 'exp_007',
    slug: 'jennifer-taylor',
    name: 'Jennifer Taylor',
    headline: 'VP Sales | Built Enterprise Sales Teams at Slack, Dropbox',
    bio: `I've built and led enterprise sales organizations that have generated billions in revenue. At Slack, I grew the enterprise sales team from 10 to 200+ reps while achieving 150%+ quota attainment.

I help companies with:
- Sales strategy and go-to-market planning
- Sales team structure and hiring
- Enterprise sales playbooks and processes
- Sales compensation design
- Revenue forecasting and metrics

My approach combines data-driven methodology with a deep understanding of what motivates sales teams to succeed.`,
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    verified: true,
    rating: 4.86,
    reviewCount: 103,
    categories: ['sales', 'strategy'],
    expertise: ['Enterprise Sales', 'Sales Leadership', 'Go-to-Market', 'Sales Compensation', 'Revenue Operations'],
    languages: ['English'],
    timezone: 'America/New_York',
    services: [
      {
        id: 'svc_007_30',
        name: 'Sales Check-in',
        duration: 30,
        price: 20000,
        description: 'Quick sales strategy or specific question',
      },
      {
        id: 'svc_007_60',
        name: 'Sales Strategy Session',
        duration: 60,
        price: 37500,
        description: 'Comprehensive sales strategy and team building',
      },
    ],
    availability: generateAvailability(6),
    credentials: [
      {
        type: 'experience',
        title: 'VP of Enterprise Sales',
        organization: 'Slack',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Sales',
        organization: 'Dropbox',
        year: 2018,
      },
      {
        type: 'education',
        title: 'BA Economics',
        organization: 'Duke University',
        year: 2008,
      },
    ],
    ...generateProfileStatus(6),
  },
  {
    id: 'exp_008',
    slug: 'michael-chang',
    name: 'Michael Chang',
    headline: 'CTO & Engineering Leader | Built Engineering at Coinbase, Robinhood',
    bio: `I'm a technical leader who's built and scaled engineering organizations at some of fintech's most successful companies. At Coinbase, I grew the engineering team from 50 to 500+ engineers while maintaining technical excellence.

I advise on:
- Engineering team building and culture
- Technical architecture and scalability
- Security and compliance for fintech
- Engineering hiring and career ladders
- Technical due diligence

I'm particularly passionate about helping technical founders navigate the challenges of scaling their engineering organizations.`,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    verified: true,
    rating: 4.94,
    reviewCount: 131,
    categories: ['technology', 'strategy'],
    expertise: ['Engineering Leadership', 'Technical Architecture', 'Fintech Engineering', 'Team Scaling', 'Security'],
    languages: ['English', 'Mandarin'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_008_30',
        name: 'Technical Consultation',
        duration: 30,
        price: 22500,
        description: 'Quick technical guidance or specific question',
      },
      {
        id: 'svc_008_60',
        name: 'Engineering Strategy Session',
        duration: 60,
        price: 40000,
        description: 'Comprehensive engineering strategy and architecture review',
      },
    ],
    availability: generateAvailability(7),
    credentials: [
      {
        type: 'experience',
        title: 'VP of Engineering',
        organization: 'Coinbase',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Engineering Director',
        organization: 'Robinhood',
        year: 2019,
      },
      {
        type: 'education',
        title: 'MS Computer Science',
        organization: 'Carnegie Mellon',
        year: 2011,
      },
    ],
    ...generateProfileStatus(7),
  },
  {
    id: 'exp_009',
    slug: 'lisa-johnson',
    name: 'Lisa Johnson',
    headline: 'CFO & Finance Executive | IPO Experience at DoorDash, Lyft',
    bio: `As a finance executive who's helped take multiple companies public, I bring deep expertise in financial strategy, investor relations, and public company readiness.

I help companies with:
- Financial planning and analysis
- IPO preparation and execution
- Investor relations strategy
- Board and audit committee best practices
- Financial systems and reporting

I've raised over $5 billion in capital and completed two successful IPOs. I'm passionate about helping founders build world-class finance functions.`,
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    verified: true,
    rating: 4.93,
    reviewCount: 72,
    categories: ['finance', 'strategy'],
    expertise: ['CFO Advisory', 'IPO Preparation', 'Financial Planning', 'Investor Relations', 'Public Company Finance'],
    languages: ['English'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_009_30',
        name: 'Finance Consultation',
        duration: 30,
        price: 27500,
        description: 'Quick finance guidance or specific question',
      },
      {
        id: 'svc_009_60',
        name: 'CFO Strategy Session',
        duration: 60,
        price: 50000,
        description: 'Comprehensive financial strategy and planning',
      },
    ],
    availability: generateAvailability(8),
    credentials: [
      {
        type: 'experience',
        title: 'CFO',
        organization: 'DoorDash',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'VP Finance',
        organization: 'Lyft',
        year: 2018,
      },
      {
        type: 'education',
        title: 'MBA',
        organization: 'Chicago Booth',
        year: 2010,
      },
      {
        type: 'certification',
        title: 'CPA',
        organization: 'California Board of Accountancy',
        year: 2006,
      },
    ],
    ...generateProfileStatus(8),
  },
  {
    id: 'exp_010',
    slug: 'alex-petrov',
    name: 'Alex Petrov',
    headline: 'Cybersecurity Expert | Former CISO at PayPal, Meta',
    bio: `With 20+ years in cybersecurity, including CISO roles at PayPal and Meta, I help companies build robust security programs that protect their customers and business.

My expertise includes:
- Security strategy and program development
- Risk assessment and management
- Security compliance (SOC 2, PCI, GDPR)
- Incident response planning
- Security team building

I've protected some of the world's largest platforms and now focus on helping growth-stage companies build security programs that scale.`,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    verified: true,
    rating: 4.96,
    reviewCount: 58,
    categories: ['technology', 'operations'],
    expertise: ['Cybersecurity', 'Risk Management', 'Compliance', 'Incident Response', 'Security Architecture'],
    languages: ['English', 'Russian'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_010_30',
        name: 'Security Consultation',
        duration: 30,
        price: 30000,
        description: 'Quick security guidance or specific question',
      },
      {
        id: 'svc_010_60',
        name: 'Security Strategy Session',
        duration: 60,
        price: 55000,
        description: 'Comprehensive security assessment and planning',
      },
    ],
    availability: generateAvailability(9),
    credentials: [
      {
        type: 'experience',
        title: 'CISO',
        organization: 'PayPal',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Security',
        organization: 'Meta',
        year: 2018,
      },
      {
        type: 'certification',
        title: 'CISSP',
        organization: 'ISC2',
        year: 2008,
      },
    ],
    ...generateProfileStatus(9),
  },
  {
    id: 'exp_011',
    slug: 'emma-watson',
    name: 'Emma Watson',
    headline: 'Brand Strategy Expert | Former Global Brand Director at Nike',
    bio: `I've built some of the world's most iconic brands over my 18-year career in brand strategy. At Nike, I led global brand initiatives that drove double-digit revenue growth.

I help companies with:
- Brand strategy and positioning
- Brand architecture and portfolio management
- Visual identity and design direction
- Brand launch and rebranding
- Consumer insights and research

I believe that a strong brand is a company's most valuable asset, and I love helping founders build brands that resonate deeply with their customers.`,
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    verified: true,
    rating: 4.87,
    reviewCount: 96,
    categories: ['marketing', 'strategy'],
    expertise: ['Brand Strategy', 'Visual Identity', 'Consumer Insights', 'Brand Architecture', 'Creative Direction'],
    languages: ['English', 'French'],
    timezone: 'Europe/London',
    services: [
      {
        id: 'svc_011_30',
        name: 'Brand Consultation',
        duration: 30,
        price: 19000,
        description: 'Quick brand guidance or specific question',
      },
      {
        id: 'svc_011_60',
        name: 'Brand Strategy Session',
        duration: 60,
        price: 35000,
        description: 'Comprehensive brand strategy and positioning',
      },
    ],
    availability: generateAvailability(10),
    credentials: [
      {
        type: 'experience',
        title: 'Global Brand Director',
        organization: 'Nike',
        year: 2022,
      },
      {
        type: 'experience',
        title: 'Brand Strategy Lead',
        organization: 'Apple',
        year: 2016,
      },
      {
        type: 'education',
        title: 'MA Brand Management',
        organization: 'London Business School',
        year: 2008,
      },
    ],
    ...generateProfileStatus(10),
  },
  {
    id: 'exp_012',
    slug: 'carlos-mendez',
    name: 'Carlos Mendez',
    headline: 'Supply Chain Expert | VP Supply Chain at Amazon, Walmart',
    bio: `I've spent my career optimizing supply chains at the world's largest retailers. At Amazon, I led supply chain operations for a $10B+ business unit.

My expertise includes:
- Supply chain strategy and optimization
- Logistics and fulfillment operations
- Inventory management and planning
- Vendor management and procurement
- Last-mile delivery innovation

I help companies build supply chains that are fast, reliable, and cost-effective.`,
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    verified: true,
    rating: 4.85,
    reviewCount: 64,
    categories: ['operations', 'strategy'],
    expertise: ['Supply Chain', 'Logistics', 'Fulfillment', 'Procurement', 'Inventory Management'],
    languages: ['English', 'Spanish'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_012_30',
        name: 'Supply Chain Consult',
        duration: 30,
        price: 20000,
        description: 'Quick supply chain guidance or specific question',
      },
      {
        id: 'svc_012_60',
        name: 'Operations Strategy Session',
        duration: 60,
        price: 37500,
        description: 'Comprehensive supply chain strategy and optimization',
      },
    ],
    availability: generateAvailability(11),
    credentials: [
      {
        type: 'experience',
        title: 'VP Supply Chain',
        organization: 'Amazon',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Logistics',
        organization: 'Walmart',
        year: 2017,
      },
      {
        type: 'education',
        title: 'MS Operations Research',
        organization: 'MIT',
        year: 2010,
      },
    ],
    ...generateProfileStatus(11),
  },
  {
    id: 'exp_013',
    slug: 'rachel-green',
    name: 'Rachel Green',
    headline: 'Healthcare Strategy Expert | Former McKinsey Partner',
    bio: `As a former Partner at McKinsey & Company, I spent 15 years advising healthcare organizations on strategy, operations, and transformation.

I help companies with:
- Healthcare market entry strategy
- Regulatory navigation (FDA, HIPAA)
- Healthcare business model design
- Digital health strategy
- Payer and provider partnerships

I'm passionate about healthcare innovation and helping companies improve patient outcomes through better technology and business models.`,
    avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
    verified: true,
    rating: 4.91,
    reviewCount: 81,
    categories: ['strategy', 'operations'],
    expertise: ['Healthcare Strategy', 'Regulatory Affairs', 'Digital Health', 'Market Entry', 'Business Model Design'],
    languages: ['English'],
    timezone: 'America/New_York',
    services: [
      {
        id: 'svc_013_30',
        name: 'Healthcare Consult',
        duration: 30,
        price: 27500,
        description: 'Quick healthcare strategy guidance',
      },
      {
        id: 'svc_013_60',
        name: 'Strategy Deep Dive',
        duration: 60,
        price: 50000,
        description: 'Comprehensive healthcare strategy session',
      },
    ],
    availability: generateAvailability(12),
    credentials: [
      {
        type: 'experience',
        title: 'Partner',
        organization: 'McKinsey & Company',
        year: 2023,
      },
      {
        type: 'education',
        title: 'MD/MBA',
        organization: 'Johns Hopkins',
        year: 2010,
      },
    ],
    ...generateProfileStatus(12),
  },
  {
    id: 'exp_014',
    slug: 'tom-harris',
    name: 'Tom Harris',
    headline: 'Data Science Leader | Head of Data at Spotify, Twitter',
    bio: `I've built and led data science teams at consumer technology companies, using data to drive product decisions and business growth.

My expertise includes:
- Data strategy and organization building
- Machine learning and AI implementation
- Analytics infrastructure and tooling
- Experimentation and A/B testing
- Data-driven product development

I help companies leverage their data as a strategic asset.`,
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    verified: true,
    rating: 4.89,
    reviewCount: 107,
    categories: ['technology', 'strategy'],
    expertise: ['Data Science', 'Machine Learning', 'Analytics', 'Experimentation', 'Data Infrastructure'],
    languages: ['English'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_014_30',
        name: 'Data Consultation',
        duration: 30,
        price: 22500,
        description: 'Quick data science guidance or specific question',
      },
      {
        id: 'svc_014_60',
        name: 'Data Strategy Session',
        duration: 60,
        price: 40000,
        description: 'Comprehensive data strategy and implementation planning',
      },
    ],
    availability: generateAvailability(13),
    credentials: [
      {
        type: 'experience',
        title: 'Head of Data Science',
        organization: 'Spotify',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Data',
        organization: 'Twitter',
        year: 2018,
      },
      {
        type: 'education',
        title: 'PhD Statistics',
        organization: 'UC Berkeley',
        year: 2012,
      },
    ],
    ...generateProfileStatus(13),
  },
  {
    id: 'exp_015',
    slug: 'nicole-brown',
    name: 'Nicole Brown',
    headline: 'Startup Fundraising Expert | 50+ Successful Raises, $2B+ Deployed',
    bio: `I've been on both sides of the fundraising table - as a founder who raised $100M+ and as a VC who deployed over $2B. I know exactly what investors are looking for.

I help founders with:
- Fundraising strategy and positioning
- Pitch deck creation and storytelling
- Investor targeting and outreach
- Term sheet negotiation
- Founder-investor relationship management

My approach is tactical and practical, focused on getting you to your next milestone.`,
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    verified: true,
    rating: 4.95,
    reviewCount: 143,
    categories: ['finance', 'strategy'],
    expertise: ['Fundraising', 'Pitch Coaching', 'Investor Relations', 'Term Negotiation', 'VC Strategy'],
    languages: ['English'],
    timezone: 'America/New_York',
    services: [
      {
        id: 'svc_015_30',
        name: 'Pitch Review',
        duration: 30,
        price: 20000,
        description: 'Quick pitch deck review and feedback',
      },
      {
        id: 'svc_015_60',
        name: 'Fundraising Strategy',
        duration: 60,
        price: 37500,
        description: 'Comprehensive fundraising strategy session',
      },
    ],
    availability: generateAvailability(14),
    credentials: [
      {
        type: 'experience',
        title: 'Partner',
        organization: 'Sequoia Capital',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Founder & CEO',
        organization: 'TechStartup (Acquired)',
        year: 2018,
      },
      {
        type: 'education',
        title: 'MBA',
        organization: 'Harvard Business School',
        year: 2012,
      },
    ],
    ...generateProfileStatus(14),
  },
  {
    id: 'exp_016',
    slug: 'daniel-smith',
    name: 'Daniel Smith',
    headline: 'Product Design Leader | VP Design at Figma, Pinterest',
    bio: `I've led design teams at companies that set the standard for consumer product experiences. At Figma, I helped build the design system and team that powers millions of designers.

I help companies with:
- Design strategy and vision
- Design team building and culture
- Design systems and scalability
- User research and usability
- Product-design collaboration

I believe great design is a competitive advantage, and I love helping founders build design-driven organizations.`,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    verified: true,
    rating: 4.92,
    reviewCount: 88,
    categories: ['technology', 'strategy'],
    expertise: ['Product Design', 'Design Systems', 'User Research', 'Design Leadership', 'UX Strategy'],
    languages: ['English'],
    timezone: 'America/Los_Angeles',
    services: [
      {
        id: 'svc_016_30',
        name: 'Design Consultation',
        duration: 30,
        price: 19000,
        description: 'Quick design guidance or specific question',
      },
      {
        id: 'svc_016_60',
        name: 'Design Strategy Session',
        duration: 60,
        price: 35000,
        description: 'Comprehensive design strategy and team planning',
      },
    ],
    availability: generateAvailability(15),
    credentials: [
      {
        type: 'experience',
        title: 'VP of Design',
        organization: 'Figma',
        year: 2023,
      },
      {
        type: 'experience',
        title: 'Director of Design',
        organization: 'Pinterest',
        year: 2018,
      },
      {
        type: 'education',
        title: 'MFA Design',
        organization: 'Rhode Island School of Design',
        year: 2010,
      },
    ],
    ...generateProfileStatus(15),
  },
]

export function getExpertBySlug(slug: string): Expert | undefined {
  return experts.find((expert) => expert.slug === slug)
}

export function getExpertById(id: string): Expert | undefined {
  return experts.find((expert) => expert.id === id)
}

export function getFeaturedExperts(limit = 6): Expert[] {
  return experts
    .filter((expert) => expert.rating >= 4.9)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

export function searchExperts(query: string): Expert[] {
  const lowercaseQuery = query.toLowerCase()
  return experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(lowercaseQuery) ||
      expert.headline.toLowerCase().includes(lowercaseQuery) ||
      expert.expertise.some((e) => e.toLowerCase().includes(lowercaseQuery)) ||
      expert.categories.some((c) => c.toLowerCase().includes(lowercaseQuery))
  )
}

export function filterExperts(filters: {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  languages?: string[]
  availableNext7Days?: boolean
  profileStatus?: ProfileStatus
  clearanceLevel?: ClearanceLevel
  claimedOnly?: boolean
}): Expert[] {
  return experts.filter((expert) => {
    // Category filter
    if (filters.category && !expert.categories.includes(filters.category)) {
      return false
    }

    // Price filter (check minimum service price)
    const minServicePrice = Math.min(...expert.services.map((s) => s.price))
    if (filters.minPrice && minServicePrice < filters.minPrice) {
      return false
    }
    if (filters.maxPrice && minServicePrice > filters.maxPrice) {
      return false
    }

    // Rating filter
    if (filters.minRating && expert.rating < filters.minRating) {
      return false
    }

    // Language filter
    if (
      filters.languages &&
      filters.languages.length > 0 &&
      !filters.languages.some((lang) => expert.languages.includes(lang))
    ) {
      return false
    }

    // Availability filter
    if (filters.availableNext7Days && !expert.availability.nextAvailable) {
      return false
    }

    // Profile status filter
    if (filters.profileStatus && expert.profileStatus !== filters.profileStatus) {
      return false
    }

    // Claimed only filter (excludes unclaimed and pending)
    if (filters.claimedOnly && expert.profileStatus !== 'claimed') {
      return false
    }

    // Clearance level filter
    if (filters.clearanceLevel && expert.clearanceLevel !== filters.clearanceLevel) {
      return false
    }

    return true
  })
}

// Get experts with specific clearance level or higher
export function getExpertsWithClearance(minLevel: ClearanceLevel): Expert[] {
  const levelOrder: ClearanceLevel[] = ['none', 'public-trust', 'secret', 'top-secret', 'ts-sci']
  const minIndex = levelOrder.indexOf(minLevel)

  return experts.filter((expert) => {
    if (!expert.clearanceLevel) return false
    const expertIndex = levelOrder.indexOf(expert.clearanceLevel)
    return expertIndex >= minIndex
  })
}

// Get claimed experts only (for public-facing searches)
export function getClaimedExperts(): Expert[] {
  return experts.filter((expert) => expert.profileStatus === 'claimed')
}
