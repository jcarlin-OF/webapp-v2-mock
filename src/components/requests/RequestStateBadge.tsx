'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ExpertRequestState } from '@/types'

interface RequestStateBadgeProps {
  state: ExpertRequestState
  className?: string
}

const stateConfig: Record<
  ExpertRequestState,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  open: {
    label: 'Open',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

export function RequestStateBadge({ state, className }: RequestStateBadgeProps) {
  const config = stateConfig[state]

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  )
}
