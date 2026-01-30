export const AI_MATCH_CONFIG = {
  MAX_MESSAGES_PER_SESSION: 20,
  MAX_MESSAGE_LENGTH: 10000,
  MIN_MESSAGE_LENGTH: 10,
  TYPING_DELAY_MS: 50,
  TYPING_MIN_DURATION_MS: 500,
  TYPING_MAX_DURATION_MS: 2000,
  MAX_RECOMMENDATIONS: 5,
  SESSION_STORAGE_KEY: 'ai-match-session',
} as const

export const EXAMPLE_PROMPTS = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Assessment',
    description: 'FedRAMP, NIST 800-53, Zero Trust',
    prompt: `We need experts for a federal cybersecurity contract.
Requirements:
- FedRAMP Moderate authorization experience
- NIST 800-53 compliance knowledge
- Zero Trust architecture implementation
- 10+ years federal cybersecurity experience
- Active Secret clearance preferred`,
  },
  {
    id: 'it-modernization',
    title: 'IT Modernization',
    description: 'Legacy migration, cloud-native, DevSecOps',
    prompt: `Looking for consultants to support an IT modernization initiative for a DoD agency.
Key skills needed:
- Legacy system migration to cloud (AWS/Azure)
- Cloud-native architecture and microservices
- DevSecOps pipeline implementation
- Agile transformation experience
- NAICS: 541512`,
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Platform',
    description: 'Machine learning, big data, cleared analysts',
    prompt: `Building a data analytics platform for intelligence community.
Requirements:
- Machine learning and AI implementation
- Big data infrastructure (Hadoop, Spark)
- Data visualization and dashboarding
- TS/SCI clearance required
- Experience with classified data environments`,
  },
] as const

// Mapping domains to marketplace categories
export const DOMAIN_TO_CATEGORY: Record<string, string[]> = {
  cybersecurity: ['technology'],
  cloud: ['technology'],
  'data analytics': ['technology', 'strategy'],
  'machine learning': ['technology'],
  ai: ['technology'],
  finance: ['finance'],
  accounting: ['finance'],
  legal: ['legal'],
  compliance: ['legal', 'operations'],
  marketing: ['marketing'],
  strategy: ['strategy'],
  operations: ['operations'],
  hr: ['hr'],
  sales: ['sales'],
  procurement: ['operations'],
  'supply chain': ['operations'],
  healthcare: ['strategy', 'operations'],
}

// Keywords that indicate specific skill requirements
export const SKILL_KEYWORDS = [
  // Cybersecurity frameworks & standards
  'fedramp',
  'nist',
  'nist 800-53',
  'nist 800-171',
  'fisma',
  'cmmc',
  'zero trust',
  'soc 2',
  'pci',
  'hipaa',
  'gdpr',
  // Cloud & tech
  'aws',
  'azure',
  'gcp',
  'cloud',
  'devops',
  'devsecops',
  'kubernetes',
  'docker',
  'microservices',
  'api',
  // Data & AI
  'machine learning',
  'ai',
  'artificial intelligence',
  'data science',
  'big data',
  'hadoop',
  'spark',
  'python',
  'analytics',
  // Government specific
  'federal',
  'dod',
  'department of defense',
  'ic',
  'intelligence community',
  'government',
  'agency',
  // Business
  'm&a',
  'fundraising',
  'ipo',
  'product strategy',
  'go-to-market',
  'growth',
  'scaling',
]

// Clearance level keywords
export const CLEARANCE_KEYWORDS: Record<string, string> = {
  'ts/sci': 'Top Secret/SCI',
  'top secret/sci': 'Top Secret/SCI',
  'top secret': 'Top Secret',
  'ts': 'Top Secret',
  'secret': 'Secret',
  'public trust': 'Public Trust',
  'confidential': 'Confidential',
}

// Contract type keywords
export const CONTRACT_KEYWORDS: Record<string, string> = {
  'idiq': 'IDIQ',
  'ffp': 'Firm Fixed Price',
  'firm fixed price': 'Firm Fixed Price',
  't&m': 'Time & Materials',
  'time and materials': 'Time & Materials',
  'cost plus': 'Cost Plus',
  'bpa': 'Blanket Purchase Agreement',
  'gwac': 'GWAC',
}

// Experience level indicators
export const EXPERIENCE_INDICATORS = [
  { pattern: /(\d+)\+?\s*years?/i, extract: (match: RegExpMatchArray) => `${match[1]}+ years` },
  { pattern: /senior/i, extract: () => 'Senior level' },
  { pattern: /executive/i, extract: () => 'Executive level' },
  { pattern: /leadership/i, extract: () => 'Leadership experience' },
  { pattern: /principal/i, extract: () => 'Principal level' },
  { pattern: /director/i, extract: () => 'Director level' },
  { pattern: /vp|vice president/i, extract: () => 'VP level' },
  { pattern: /c-level|cto|cfo|ceo|ciso|coo/i, extract: () => 'C-level' },
]
