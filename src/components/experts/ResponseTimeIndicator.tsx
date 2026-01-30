'use client'

import { Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResponseTimeIndicatorProps {
  /** Average response time in minutes */
  responseTime?: number
  /** Last active timestamp (ISO date) */
  lastActiveAt?: string
  /** Visual variant */
  variant?: 'default' | 'compact' | 'badge'
  className?: string
}

function formatResponseTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  const days = Math.round(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''}`
}

function getResponseCategory(
  minutes: number
): 'fast' | 'moderate' | 'slow' {
  if (minutes <= 60) return 'fast' // Within 1 hour
  if (minutes <= 240) return 'moderate' // Within 4 hours
  return 'slow'
}

function getLastActiveText(lastActiveAt: string): string {
  const now = new Date()
  const lastActive = new Date(lastActiveAt)
  const diffMs = now.getTime() - lastActive.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 5) return 'Active now'
  if (diffMins < 60) return `Active ${diffMins}m ago`
  if (diffHours < 24) return `Active ${diffHours}h ago`
  if (diffDays < 7) return `Active ${diffDays}d ago`
  return `Active ${Math.floor(diffDays / 7)}w ago`
}

const categoryColors = {
  fast: 'text-success',
  moderate: 'text-warning',
  slow: 'text-gray-400',
}

export function ResponseTimeIndicator({
  responseTime,
  lastActiveAt,
  variant = 'default',
  className,
}: ResponseTimeIndicatorProps) {
  if (!responseTime && !lastActiveAt) {
    return null
  }

  const category = responseTime ? getResponseCategory(responseTime) : 'moderate'
  const isFast = category === 'fast'

  if (variant === 'badge') {
    if (!responseTime) return null
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
          isFast
            ? 'bg-success/10 text-success'
            : 'bg-gray-100 text-gray-600',
          className
        )}
      >
        {isFast ? (
          <Zap className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {formatResponseTime(responseTime)}
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1 text-xs', className)}>
        <Clock className={cn('h-3 w-3', categoryColors[category])} />
        <span className="text-gray-500">
          {responseTime
            ? `Responds in ${formatResponseTime(responseTime)}`
            : lastActiveAt
              ? getLastActiveText(lastActiveAt)
              : null}
        </span>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('space-y-1', className)}>
      {responseTime && (
        <div className="flex items-center gap-1.5">
          {isFast ? (
            <Zap className="h-4 w-4 text-success" />
          ) : (
            <Clock className={cn('h-4 w-4', categoryColors[category])} />
          )}
          <span className="text-sm text-gray-600">
            Usually responds in{' '}
            <span className={cn('font-medium', categoryColors[category])}>
              {formatResponseTime(responseTime)}
            </span>
          </span>
        </div>
      )}
      {lastActiveAt && (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              new Date().getTime() - new Date(lastActiveAt).getTime() < 300000
                ? 'bg-success'
                : 'bg-gray-300'
            )}
          />
          <span className="text-xs text-gray-500">
            {getLastActiveText(lastActiveAt)}
          </span>
        </div>
      )}
    </div>
  )
}
