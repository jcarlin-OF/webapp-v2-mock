'use client'

import { useState } from 'react'
import {
  CreditCard,
  Lock,
  Shield,
  Check,
  AlertCircle,
  Clock,
  Calendar,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn, formatPrice } from '@/lib/utils'
import type { Expert, Service } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PaymentStepProps {
  expert: Expert
  service: Service
  date: string
  startTime: string
  timezone: string
  // Guest checkout fields
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  acceptTerms: boolean
  onFieldChange: (field: string, value: string | boolean) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function PaymentStep({
  expert,
  service,
  date,
  startTime,
  timezone,
  firstName,
  lastName,
  email,
  phone,
  company,
  acceptTerms,
  onFieldChange,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PaymentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Format time for display
  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Calculate end time
  const getEndTime = () => {
    const [hours, minutes] = startTime.split(':')
    const startHour = parseInt(hours, 10)
    const startMinute = parseInt(minutes, 10)
    const durationMinutes = service.duration

    let endHour = startHour + Math.floor((startMinute + durationMinutes) / 60)
    const endMinute = (startMinute + durationMinutes) % 60

    const ampm = endHour >= 12 ? 'PM' : 'AM'
    const displayHour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour

    return `${displayHour}:${endMinute.toString().padStart(2, '0')} ${ampm}`
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!acceptTerms) newErrors.acceptTerms = 'You must accept the terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      acceptTerms: true,
    })

    if (validate()) {
      onSubmit()
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const getTimezoneAbbr = (tz: string) => {
    const abbrevs: Record<string, string> = {
      'America/New_York': 'ET',
      'America/Chicago': 'CT',
      'America/Denver': 'MT',
      'America/Los_Angeles': 'PT',
      'Europe/London': 'GMT',
      'Europe/Paris': 'CET',
      'Asia/Tokyo': 'JST',
      'Asia/Singapore': 'SGT',
      'Australia/Sydney': 'AEDT',
    }
    return abbrevs[tz] || tz
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Complete Your Booking
        </h2>
        <p className="text-gray-600 mt-1">
          Review your booking details and complete payment
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback>
              {expert.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{expert.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">
              {expert.headline}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service</span>
            <span className="font-medium text-gray-900">{service.name}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Date
            </span>
            <span className="font-medium text-gray-900">
              {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Time
            </span>
            <span className="font-medium text-gray-900">
              {formatTimeSlot(startTime)} - {getEndTime()} ({getTimezoneAbbr(timezone)})
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium text-gray-900">
              {service.duration} minutes
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900 text-lg">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Your Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              First name <span className="text-error">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2',
                touched.firstName && errors.firstName
                  ? 'border-error focus:ring-error/20'
                  : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
              )}
            />
            {touched.firstName && errors.firstName && (
              <p className="text-sm text-error mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Last name <span className="text-error">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2',
                touched.lastName && errors.lastName
                  ? 'border-error focus:ring-error/20'
                  : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
              )}
            />
            {touched.lastName && errors.lastName && (
              <p className="text-sm text-error mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email address <span className="text-error">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="you@example.com"
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2',
              touched.email && errors.email
                ? 'border-error focus:ring-error/20'
                : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            )}
          />
          {touched.email && errors.email && (
            <p className="text-sm text-error mt-1">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Phone <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Company <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => onFieldChange('company', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Payment Method (Stub) */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Payment Method</h3>

        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3 text-gray-500">
            <CreditCard className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Secure payment via Stripe
              </p>
              <p className="text-xs text-gray-500">
                Payment details will be collected securely
              </p>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">VISA</span>
              </div>
              <div className="w-8 h-5 bg-[#EB001B] rounded flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">MC</span>
              </div>
              <div className="w-8 h-5 bg-[#006FCF] rounded flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">AMEX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => onFieldChange('acceptTerms', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            . I understand that my card will be charged {formatPrice(service.price)} upon booking
            confirmation.
          </span>
        </label>
        {touched.acceptTerms && errors.acceptTerms && (
          <p className="text-sm text-error mt-1 ml-7">{errors.acceptTerms}</p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="h-5 w-5 text-success" />
          <span>Satisfaction Guaranteed</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock className="h-5 w-5 text-success" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            'flex-1 py-3 px-6 rounded-lg font-medium transition-colors',
            'bg-primary text-white hover:bg-primary-dark',
            isSubmitting && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ${formatPrice(service.price)}`
          )}
        </button>
      </div>
    </div>
  )
}
