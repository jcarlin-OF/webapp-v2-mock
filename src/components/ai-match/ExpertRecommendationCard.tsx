'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn, formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, ArrowRight } from 'lucide-react'
import type { ExpertRecommendation } from '@/lib/ai-match/types'

interface ExpertRecommendationCardProps {
  recommendation: ExpertRecommendation
  className?: string
}

export function ExpertRecommendationCard({
  recommendation,
  className,
}: ExpertRecommendationCardProps) {
  const { expert, matchScore, matchReasons, relevantExpertise } = recommendation

  // Get minimum session price
  const minPrice = Math.min(...expert.services.map((s) => s.price))

  return (
    <Link
      href={`/experts/${expert.slug}`}
      className={cn(
        'group block rounded-xl border bg-card p-4 hover:shadow-card hover:border-primary/30 transition-all',
        className
      )}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden relative">
            <Image
              src={expert.avatar}
              alt={expert.name}
              fill
              className="object-cover"
            />
          </div>
          {expert.verified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                {expert.name}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {expert.headline}
              </p>
            </div>
            <Badge
              variant={matchScore >= 70 ? 'default' : 'secondary'}
              className="flex-shrink-0 font-semibold"
            >
              {matchScore}% Match
            </Badge>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2 mb-3">
            <Star className="h-3.5 w-3.5 text-warning fill-warning" />
            <span className="text-sm font-medium">{expert.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({expert.reviewCount} reviews)
            </span>
            <span className="text-sm text-muted-foreground mx-1">|</span>
            <span className="text-sm font-medium text-primary">
              From {formatPrice(minPrice)}
            </span>
          </div>

          {/* Relevant expertise tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {relevantExpertise.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs bg-primary/5 border-primary/20 text-primary"
              >
                {skill}
              </Badge>
            ))}
            {relevantExpertise.length > 3 && (
              <Badge variant="muted" className="text-xs">
                +{relevantExpertise.length - 3}
              </Badge>
            )}
          </div>

          {/* Match reason */}
          {matchReasons.length > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-primary rounded-full" />
              {matchReasons[0]}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Link>
  )
}
