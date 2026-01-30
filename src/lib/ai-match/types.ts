import type { Expert } from '@/types'

// Chat message with optional expert recommendations
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  expertRecommendations?: ExpertRecommendation[]
  requirements?: ExtractedRequirements
}

// Expert match with reasoning
export interface ExpertRecommendation {
  expert: Expert
  matchScore: number // 0-100
  matchReasons: string[] // Why this expert matches
  relevantExpertise: string[] // Matching skills highlighted
}

// Extracted from RFP/SOW text
export interface ExtractedRequirements {
  domains: string[] // cybersecurity, cloud, data analytics
  skills: string[] // FedRAMP, NIST, FISMA
  experienceLevel: string // "10+ years federal experience"
  clearanceRequired?: string // Secret, Top Secret/SCI
  contractType?: string // IDIQ, FFP, T&M
  naicsCodes?: string[]
  keywords: string[]
}

// Session state
export interface ChatSession {
  id: string
  messages: ChatMessage[]
  messageCount: number
  maxMessages: number // 20
  createdAt: string
}

// API request/response types
export interface ChatAPIRequest {
  sessionId: string
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
}

export interface ChatAPIResponse {
  message: ChatMessage
  requirements?: ExtractedRequirements
  recommendations?: ExpertRecommendation[]
}

// Serialized versions for localStorage
export interface SerializedChatMessage extends Omit<ChatMessage, 'timestamp'> {
  timestamp: string
}

export interface SerializedChatSession extends Omit<ChatSession, 'messages'> {
  messages: SerializedChatMessage[]
}
