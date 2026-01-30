'use client'

import { useState, useCallback } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Expert, Service } from '@/types'
import { type BookingStep, initialBookingState } from '@/lib/validations/booking'
import { createBooking } from '@/mock/data/bookings'

import { ServiceStep } from './ServiceStep'
import { TimeSlotPicker } from './TimeSlotPicker'
import { DetailsStep } from './DetailsStep'
import { PaymentStep } from './PaymentStep'
import { BookingConfirmation } from './BookingConfirmation'
import { toast } from '@/hooks/use-toast'

interface BookingWizardProps {
  expert: Expert
}

const steps: { id: BookingStep; label: string; shortLabel: string }[] = [
  { id: 'service', label: 'Select Service', shortLabel: 'Service' },
  { id: 'time', label: 'Choose Time', shortLabel: 'Time' },
  { id: 'details', label: 'Your Details', shortLabel: 'Details' },
  { id: 'payment', label: 'Payment', shortLabel: 'Payment' },
]

export function BookingWizard({ expert }: BookingWizardProps) {
  const [state, setState] = useState({
    ...initialBookingState,
    expertId: expert.id,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current step index
  const currentStepIndex = state.step === 'confirmation'
    ? steps.length
    : steps.findIndex((s) => s.id === state.step)

  // Get selected service
  const selectedService = state.serviceId
    ? expert.services.find((s) => s.id === state.serviceId)
    : null

  // Step navigation
  const goToStep = useCallback((step: BookingStep) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  // Service step handlers
  const handleServiceSelect = useCallback((serviceId: string) => {
    setState((prev) => ({ ...prev, serviceId }))
  }, [])

  const handleServiceContinue = useCallback(() => {
    if (state.serviceId) {
      goToStep('time')
    }
  }, [state.serviceId, goToStep])

  // Time step handlers
  const handleDateSelect = useCallback((date: string) => {
    setState((prev) => ({ ...prev, date, startTime: null }))
  }, [])

  const handleTimeSelect = useCallback((startTime: string) => {
    setState((prev) => ({ ...prev, startTime }))
  }, [])

  const handleTimezoneChange = useCallback((timezone: string) => {
    setState((prev) => ({ ...prev, timezone }))
  }, [])

  const handleTimeContinue = useCallback(() => {
    if (state.date && state.startTime) {
      goToStep('details')
    }
  }, [state.date, state.startTime, goToStep])

  // Details step handlers
  const handleAgendaChange = useCallback((agenda: string) => {
    setState((prev) => ({ ...prev, agenda }))
  }, [])

  const handleSpecialRequestsChange = useCallback((specialRequests: string) => {
    setState((prev) => ({ ...prev, specialRequests }))
  }, [])

  const handleDetailsContinue = useCallback(() => {
    if (state.agenda.length >= 10) {
      goToStep('payment')
    }
  }, [state.agenda, goToStep])

  // Payment step handlers
  const handleFieldChange = useCallback((field: string, value: string | boolean) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePaymentSubmit = useCallback(async () => {
    if (!selectedService) return

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Calculate end time
      const [hours, minutes] = state.startTime!.split(':')
      const startHour = parseInt(hours, 10)
      const startMinute = parseInt(minutes, 10)
      const durationMinutes = selectedService.duration

      let endHour = startHour + Math.floor((startMinute + durationMinutes) / 60)
      const endMinute = (startMinute + durationMinutes) % 60
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

      // Create booking (mock)
      const booking = createBooking({
        expertId: expert.id,
        expert: {
          id: expert.id,
          name: expert.name,
          avatar: expert.avatar,
          headline: expert.headline,
        },
        clientId: 'user_guest', // Guest user
        serviceId: state.serviceId!,
        service: selectedService,
        date: state.date!,
        startTime: state.startTime!,
        endTime,
        agenda: state.agenda,
        price: selectedService.price,
      })

      toast({
        title: 'Booking confirmed!',
        description: `Your session with ${expert.name} has been scheduled.`,
        variant: 'success',
      })

      setState((prev) => ({
        ...prev,
        step: 'confirmation',
        bookingId: booking.id,
        endTime,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to create booking. Please try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }, [expert, selectedService, state])

  // Render progress stepper (hide on confirmation)
  const renderStepper = () => {
    if (state.step === 'confirmation') return null

    return (
      <div className="mb-8">
        {/* Desktop stepper */}
        <div className="hidden sm:flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                      isCompleted
                        ? 'bg-primary text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'ml-3 text-sm font-medium',
                      isCurrent ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4',
                      index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      isCompleted
                        ? 'bg-primary text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2',
                        index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-sm font-medium text-gray-900 text-center">
            Step {currentStepIndex + 1}: {steps[currentStepIndex]?.label}
          </p>
        </div>
      </div>
    )
  }

  // Render current step
  const renderStep = () => {
    switch (state.step) {
      case 'service':
        return (
          <ServiceStep
            services={expert.services}
            selectedServiceId={state.serviceId}
            onSelect={handleServiceSelect}
            onContinue={handleServiceContinue}
          />
        )

      case 'time':
        return (
          <TimeSlotPicker
            slots={expert.availability.slots}
            selectedDate={state.date}
            selectedTime={state.startTime}
            timezone={state.timezone}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onTimezoneChange={handleTimezoneChange}
            onContinue={handleTimeContinue}
            onBack={() => goToStep('service')}
          />
        )

      case 'details':
        return (
          <DetailsStep
            agenda={state.agenda}
            specialRequests={state.specialRequests}
            onAgendaChange={handleAgendaChange}
            onSpecialRequestsChange={handleSpecialRequestsChange}
            onContinue={handleDetailsContinue}
            onBack={() => goToStep('time')}
          />
        )

      case 'payment':
        if (!selectedService) return null
        return (
          <PaymentStep
            expert={expert}
            service={selectedService}
            date={state.date!}
            startTime={state.startTime!}
            timezone={state.timezone}
            firstName={state.firstName}
            lastName={state.lastName}
            email={state.email}
            phone={state.phone}
            company={state.company}
            acceptTerms={state.acceptTerms}
            onFieldChange={handleFieldChange}
            onSubmit={handlePaymentSubmit}
            onBack={() => goToStep('details')}
            isSubmitting={isSubmitting}
          />
        )

      case 'confirmation':
        if (!selectedService || !state.bookingId) return null
        return (
          <BookingConfirmation
            bookingId={state.bookingId}
            expert={expert}
            service={selectedService}
            date={state.date!}
            startTime={state.startTime!}
            timezone={state.timezone}
            clientName={`${state.firstName} ${state.lastName}`}
            clientEmail={state.email}
          />
        )

      default:
        return null
    }
  }

  return (
    <div>
      {renderStepper()}
      {renderStep()}
      {state.error && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {state.error}
        </div>
      )}
    </div>
  )
}
