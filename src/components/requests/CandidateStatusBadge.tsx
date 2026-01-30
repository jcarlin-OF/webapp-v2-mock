'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CandidateStatus } from '@/types'

interface CandidateStatusBadgeProps {
  status: CandidateStatus
  className?: string
}

const statusConfig: Record<
  CandidateStatus,
  { label: string; className: string }
> = {
  identified: {
    label: 'Identified',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  interested: {
    label: 'Interested',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  vetting: {
    label: 'Vetting',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  matched: {
    label: 'Matched',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

export function CandidateStatusBadge({
  status,
  className,
}: CandidateStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  )
}
