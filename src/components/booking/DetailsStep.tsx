'use client'

import { useState } from 'react'
import { FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DetailsStepProps {
  agenda: string
  specialRequests: string
  onAgendaChange: (value: string) => void
  onSpecialRequestsChange: (value: string) => void
  onContinue: () => void
  onBack: () => void
}

export function DetailsStep({
  agenda,
  specialRequests,
  onAgendaChange,
  onSpecialRequestsChange,
  onContinue,
  onBack,
}: DetailsStepProps) {
  const [touched, setTouched] = useState(false)

  const minLength = 10
  const maxLength = 2000
  const isValid = agenda.length >= minLength
  const showError = touched && !isValid

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Tell Us What You Want to Discuss
        </h2>
        <p className="text-gray-600 mt-1">
          Help the expert prepare by sharing your goals and questions
        </p>
      </div>

      {/* Agenda/Questions */}
      <div className="space-y-2">
        <label
          htmlFor="agenda"
          className="block text-sm font-medium text-gray-700"
        >
          Your agenda & questions <span className="text-error">*</span>
        </label>
        <div className="relative">
          <textarea
            id="agenda"
            value={agenda}
            onChange={(e) => onAgendaChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="What specific challenges or questions would you like to discuss? The more context you provide, the more valuable your session will be."
            rows={6}
            maxLength={maxLength}
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2',
              showError
                ? 'border-error focus:ring-error/20 focus:border-error'
                : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            )}
          />
          <div className="flex justify-between mt-1.5">
            {showError ? (
              <span className="text-sm text-error flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Please provide at least {minLength} characters
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                Minimum {minLength} characters
              </span>
            )}
            <span className="text-sm text-gray-500">
              {agenda.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Tips for a great session
            </h4>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Be specific about your current situation and challenges
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                List 2-3 key questions you want answered
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Share relevant context (company stage, industry, goals)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Mention any specific areas of the expert's background you want to explore
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Special Requests (optional) */}
      <div className="space-y-2">
        <label
          htmlFor="special-requests"
          className="block text-sm font-medium text-gray-700"
        >
          Special requests <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="special-requests"
          value={specialRequests}
          onChange={(e) => onSpecialRequestsChange(e.target.value)}
          placeholder="Any preferences for the call format, accessibility needs, or other requests?"
          rows={2}
          maxLength={500}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <div className="text-right">
          <span className="text-sm text-gray-500">
            {specialRequests.length}/500
          </span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            setTouched(true)
            if (isValid) {
              onContinue()
            }
          }}
          disabled={!isValid}
          className={cn(
            'flex-1 py-3 px-6 rounded-lg font-medium transition-colors',
            isValid
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}
