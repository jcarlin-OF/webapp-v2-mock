import { z } from 'zod'

// Qualification schema for creating questions
export const qualificationSchema = z.object({
  id: z.string().optional(), // Generated on creation
  question: z.string().min(5, 'Question must be at least 5 characters'),
  type: z.enum(['text', 'long_text', 'boolean', 'single_select', 'multi_select']),
  required: z.boolean().default(true),
  options: z.array(z.string()).optional(),
})

// Create Expert Request schema (wizard steps)
export const requestBasicInfoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title is too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description is too long'),
  agency: z.string().max(100, 'Agency name is too long').optional(),
  contractType: z.string().max(50, 'Contract type is too long').optional(),
  naicsCode: z.string().max(10, 'NAICS code is too long').optional(),
  deadline: z.string().optional(),
})

export const requestRequirementsSchema = z.object({
  requiredExpertise: z.array(z.string()).min(1, 'Add at least one required expertise'),
  clearanceRequired: z.enum(['none', 'public-trust', 'secret', 'top-secret', 'ts-sci']).optional(),
})

export const requestQualificationsSchema = z.object({
  qualifications: z.array(qualificationSchema).default([]),
})

export const requestSettingsSchema = z.object({
  isPublic: z.boolean().default(true),
  state: z.enum(['draft', 'open']).default('draft'),
})

// Complete request creation schema
export const createExpertRequestSchema = requestBasicInfoSchema
  .merge(requestRequirementsSchema)
  .merge(requestQualificationsSchema)
  .merge(requestSettingsSchema)

// Update request schema (partial updates allowed)
export const updateExpertRequestSchema = createExpertRequestSchema.partial().extend({
  state: z.enum(['draft', 'open', 'closed']).optional(),
  closeReason: z.string().max(500, 'Close reason is too long').optional(),
})

// Add candidate from platform
export const addPlatformCandidateSchema = z.object({
  expertId: z.string().min(1, 'Expert ID is required'),
  note: z.string().max(1000, 'Note is too long').optional(),
})

// Add candidate from LinkedIn
export const addLinkedInCandidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .refine(
      (url) => url.includes('linkedin.com'),
      'Must be a LinkedIn URL'
    ),
  headline: z.string().max(200, 'Headline is too long').optional(),
  note: z.string().max(1000, 'Note is too long').optional(),
})

// Update candidate status schema
export const updateCandidateStatusSchema = z.object({
  status: z.enum(['identified', 'contacted', 'interested', 'vetting', 'matched', 'rejected']),
  note: z.string().max(500, 'Note is too long').optional(),
})

// Add note to candidate
export const addCandidateNoteSchema = z.object({
  note: z.string().min(1, 'Note is required').max(2000, 'Note is too long'),
})

// Submit qualification responses (for experts/applicants)
export const qualificationResponseSchema = z.object({
  qualificationId: z.string(),
  answer: z.union([
    z.string(),
    z.boolean(),
    z.array(z.string()),
  ]),
})

export const submitApplicationSchema = z.object({
  responses: z.array(qualificationResponseSchema),
})

// Public link application schema (includes optional profile creation)
export const publicApplicationSchema = z.object({
  // Optional account creation fields
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  linkedinUrl: z.string().url('Invalid URL').optional(),
  headline: z.string().max(200, 'Headline is too long').optional(),

  // Qualification responses
  responses: z.array(qualificationResponseSchema),
})

// Type exports
export type QualificationInput = z.infer<typeof qualificationSchema>
export type RequestBasicInfo = z.infer<typeof requestBasicInfoSchema>
export type RequestRequirements = z.infer<typeof requestRequirementsSchema>
export type RequestQualifications = z.infer<typeof requestQualificationsSchema>
export type RequestSettings = z.infer<typeof requestSettingsSchema>
export type CreateExpertRequest = z.infer<typeof createExpertRequestSchema>
export type UpdateExpertRequest = z.infer<typeof updateExpertRequestSchema>
export type AddPlatformCandidate = z.infer<typeof addPlatformCandidateSchema>
export type AddLinkedInCandidate = z.infer<typeof addLinkedInCandidateSchema>
export type UpdateCandidateStatus = z.infer<typeof updateCandidateStatusSchema>
export type AddCandidateNote = z.infer<typeof addCandidateNoteSchema>
export type QualificationResponseInput = z.infer<typeof qualificationResponseSchema>
export type SubmitApplication = z.infer<typeof submitApplicationSchema>
export type PublicApplication = z.infer<typeof publicApplicationSchema>

// Wizard state type
export type RequestWizardStep = 'basics' | 'requirements' | 'qualifications' | 'review'

export interface RequestWizardState {
  step: RequestWizardStep
  // Basic info
  title: string
  description: string
  agency: string
  contractType: string
  naicsCode: string
  deadline: string
  // Requirements
  requiredExpertise: string[]
  clearanceRequired: string
  // Qualifications
  qualifications: QualificationInput[]
  // Settings
  isPublic: boolean
  state: 'draft' | 'open'
  // Result
  requestId: string | null
  error: string | null
}

export const initialRequestWizardState: RequestWizardState = {
  step: 'basics',
  title: '',
  description: '',
  agency: '',
  contractType: '',
  naicsCode: '',
  deadline: '',
  requiredExpertise: [],
  clearanceRequired: 'none',
  qualifications: [],
  isPublic: true,
  state: 'draft',
  requestId: null,
  error: null,
}

// Common contract types
export const CONTRACT_TYPES = [
  'IDIQ',
  'BPA',
  'Task Order',
  'GSA Schedule',
  'GWAC',
  'Single Award',
  'Multiple Award',
  'Other',
] as const

// Common agencies
export const AGENCIES = [
  'Department of Defense',
  'Department of Veterans Affairs',
  'Department of Homeland Security',
  'Department of Treasury',
  'Department of Health and Human Services',
  'Department of Energy',
  'Department of Justice',
  'General Services Administration',
  'NASA',
  'Other',
] as const
