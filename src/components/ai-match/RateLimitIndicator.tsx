'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, XCircle } from 'lucide-react'

interface RateLimitIndicatorProps {
  messagesRemaining: number
  maxMessages: number
  className?: string
}

export function RateLimitIndicator({
  messagesRemaining,
  maxMessages,
  className,
}: RateLimitIndicatorProps) {
  const percentage = (messagesRemaining / maxMessages) * 100
  const isWarning = messagesRemaining <= 5 && messagesRemaining > 0
  const isError = messagesRemaining <= 0

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {isError ? (
        <XCircle className="h-4 w-4 text-error" />
      ) : isWarning ? (
        <AlertTriangle className="h-4 w-4 text-warning" />
      ) : null}

      <div className="flex-1 max-w-32">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isError
                ? 'bg-error'
                : isWarning
                  ? 'bg-warning'
                  : 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <span
        className={cn(
          'text-sm font-medium',
          isError
            ? 'text-error'
            : isWarning
              ? 'text-warning'
              : 'text-muted-foreground'
        )}
      >
        {isError
          ? 'Limit reached'
          : `${messagesRemaining} message${messagesRemaining !== 1 ? 's' : ''} remaining`}
      </span>
    </div>
  )
}
