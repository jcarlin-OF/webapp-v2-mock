// Expert profile status
export type ProfileStatus = 'claimed' | 'unclaimed' | 'pending'

// Security clearance levels (gov con specific)
export type ClearanceLevel =
  | 'none'
  | 'public-trust'
  | 'secret'
  | 'top-secret'
  | 'ts-sci'

// Expert types
export interface Expert {
  id: string
  slug: string
  name: string
  headline: string
  bio: string
  avatar: string
  verified: boolean
  rating: number
  reviewCount: number
  categories: string[]
  expertise: string[]
  languages: string[]
  timezone: string
  services: Service[]
  availability: Availability
  credentials: Credential[]
  featuredReview?: Review

  // Profile status (claimed vs unclaimed/scraped)
  profileStatus: ProfileStatus
  claimedAt?: string // ISO date when expert claimed profile

  // Response metrics (trust signals)
  responseTime?: number // average minutes to respond
  lastActiveAt?: string // ISO date of last activity
  completedConsultations: number // total completed calls

  // Security clearance (gov con specific)
  clearanceLevel?: ClearanceLevel
  clearanceVerified?: boolean // third-party verified
}

export interface Service {
  id: string
  name: string
  duration: number // minutes
  price: number // cents
  description: string
}

export interface Availability {
  nextAvailable: string | null // ISO date
  slots: TimeSlot[]
}

export interface TimeSlot {
  date: string // ISO date
  startTime: string // HH:mm
  endTime: string // HH:mm
  available: boolean
}

export interface Credential {
  type: 'education' | 'experience' | 'certification'
  title: string
  organization: string
  year?: number
  description?: string
}

// Review types
export interface Review {
  id: string
  expertId: string
  author: {
    name: string
    avatar?: string
    title?: string
  }
  rating: number
  content: string
  date: string // ISO date
  helpful?: number
}

// Category types
export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  expertCount: number
}

// Booking types
export interface Booking {
  id: string
  expertId: string
  expert: Pick<Expert, 'id' | 'name' | 'avatar' | 'headline'>
  clientId: string
  serviceId: string
  service: Service
  date: string // ISO date
  startTime: string
  endTime: string
  status: BookingStatus
  agenda?: string
  meetingLink?: string
  createdAt: string
  price: number // cents
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export interface BookingFormData {
  expertId: string
  serviceId: string
  date: string
  startTime: string
  agenda?: string
  timezone: string
}

// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'client' | 'expert' | 'admin'
  createdAt: string
}

export interface Client extends User {
  role: 'client'
  savedExperts: string[]
  bookings: Booking[]
}

export interface ExpertUser extends User {
  role: 'expert'
  expert: Expert
  earnings: Earnings
}

export interface Earnings {
  total: number // cents
  pending: number // cents
  available: number // cents
  lastPayout?: {
    amount: number
    date: string
  }
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ExpertFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  languages?: string[]
  availableNext7Days?: boolean
  search?: string
  profileStatus?: ProfileStatus
  clearanceLevel?: ClearanceLevel
}

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'reviews'
  | 'availability'

// Messaging types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderRole: 'client' | 'expert'
  content: string
  createdAt: string // ISO date
  readAt?: string // ISO date when read
}

export interface Conversation {
  id: string
  expertId: string
  clientId: string
  expert: Pick<Expert, 'id' | 'name' | 'avatar' | 'headline'>
  client: Pick<User, 'id' | 'name' | 'avatar'>
  lastMessage?: Pick<Message, 'content' | 'createdAt' | 'senderRole'>
  lastMessageAt: string
  status: 'active' | 'archived'
  createdAt: string
  // Tracks messages sent by client for free tier limit
  clientMessageCount: number
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}

// Subscription tiers for messaging
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface UserSubscription {
  tier: SubscriptionTier
  messagesPerExpert: number // free: 3, pro: Infinity, enterprise: Infinity
  introRequestsPerMonth: number
  expiresAt?: string
}

// Expert Request types
export type ExpertRequestState = 'draft' | 'open' | 'closed'

export type CandidateStatus =
  | 'identified' // Added to request, not yet contacted
  | 'contacted' // Outreach sent
  | 'interested' // Expert expressed interest
  | 'vetting' // Under evaluation
  | 'matched' // Confirmed as good fit
  | 'rejected' // Declined (by expert or client)

export type QuestionType = 'text' | 'long_text' | 'boolean' | 'single_select' | 'multi_select'

export interface Qualification {
  id: string
  question: string
  type: QuestionType
  required: boolean
  options?: string[] // For select types
}

export interface QualificationResponse {
  qualificationId: string
  answer: string | boolean | string[]
}

export interface ExpertRequest {
  id: string

  // Ownership
  createdById: string
  createdBy: Pick<User, 'id' | 'name' | 'email'>
  teamId?: string

  // Contract/Opportunity Details
  title: string
  description: string
  agency?: string // e.g., "Department of Defense"
  contractType?: string // e.g., "IDIQ", "BPA", "Task Order"
  naicsCode?: string
  deadline?: string // Proposal due date

  // Requirements
  requiredExpertise: string[]
  clearanceRequired?: ClearanceLevel
  qualifications: Qualification[]

  // State
  state: ExpertRequestState
  closeReason?: string

  // Public Link
  slug: string // URL-safe identifier
  isPublic: boolean
  publicLinkExpiresAt?: string

  // Stats (computed)
  candidateCount: number
  matchedCount: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface StatusHistoryEntry {
  status: CandidateStatus
  changedBy: string
  changedAt: string
  note?: string
}

export interface InternalNote {
  authorId: string
  author: string
  note: string
  createdAt: string
}

export interface ExternalProfile {
  name: string
  email?: string
  linkedinUrl?: string
  headline?: string
  linkedinData?: Record<string, unknown> // Raw LinkedIn profile data
}

export interface ExpertCandidate {
  id: string
  requestId: string
  expertId?: string // Null if external/unclaimed

  // For external experts (LinkedIn sourced)
  externalProfile?: ExternalProfile

  // Status tracking
  status: CandidateStatus
  statusHistory: StatusHistoryEntry[]

  // Questionnaire responses (filled by expert)
  qualificationResponses: QualificationResponse[]

  // Notes
  internalNotes: InternalNote[] // Visible to internal team only
  clientNotes?: InternalNote[] // Visible to client

  // Engagement tracking
  contactedAt?: string
  respondedAt?: string
  lastViewedAt?: string

  // Source tracking
  source: 'platform' | 'linkedin' | 'referral' | 'public_link'
  addedById: string
  addedBy: string

  // Timestamps
  createdAt: string
  updatedAt: string
}
