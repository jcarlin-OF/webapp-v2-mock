import { z } from 'zod'

// Service selection schema
export const serviceSelectionSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
})

// Time slot selection schema
export const timeSlotSelectionSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time slot'),
  timezone: z.string().min(1, 'Please select a timezone'),
})

// Booking details schema
export const bookingDetailsSchema = z.object({
  agenda: z
    .string()
    .min(10, 'Please provide at least 10 characters describing what you want to discuss')
    .max(2000, 'Agenda must be less than 2000 characters'),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
})

// Guest checkout schema (for unauthenticated users)
export const guestCheckoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
})

// Payment schema (stub for Stripe integration)
export const paymentSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

// Complete booking form schema
export const completeBookingSchema = z.object({
  // Expert info (read-only context)
  expertId: z.string().min(1),

  // Step 1: Service
  serviceId: z.string().min(1, 'Please select a service'),

  // Step 2: Time
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time slot'),
  timezone: z.string().min(1, 'Please select a timezone'),

  // Step 3: Details
  agenda: z.string().min(10, 'Please describe what you want to discuss').max(2000),
  specialRequests: z.string().max(500).optional(),

  // Step 4: Payment (guest checkout)
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

// Type exports
export type ServiceSelection = z.infer<typeof serviceSelectionSchema>
export type TimeSlotSelection = z.infer<typeof timeSlotSelectionSchema>
export type BookingDetails = z.infer<typeof bookingDetailsSchema>
export type GuestCheckout = z.infer<typeof guestCheckoutSchema>
export type PaymentInfo = z.infer<typeof paymentSchema>
export type CompleteBooking = z.infer<typeof completeBookingSchema>

// Booking state type for the wizard
export type BookingStep = 'service' | 'time' | 'details' | 'payment' | 'confirmation'

export interface BookingState {
  step: BookingStep
  expertId: string
  serviceId: string | null
  date: string | null
  startTime: string | null
  endTime: string | null
  timezone: string
  agenda: string
  specialRequests: string
  // Guest info
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  acceptTerms: boolean
  // Result
  bookingId: string | null
  error: string | null
}

export const initialBookingState: Omit<BookingState, 'expertId'> = {
  step: 'service',
  serviceId: null,
  date: null,
  startTime: null,
  endTime: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  agenda: '',
  specialRequests: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  acceptTerms: false,
  bookingId: null,
  error: null,
}
