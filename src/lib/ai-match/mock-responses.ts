import type { Expert } from '@/types'
import type { ExtractedRequirements, ExpertRecommendation, ChatMessage } from './types'
import {
  DOMAIN_TO_CATEGORY,
  SKILL_KEYWORDS,
  CLEARANCE_KEYWORDS,
  CONTRACT_KEYWORDS,
  EXPERIENCE_INDICATORS,
  AI_MATCH_CONFIG,
} from './constants'
import { experts } from '@/mock/data/experts'

/**
 * Extract requirements from user message using keyword-based parsing
 */
export function extractRequirements(message: string): ExtractedRequirements {
  const lowerMessage = message.toLowerCase()
  const domains: string[] = []
  const skills: string[] = []
  const keywords: string[] = []
  let experienceLevel = ''
  let clearanceRequired: string | undefined
  let contractType: string | undefined
  const naicsCodes: string[] = []

  // Extract domains
  const domainPatterns: Record<string, RegExp[]> = {
    cybersecurity: [/cyber\s*security/i, /infosec/i, /information\s*security/i, /security\s*(assessment|audit|compliance)/i],
    cloud: [/\bcloud\b/i, /\baws\b/i, /\bazure\b/i, /\bgcp\b/i, /cloud\s*native/i],
    'data analytics': [/data\s*analytics/i, /big\s*data/i, /data\s*science/i, /analytics\s*platform/i],
    'machine learning': [/machine\s*learning/i, /\bml\b/i, /\bai\b/i, /artificial\s*intelligence/i],
    finance: [/financ/i, /accounting/i, /audit/i],
    legal: [/legal/i, /compliance/i, /regulatory/i],
    marketing: [/marketing/i, /brand/i, /growth\s*strategy/i],
    strategy: [/strategy/i, /consulting/i, /advisory/i],
    operations: [/operations/i, /supply\s*chain/i, /logistics/i, /procurement/i],
    hr: [/\bhr\b/i, /human\s*resources/i, /talent/i, /recruiting/i],
    sales: [/sales/i, /business\s*development/i, /revenue/i],
  }

  for (const [domain, patterns] of Object.entries(domainPatterns)) {
    if (patterns.some((pattern) => pattern.test(message))) {
      domains.push(domain)
    }
  }

  // Extract skills
  for (const skill of SKILL_KEYWORDS) {
    if (lowerMessage.includes(skill.toLowerCase())) {
      // Normalize skill name for display
      const normalizedSkill = skill
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      if (!skills.includes(normalizedSkill)) {
        skills.push(normalizedSkill)
      }
      keywords.push(skill)
    }
  }

  // Extract clearance level
  for (const [keyword, level] of Object.entries(CLEARANCE_KEYWORDS)) {
    if (lowerMessage.includes(keyword)) {
      clearanceRequired = level
      break
    }
  }

  // Extract contract type
  for (const [keyword, type] of Object.entries(CONTRACT_KEYWORDS)) {
    if (lowerMessage.includes(keyword)) {
      contractType = type
      break
    }
  }

  // Extract experience level
  for (const indicator of EXPERIENCE_INDICATORS) {
    const match = message.match(indicator.pattern)
    if (match) {
      experienceLevel = indicator.extract(match)
      break
    }
  }

  // Extract NAICS codes
  const naicsMatches = message.match(/\bnaics:?\s*(\d{6})/gi) || message.match(/\b(\d{6})\b/g)
  if (naicsMatches) {
    naicsMatches.forEach((match) => {
      const code = match.replace(/naics:?\s*/i, '').trim()
      if (code.length === 6 && !naicsCodes.includes(code)) {
        naicsCodes.push(code)
      }
    })
  }

  return {
    domains,
    skills,
    experienceLevel,
    clearanceRequired,
    contractType,
    naicsCodes: naicsCodes.length > 0 ? naicsCodes : undefined,
    keywords,
  }
}

/**
 * Score and match experts based on extracted requirements
 */
export function matchExperts(
  requirements: ExtractedRequirements,
  allExperts: Expert[] = experts
): ExpertRecommendation[] {
  const scored: ExpertRecommendation[] = []

  for (const expert of allExperts) {
    let score = 0
    const matchReasons: string[] = []
    const relevantExpertise: string[] = []

    // Category match (domain → category): +30 per match
    const relevantCategories = new Set<string>()
    for (const domain of requirements.domains) {
      const categories = DOMAIN_TO_CATEGORY[domain] || []
      categories.forEach((cat) => relevantCategories.add(cat))
    }

    const categoryMatches = expert.categories.filter((cat) =>
      relevantCategories.has(cat)
    )
    if (categoryMatches.length > 0) {
      score += 30 * Math.min(categoryMatches.length, 2) // Cap at 60 for categories
      matchReasons.push(`Expertise in ${categoryMatches.join(', ')}`)
    }

    // Expertise keyword match: +10 each, max 40
    const expertiseLower = expert.expertise.map((e) => e.toLowerCase())
    const headlineLower = expert.headline.toLowerCase()
    const bioLower = expert.bio.toLowerCase()

    let keywordMatches = 0
    for (const skill of requirements.skills) {
      const skillLower = skill.toLowerCase()
      if (
        expertiseLower.some((e) => e.includes(skillLower)) ||
        headlineLower.includes(skillLower) ||
        bioLower.includes(skillLower)
      ) {
        keywordMatches++
        const matchedExpertise = expert.expertise.find((e) =>
          e.toLowerCase().includes(skillLower)
        )
        if (matchedExpertise && !relevantExpertise.includes(matchedExpertise)) {
          relevantExpertise.push(matchedExpertise)
        }
      }
    }

    // Also check keywords
    for (const keyword of requirements.keywords) {
      const keywordLower = keyword.toLowerCase()
      if (
        expertiseLower.some((e) => e.includes(keywordLower)) ||
        headlineLower.includes(keywordLower) ||
        bioLower.includes(keywordLower)
      ) {
        if (!requirements.skills.some((s) => s.toLowerCase() === keywordLower)) {
          keywordMatches++
        }
      }
    }

    if (keywordMatches > 0) {
      score += Math.min(keywordMatches * 10, 40)
      if (keywordMatches >= 2) {
        matchReasons.push(`Matches ${keywordMatches} key requirements`)
      }
    }

    // Rating bonus: ≥4.9 gets +15
    if (expert.rating >= 4.9) {
      score += 15
      matchReasons.push(`Highly rated (${expert.rating})`)
    }

    // Review count bonus: ≥100 gets +10
    if (expert.reviewCount >= 100) {
      score += 10
    }

    // Verified expert: +5
    if (expert.verified) {
      score += 5
    }

    // Headline contains domain: +20
    for (const domain of requirements.domains) {
      const domainVariants = [
        domain,
        domain.replace(/\s+/g, ''),
        domain.split(' ')[0],
      ]
      if (domainVariants.some((v) => headlineLower.includes(v.toLowerCase()))) {
        score += 20
        break
      }
    }

    // Add if score is meaningful
    if (score > 20) {
      // Fill in relevant expertise if empty
      if (relevantExpertise.length === 0) {
        relevantExpertise.push(...expert.expertise.slice(0, 3))
      }

      // Add a generic match reason if none found
      if (matchReasons.length === 0) {
        matchReasons.push('Relevant industry experience')
      }

      scored.push({
        expert,
        matchScore: Math.min(score, 100),
        matchReasons,
        relevantExpertise: relevantExpertise.slice(0, 5),
      })
    }
  }

  // Sort by score descending and return top N
  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, AI_MATCH_CONFIG.MAX_RECOMMENDATIONS)
}

/**
 * Generate a mock AI response based on user message and extracted requirements
 */
export function generateMockResponse(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): {
  content: string
  requirements?: ExtractedRequirements
  recommendations?: ExpertRecommendation[]
} {
  const requirements = extractRequirements(userMessage)
  const recommendations = matchExperts(requirements)

  const isFirstMessage = history.length === 0
  const hasRequirements =
    requirements.domains.length > 0 || requirements.skills.length > 0

  // No matches found
  if (!hasRequirements || recommendations.length === 0) {
    return {
      content: `I'd love to help you find the right experts. To provide better recommendations, could you share more details about:

- **Domain/Industry**: What field or industry is this project in? (e.g., cybersecurity, cloud infrastructure, data analytics)
- **Key Skills**: What specific skills or certifications are needed? (e.g., FedRAMP, NIST 800-53, AWS)
- **Experience Level**: What level of experience are you looking for?

The more specific you are, the better I can match you with the right consultants.`,
      requirements: hasRequirements ? requirements : undefined,
    }
  }

  // Build response with matches
  let content = ''

  if (isFirstMessage) {
    content = `I've analyzed your requirements and found ${recommendations.length} expert${recommendations.length > 1 ? 's' : ''} who ${recommendations.length > 1 ? 'match' : 'matches'} your needs.`
  } else {
    content = `Based on your additional requirements, I've refined the search. Here are ${recommendations.length} expert${recommendations.length > 1 ? 's' : ''} who ${recommendations.length > 1 ? 'match' : 'matches'} your updated criteria.`
  }

  // Add summary of what we found
  if (requirements.domains.length > 0) {
    content += ` I identified expertise needed in **${requirements.domains.join(', ')}**.`
  }

  if (requirements.clearanceRequired) {
    content += ` ${requirements.clearanceRequired} clearance requirement noted.`
  }

  content += `

Click on any expert to view their full profile and book a consultation.`

  return {
    content,
    requirements,
    recommendations,
  }
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create an assistant message from mock response
 */
export function createAssistantMessage(
  response: ReturnType<typeof generateMockResponse>
): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content: response.content,
    timestamp: new Date(),
    requirements: response.requirements,
    expertRecommendations: response.recommendations,
  }
}
