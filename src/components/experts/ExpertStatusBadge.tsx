'use client'

import { CheckCircle2, Clock, UserX } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProfileStatus } from '@/types'

interface ExpertStatusBadgeProps {
  status: ProfileStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const statusConfig: Record<
  ProfileStatus,
  {
    label: string
    icon: typeof CheckCircle2
    colors: string
    iconColors: string
  }
> = {
  claimed: {
    label: 'Verified',
    icon: CheckCircle2,
    colors: 'bg-success/10 text-success border-success/20',
    iconColors: 'text-success',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    colors: 'bg-warning/10 text-warning border-warning/20',
    iconColors: 'text-warning',
  },
  unclaimed: {
    label: 'Unclaimed',
    icon: UserX,
    colors: 'bg-gray-100 text-gray-500 border-gray-200',
    iconColors: 'text-gray-400',
  },
}

const sizeConfig = {
  sm: {
    badge: 'px-1.5 py-0.5 text-xs gap-1',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'px-2 py-1 text-xs gap-1.5',
    icon: 'h-3.5 w-3.5',
  },
  lg: {
    badge: 'px-2.5 py-1.5 text-sm gap-2',
    icon: 'h-4 w-4',
  },
}

export function ExpertStatusBadge({
  status,
  size = 'md',
  showLabel = true,
  className,
}: ExpertStatusBadgeProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.colors,
        sizes.badge,
        className
      )}
    >
      <Icon className={cn(sizes.icon, config.iconColors)} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
