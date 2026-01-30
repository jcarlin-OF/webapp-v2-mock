'use client'

import { Clock, Check } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceStepProps {
  services: Service[]
  selectedServiceId: string | null
  onSelect: (serviceId: string) => void
  onContinue: () => void
}

export function ServiceStep({
  services,
  selectedServiceId,
  onSelect,
  onContinue,
}: ServiceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Select a Service
        </h2>
        <p className="text-gray-600 mt-1">
          Choose the consultation type that best fits your needs
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={cn(
                'w-full text-left p-6 rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {service.duration} min
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1.5">{service.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xl font-semibold text-gray-900">
                    {formatPrice(service.price)}
                  </span>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedServiceId}
          className={cn(
            'w-full py-3 px-6 rounded-lg font-medium transition-colors',
            selectedServiceId
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          Continue to Schedule
        </button>
      </div>
    </div>
  )
}
