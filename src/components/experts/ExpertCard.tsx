'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { Heart, Star, CheckCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ExpertStatusBadge } from './ExpertStatusBadge'
import { ResponseTimeIndicator } from './ResponseTimeIndicator'
import { ClearanceBadge } from './ClearanceBadge'
import type { Expert } from '@/types'

interface ExpertCardProps {
  expert: Expert
  onSave?: (expertId: string) => void
  isSaved?: boolean
  variant?: 'default' | 'compact'
}

export function ExpertCard({
  expert,
  onSave,
  isSaved = false,
  variant = 'default',
}: ExpertCardProps) {
  const minPrice = Math.min(...expert.services.map((s) => s.price))
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(minPrice / 100)

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave?.(expert.id)
  }

  return (
    <Link href={`/experts/${expert.slug}`} className="group block">
      <article
        className={cn(
          'relative bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-200',
          'hover:shadow-card-hover hover:-translate-y-0.5',
          variant === 'compact' ? 'p-4' : 'p-5'
        )}
      >
        {/* Save Button */}
        {onSave && (
          <button
            onClick={handleSaveClick}
            className={cn(
              'absolute top-4 right-4 z-10 p-2 rounded-full transition-colors',
              isSaved
                ? 'bg-error/10 text-error'
                : 'bg-gray-100/80 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            )}
            aria-label={isSaved ? 'Remove from saved' : 'Save expert'}
          >
            <Heart
              className={cn('h-4 w-4', isSaved && 'fill-current')}
            />
          </button>
        )}

        {/* Expert Info */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={cn(
                'relative overflow-hidden rounded-full',
                variant === 'compact' ? 'h-14 w-14' : 'h-16 w-16'
              )}
            >
              <Image
                src={expert.avatar}
                alt={expert.name}
                fill
                className="object-cover"
              />
            </div>
            {expert.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle className="h-4 w-4 text-primary fill-primary-light/30" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  'font-heading font-semibold text-gray-900 truncate',
                  variant === 'compact' ? 'text-base' : 'text-lg'
                )}
              >
                {expert.name}
              </h3>
            </div>

            <p
              className={cn(
                'text-gray-600 line-clamp-1 mt-0.5',
                variant === 'compact' ? 'text-sm' : 'text-sm'
              )}
            >
              {expert.headline}
            </p>

            {/* Rating & Response Time */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {expert.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  ({expert.reviewCount})
                </span>
              </div>
              {expert.responseTime && (
                <ResponseTimeIndicator
                  responseTime={expert.responseTime}
                  variant="badge"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tags & Badges */}
        {variant === 'default' && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {/* Status badge for non-claimed profiles */}
            {expert.profileStatus !== 'claimed' && (
              <ExpertStatusBadge status={expert.profileStatus} size="sm" />
            )}
            {/* Clearance badge if applicable */}
            {expert.clearanceLevel && expert.clearanceLevel !== 'none' && (
              <ClearanceBadge
                level={expert.clearanceLevel}
                verified={expert.clearanceVerified}
                size="sm"
              />
            )}
            {expert.expertise.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="muted" className="text-xs">
                {skill}
              </Badge>
            ))}
            {expert.expertise.length > 3 && (
              <Badge variant="muted" className="text-xs">
                +{expert.expertise.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Price and Availability */}
        <div
          className={cn(
            'flex items-center justify-between border-t border-gray-100',
            variant === 'compact' ? 'mt-3 pt-3' : 'mt-4 pt-4'
          )}
        >
          <div>
            <span className="text-lg font-semibold text-gray-900">
              {formattedPrice}
            </span>
            <span className="text-gray-500 text-sm">/session</span>
          </div>

          {expert.availability.nextAvailable && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(parseISO(expert.availability.nextAvailable), 'MMM d')}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
