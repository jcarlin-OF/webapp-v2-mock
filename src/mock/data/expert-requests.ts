import type {
  ExpertRequest,
  ExpertCandidate,
  CandidateStatus,
  ExpertRequestState,
  Qualification,
  QualificationResponse,
} from '@/types'
import { format, subDays, addDays } from 'date-fns'
import { experts } from './experts'
import { mockUsers } from './users'

// Generate a URL-safe slug from title
function generateSlug(title: string, id: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40)
  return `${baseSlug}-${id.substring(4, 8)}`
}

const now = new Date()

// Mock Expert Requests
export const expertRequests: ExpertRequest[] = [
  {
    id: 'req_001',
    createdById: 'user_001',
    createdBy: {
      id: 'user_001',
      name: 'John Client',
      email: 'client@test.com',
    },
    title: 'CMMC Level 2 Compliance Expert for DoD RFP',
    description: `We are seeking expert guidance on achieving CMMC Level 2 certification for an upcoming Department of Defense contract opportunity.

The ideal expert should have:
- Direct experience with CMMC assessment and certification
- Understanding of DoD cybersecurity requirements
- Experience helping organizations prepare for CMMC audits

This is a time-sensitive opportunity with a proposal deadline in early March.`,
    agency: 'Department of Defense',
    contractType: 'IDIQ',
    naicsCode: '541512',
    deadline: format(addDays(now, 45), 'yyyy-MM-dd'),
    requiredExpertise: ['CMMC', 'Cybersecurity', 'DoD Compliance', 'Risk Assessment'],
    clearanceRequired: 'secret',
    qualifications: [
      {
        id: 'q1_001',
        question: 'How many years of CMMC/NIST 800-171 experience do you have?',
        type: 'single_select',
        required: true,
        options: ['1-2 years', '3-5 years', '5+ years'],
      },
      {
        id: 'q2_001',
        question: 'Have you directly helped an organization achieve CMMC Level 2 certification?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'q3_001',
        question: 'Describe your experience with DoD compliance frameworks',
        type: 'long_text',
        required: true,
      },
      {
        id: 'q4_001',
        question: 'Which CMMC domains are you most experienced with?',
        type: 'multi_select',
        required: false,
        options: [
          'Access Control',
          'Audit and Accountability',
          'Configuration Management',
          'Identification and Authentication',
          'Incident Response',
          'System and Communications Protection',
        ],
      },
    ],
    state: 'open',
    slug: 'cmmc-l2-dod-jan26-001',
    isPublic: true,
    candidateCount: 4,
    matchedCount: 1,
    createdAt: format(subDays(now, 10), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 1), 'yyyy-MM-dd'),
  },
  {
    id: 'req_002',
    createdById: 'user_001',
    createdBy: {
      id: 'user_001',
      name: 'John Client',
      email: 'client@test.com',
    },
    title: 'Healthcare Data Analytics Expert for VA Contract',
    description: `Seeking a healthcare data analytics expert for a Veterans Affairs contract focused on improving patient outcomes through data-driven insights.

Key requirements:
- Experience with healthcare data systems (EHR, claims data)
- HIPAA compliance expertise
- Familiarity with VA systems is a strong plus
- Track record of implementing data analytics solutions in healthcare`,
    agency: 'Department of Veterans Affairs',
    contractType: 'BPA',
    naicsCode: '541611',
    deadline: format(addDays(now, 60), 'yyyy-MM-dd'),
    requiredExpertise: ['Healthcare Analytics', 'HIPAA', 'Data Science', 'Veterans Affairs'],
    clearanceRequired: 'public-trust',
    qualifications: [
      {
        id: 'q1_002',
        question: 'Years of experience in healthcare data analytics',
        type: 'single_select',
        required: true,
        options: ['1-3 years', '3-5 years', '5-10 years', '10+ years'],
      },
      {
        id: 'q2_002',
        question: 'Do you have experience with VA healthcare systems specifically?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'q3_002',
        question: 'Describe a successful healthcare analytics project you led',
        type: 'long_text',
        required: true,
      },
    ],
    state: 'open',
    slug: 'healthcare-analytics-va-002',
    isPublic: true,
    candidateCount: 2,
    matchedCount: 0,
    createdAt: format(subDays(now, 5), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'req_003',
    createdById: 'user_001',
    createdBy: {
      id: 'user_001',
      name: 'John Client',
      email: 'client@test.com',
    },
    title: 'AI/ML Strategy Consultant for Financial Services',
    description: `Looking for an AI/ML expert to help shape our proposal for a financial services modernization initiative.

We need expertise in:
- AI/ML strategy and implementation
- Financial services regulatory compliance
- Machine learning operations (MLOps)
- Experience with large-scale data platforms`,
    agency: 'Department of Treasury',
    contractType: 'Task Order',
    naicsCode: '541715',
    deadline: format(addDays(now, 30), 'yyyy-MM-dd'),
    requiredExpertise: ['AI/ML Strategy', 'Financial Services', 'MLOps', 'Data Platforms'],
    clearanceRequired: 'secret',
    qualifications: [
      {
        id: 'q1_003',
        question: 'Describe your experience with AI/ML in financial services',
        type: 'long_text',
        required: true,
      },
      {
        id: 'q2_003',
        question: 'Have you worked on federal financial modernization projects?',
        type: 'boolean',
        required: true,
      },
    ],
    state: 'draft',
    slug: 'ai-ml-finserv-003',
    isPublic: false,
    candidateCount: 0,
    matchedCount: 0,
    createdAt: format(subDays(now, 2), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'req_004',
    createdById: 'user_001',
    createdBy: {
      id: 'user_001',
      name: 'John Client',
      email: 'client@test.com',
    },
    title: 'Cloud Infrastructure Expert for DHS Migration',
    description: `Completed project - sought expertise for Department of Homeland Security cloud migration initiative.`,
    agency: 'Department of Homeland Security',
    contractType: 'IDIQ',
    deadline: format(subDays(now, 30), 'yyyy-MM-dd'),
    requiredExpertise: ['Cloud Architecture', 'AWS GovCloud', 'FedRAMP', 'Security'],
    clearanceRequired: 'top-secret',
    qualifications: [],
    state: 'closed',
    closeReason: 'Successfully matched with expert',
    slug: 'cloud-dhs-004',
    isPublic: false,
    candidateCount: 6,
    matchedCount: 2,
    createdAt: format(subDays(now, 90), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 30), 'yyyy-MM-dd'),
  },
]

// Mock Expert Candidates
export const expertCandidates: ExpertCandidate[] = [
  // Candidates for req_001 (CMMC DoD)
  {
    id: 'cand_001',
    requestId: 'req_001',
    expertId: 'exp_010', // Alex Petrov - Cybersecurity Expert
    status: 'matched',
    statusHistory: [
      {
        status: 'identified',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 9), 'yyyy-MM-dd'),
      },
      {
        status: 'contacted',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 8), 'yyyy-MM-dd'),
      },
      {
        status: 'interested',
        changedBy: 'exp_010',
        changedAt: format(subDays(now, 7), 'yyyy-MM-dd'),
      },
      {
        status: 'vetting',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
      },
      {
        status: 'matched',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
        note: 'Perfect fit - extensive DoD and CMMC experience',
      },
    ],
    qualificationResponses: [
      { qualificationId: 'q1_001', answer: '5+ years' },
      { qualificationId: 'q2_001', answer: true },
      {
        qualificationId: 'q3_001',
        answer:
          'Led CMMC Level 2 certification efforts for 3 defense contractors. Extensive experience with NIST 800-171 controls and DoD assessment methodology. Served as CISO at PayPal where I managed federal compliance programs.',
      },
      {
        qualificationId: 'q4_001',
        answer: [
          'Access Control',
          'Incident Response',
          'System and Communications Protection',
        ],
      },
    ],
    internalNotes: [
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Strong candidate - has TS/SCI clearance and direct CMMC experience',
        createdAt: format(subDays(now, 7), 'yyyy-MM-dd'),
      },
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Completed vetting call - excellent fit for the project',
        createdAt: format(subDays(now, 3), 'yyyy-MM-dd'),
      },
    ],
    contactedAt: format(subDays(now, 8), 'yyyy-MM-dd'),
    respondedAt: format(subDays(now, 7), 'yyyy-MM-dd'),
    lastViewedAt: format(subDays(now, 1), 'yyyy-MM-dd'),
    source: 'platform',
    addedById: 'user_001',
    addedBy: 'John Client',
    createdAt: format(subDays(now, 9), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'cand_002',
    requestId: 'req_001',
    expertId: 'exp_001', // Sarah Chen
    status: 'interested',
    statusHistory: [
      {
        status: 'identified',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 8), 'yyyy-MM-dd'),
      },
      {
        status: 'contacted',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 7), 'yyyy-MM-dd'),
      },
      {
        status: 'interested',
        changedBy: 'exp_001',
        changedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
      },
    ],
    qualificationResponses: [
      { qualificationId: 'q1_001', answer: '3-5 years' },
      { qualificationId: 'q2_001', answer: false },
      {
        qualificationId: 'q3_001',
        answer:
          'While my primary expertise is in AI/ML product strategy, I have worked on several defense-adjacent projects requiring security compliance. At Google, I led teams that achieved FedRAMP authorization.',
      },
    ],
    internalNotes: [
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Strong AI background but less direct CMMC experience - consider for advisory role',
        createdAt: format(subDays(now, 5), 'yyyy-MM-dd'),
      },
    ],
    contactedAt: format(subDays(now, 7), 'yyyy-MM-dd'),
    respondedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
    source: 'platform',
    addedById: 'user_001',
    addedBy: 'John Client',
    createdAt: format(subDays(now, 8), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
  },
  {
    id: 'cand_003',
    requestId: 'req_001',
    expertId: undefined, // External expert from LinkedIn
    externalProfile: {
      name: 'Marcus Johnson',
      email: 'marcus.j@email.com',
      linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
      headline: 'Former DoD Cybersecurity Advisor | CMMC Registered Practitioner',
    },
    status: 'contacted',
    statusHistory: [
      {
        status: 'identified',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 6), 'yyyy-MM-dd'),
      },
      {
        status: 'contacted',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
      },
    ],
    qualificationResponses: [],
    internalNotes: [
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Found on LinkedIn - registered CMMC practitioner. Sent outreach via LinkedIn InMail.',
        createdAt: format(subDays(now, 6), 'yyyy-MM-dd'),
      },
    ],
    contactedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
    source: 'linkedin',
    addedById: 'user_001',
    addedBy: 'John Client',
    createdAt: format(subDays(now, 6), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 5), 'yyyy-MM-dd'),
  },
  {
    id: 'cand_004',
    requestId: 'req_001',
    expertId: undefined, // External expert from public link
    externalProfile: {
      name: 'Patricia Williams',
      linkedinUrl: 'https://linkedin.com/in/patriciawilliams',
      headline: 'Cybersecurity Consultant | CISSP, CISM',
    },
    status: 'interested',
    statusHistory: [
      {
        status: 'interested',
        changedBy: 'public_link',
        changedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
      },
    ],
    qualificationResponses: [
      { qualificationId: 'q1_001', answer: '3-5 years' },
      { qualificationId: 'q2_001', answer: true },
      {
        qualificationId: 'q3_001',
        answer:
          'I have helped 5 organizations achieve CMMC Level 2 certification over the past 3 years. I specialize in gap assessments and remediation planning for defense contractors.',
      },
      {
        qualificationId: 'q4_001',
        answer: ['Access Control', 'Audit and Accountability', 'Configuration Management'],
      },
    ],
    internalNotes: [],
    respondedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
    lastViewedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
    source: 'public_link',
    addedById: 'public_link',
    addedBy: 'Public Link',
    createdAt: format(subDays(now, 3), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
  },
  // Candidates for req_002 (Healthcare VA)
  {
    id: 'cand_005',
    requestId: 'req_002',
    expertId: 'exp_013', // Rachel Green - Healthcare Strategy
    status: 'vetting',
    statusHistory: [
      {
        status: 'identified',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 4), 'yyyy-MM-dd'),
      },
      {
        status: 'contacted',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
      },
      {
        status: 'interested',
        changedBy: 'exp_013',
        changedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
      },
      {
        status: 'vetting',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 1), 'yyyy-MM-dd'),
      },
    ],
    qualificationResponses: [
      { qualificationId: 'q1_002', answer: '10+ years' },
      { qualificationId: 'q2_002', answer: false },
      {
        qualificationId: 'q3_002',
        answer:
          'At McKinsey, I led a multi-year healthcare analytics transformation for a major health system. We implemented predictive models for readmission risk and resource allocation that improved patient outcomes by 15%.',
      },
    ],
    internalNotes: [
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Excellent healthcare background. Setting up vetting call.',
        createdAt: format(subDays(now, 2), 'yyyy-MM-dd'),
      },
    ],
    contactedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
    respondedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
    source: 'platform',
    addedById: 'user_001',
    addedBy: 'John Client',
    createdAt: format(subDays(now, 4), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 1), 'yyyy-MM-dd'),
  },
  {
    id: 'cand_006',
    requestId: 'req_002',
    expertId: 'exp_014', // Tom Harris - Data Science
    status: 'contacted',
    statusHistory: [
      {
        status: 'identified',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 3), 'yyyy-MM-dd'),
      },
      {
        status: 'contacted',
        changedBy: 'user_001',
        changedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
      },
    ],
    qualificationResponses: [],
    internalNotes: [
      {
        authorId: 'user_001',
        author: 'John Client',
        note: 'Strong data science background - awaiting response',
        createdAt: format(subDays(now, 2), 'yyyy-MM-dd'),
      },
    ],
    contactedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
    source: 'platform',
    addedById: 'user_001',
    addedBy: 'John Client',
    createdAt: format(subDays(now, 3), 'yyyy-MM-dd'),
    updatedAt: format(subDays(now, 2), 'yyyy-MM-dd'),
  },
]

// Helper functions

export function getExpertRequestById(id: string): ExpertRequest | undefined {
  return expertRequests.find((req) => req.id === id)
}

export function getExpertRequestBySlug(slug: string): ExpertRequest | undefined {
  return expertRequests.find((req) => req.slug === slug)
}

export function getExpertRequestsByUserId(userId: string): ExpertRequest[] {
  return expertRequests.filter((req) => req.createdById === userId)
}

export function getExpertRequestsByState(state: ExpertRequestState): ExpertRequest[] {
  return expertRequests.filter((req) => req.state === state)
}

export function getCandidatesByRequestId(requestId: string): ExpertCandidate[] {
  return expertCandidates.filter((cand) => cand.requestId === requestId)
}

export function getCandidateById(id: string): ExpertCandidate | undefined {
  return expertCandidates.find((cand) => cand.id === id)
}

export function getCandidatesByExpertId(expertId: string): ExpertCandidate[] {
  return expertCandidates.filter((cand) => cand.expertId === expertId)
}

export function getCandidatesByStatus(
  requestId: string,
  status: CandidateStatus
): ExpertCandidate[] {
  return expertCandidates.filter(
    (cand) => cand.requestId === requestId && cand.status === status
  )
}

// Get candidate with enriched expert data
export function getCandidateWithExpert(candidateId: string): (ExpertCandidate & { expert?: typeof experts[0] }) | undefined {
  const candidate = getCandidateById(candidateId)
  if (!candidate) return undefined

  const expert = candidate.expertId
    ? experts.find((e) => e.id === candidate.expertId)
    : undefined

  return { ...candidate, expert }
}

// Get all candidates for a request with enriched expert data
export function getCandidatesWithExperts(
  requestId: string
): (ExpertCandidate & { expert?: typeof experts[0] })[] {
  const candidates = getCandidatesByRequestId(requestId)
  return candidates.map((cand) => ({
    ...cand,
    expert: cand.expertId ? experts.find((e) => e.id === cand.expertId) : undefined,
  }))
}

// Create a new expert request
export function createExpertRequest(
  data: Omit<ExpertRequest, 'id' | 'slug' | 'candidateCount' | 'matchedCount' | 'createdAt' | 'updatedAt'>
): ExpertRequest {
  const id = `req_${Date.now()}`
  const newRequest: ExpertRequest = {
    ...data,
    id,
    slug: generateSlug(data.title, id),
    candidateCount: 0,
    matchedCount: 0,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  }
  expertRequests.push(newRequest)
  return newRequest
}

// Update an expert request
export function updateExpertRequest(
  id: string,
  updates: Partial<ExpertRequest>
): ExpertRequest | undefined {
  const index = expertRequests.findIndex((req) => req.id === id)
  if (index === -1) return undefined

  expertRequests[index] = {
    ...expertRequests[index],
    ...updates,
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  }
  return expertRequests[index]
}

// Delete an expert request
export function deleteExpertRequest(id: string): boolean {
  const index = expertRequests.findIndex((req) => req.id === id)
  if (index === -1) return false

  expertRequests.splice(index, 1)
  // Also delete associated candidates
  const candidateIndicesToRemove = expertCandidates
    .map((cand, idx) => (cand.requestId === id ? idx : -1))
    .filter((idx) => idx !== -1)
    .reverse()

  candidateIndicesToRemove.forEach((idx) => expertCandidates.splice(idx, 1))
  return true
}

// Add a candidate to a request
export function addCandidate(
  data: Omit<ExpertCandidate, 'id' | 'createdAt' | 'updatedAt'>
): ExpertCandidate {
  const newCandidate: ExpertCandidate = {
    ...data,
    id: `cand_${Date.now()}`,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  }
  expertCandidates.push(newCandidate)

  // Update request candidate count
  const request = getExpertRequestById(data.requestId)
  if (request) {
    updateExpertRequest(data.requestId, {
      candidateCount: getCandidatesByRequestId(data.requestId).length,
    })
  }

  return newCandidate
}

// Update candidate status
export function updateCandidateStatus(
  id: string,
  newStatus: CandidateStatus,
  changedBy: string,
  note?: string
): ExpertCandidate | undefined {
  const candidate = getCandidateById(id)
  if (!candidate) return undefined

  candidate.status = newStatus
  candidate.statusHistory.push({
    status: newStatus,
    changedBy,
    changedAt: format(new Date(), 'yyyy-MM-dd'),
    note,
  })
  candidate.updatedAt = format(new Date(), 'yyyy-MM-dd')

  // Update timestamps based on status
  if (newStatus === 'contacted') {
    candidate.contactedAt = format(new Date(), 'yyyy-MM-dd')
  } else if (newStatus === 'interested') {
    candidate.respondedAt = format(new Date(), 'yyyy-MM-dd')
  }

  // Update request matched count if status is matched
  const request = getExpertRequestById(candidate.requestId)
  if (request) {
    const matchedCount = getCandidatesByStatus(candidate.requestId, 'matched').length
    updateExpertRequest(candidate.requestId, { matchedCount })
  }

  return candidate
}

// Update candidate
export function updateCandidate(
  id: string,
  updates: Partial<ExpertCandidate>
): ExpertCandidate | undefined {
  const index = expertCandidates.findIndex((cand) => cand.id === id)
  if (index === -1) return undefined

  expertCandidates[index] = {
    ...expertCandidates[index],
    ...updates,
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  }
  return expertCandidates[index]
}

// Add internal note to candidate
export function addCandidateNote(
  candidateId: string,
  authorId: string,
  authorName: string,
  note: string
): ExpertCandidate | undefined {
  const candidate = getCandidateById(candidateId)
  if (!candidate) return undefined

  candidate.internalNotes.push({
    authorId,
    author: authorName,
    note,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  })
  candidate.updatedAt = format(new Date(), 'yyyy-MM-dd')

  return candidate
}

// Add qualification responses to candidate
export function addQualificationResponses(
  candidateId: string,
  responses: QualificationResponse[]
): ExpertCandidate | undefined {
  const candidate = getCandidateById(candidateId)
  if (!candidate) return undefined

  candidate.qualificationResponses = responses
  candidate.respondedAt = format(new Date(), 'yyyy-MM-dd')
  candidate.updatedAt = format(new Date(), 'yyyy-MM-dd')

  return candidate
}

// Remove candidate from request
export function removeCandidate(id: string): boolean {
  const candidate = getCandidateById(id)
  if (!candidate) return false

  const requestId = candidate.requestId
  const index = expertCandidates.findIndex((cand) => cand.id === id)
  if (index === -1) return false

  expertCandidates.splice(index, 1)

  // Update request counts
  const request = getExpertRequestById(requestId)
  if (request) {
    updateExpertRequest(requestId, {
      candidateCount: getCandidatesByRequestId(requestId).length,
      matchedCount: getCandidatesByStatus(requestId, 'matched').length,
    })
  }

  return true
}

// Get public request info (limited fields for unauthenticated access)
export function getPublicRequestInfo(slug: string): Partial<ExpertRequest> | undefined {
  const request = getExpertRequestBySlug(slug)
  if (!request || !request.isPublic) return undefined

  // Return limited public-facing data
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    agency: request.agency,
    contractType: request.contractType,
    deadline: request.deadline,
    requiredExpertise: request.requiredExpertise,
    clearanceRequired: request.clearanceRequired,
    qualifications: request.qualifications,
    slug: request.slug,
  }
}

// Get requests where an expert is a candidate
export function getRequestsForExpert(expertId: string): ExpertRequest[] {
  const candidateRequestIds = getCandidatesByExpertId(expertId).map((c) => c.requestId)
  return expertRequests.filter((req) => candidateRequestIds.includes(req.id))
}

// Search experts for adding to a request
export function searchExpertsForRequest(
  query: string,
  excludeIds: string[] = []
): typeof experts {
  const lowercaseQuery = query.toLowerCase()
  return experts.filter(
    (expert) =>
      !excludeIds.includes(expert.id) &&
      (expert.name.toLowerCase().includes(lowercaseQuery) ||
        expert.headline.toLowerCase().includes(lowercaseQuery) ||
        expert.expertise.some((e) => e.toLowerCase().includes(lowercaseQuery)))
  )
}
