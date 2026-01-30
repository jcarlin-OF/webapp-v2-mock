'use client'

import Link from 'next/link'
import { Calendar, Users, CheckCircle, Building2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RequestStateBadge } from './RequestStateBadge'
import { cn, formatDate } from '@/lib/utils'
import type { ExpertRequest } from '@/types'

interface ExpertRequestCardProps {
  request: ExpertRequest
  variant?: 'default' | 'compact'
  className?: string
}

export function ExpertRequestCard({
  request,
  variant = 'default',
  className,
}: ExpertRequestCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className={cn('pb-2', isCompact && 'p-4')}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <RequestStateBadge state={request.state} />
              {request.agency && (
                <Badge variant="muted" className="font-normal">
                  <Building2 className="h-3 w-3 mr-1" />
                  {request.agency}
                </Badge>
              )}
            </div>
            <CardTitle
              className={cn(
                'line-clamp-2 font-heading',
                isCompact ? 'text-base' : 'text-lg'
              )}
            >
              <Link
                href={`/dashboard/requests/${request.id}`}
                className="hover:text-primary transition-colors"
              >
                {request.title}
              </Link>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(isCompact && 'p-4 pt-0')}>
        {!isCompact && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {request.description}
          </p>
        )}

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {request.requiredExpertise.slice(0, 4).map((expertise) => (
            <Badge key={expertise} variant="secondary" className="text-xs">
              {expertise}
            </Badge>
          ))}
          {request.requiredExpertise.length > 4 && (
            <Badge variant="muted" className="text-xs">
              +{request.requiredExpertise.length - 4} more
            </Badge>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{request.candidateCount} candidates</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>{request.matchedCount} matched</span>
            </div>
            {request.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Due {formatDate(request.deadline)}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/dashboard/requests/${request.id}`}
              className="flex items-center gap-1"
            >
              View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
