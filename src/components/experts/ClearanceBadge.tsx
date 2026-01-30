'use client'

import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClearanceLevel } from '@/types'

interface ClearanceBadgeProps {
  level: ClearanceLevel
  verified?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const clearanceConfig: Record<
  ClearanceLevel,
  {
    label: string
    shortLabel: string
    description: string
    icon: typeof Shield
    colors: string
    iconColors: string
    tier: number // For sorting/filtering
  }
> = {
  none: {
    label: 'No Clearance',
    shortLabel: 'None',
    description: 'No security clearance required',
    icon: Shield,
    colors: 'bg-gray-100 text-gray-500 border-gray-200',
    iconColors: 'text-gray-400',
    tier: 0,
  },
  'public-trust': {
    label: 'Public Trust',
    shortLabel: 'Public Trust',
    description: 'Public Trust position clearance',
    icon: Shield,
    colors: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColors: 'text-blue-500',
    tier: 1,
  },
  secret: {
    label: 'Secret',
    shortLabel: 'Secret',
    description: 'Secret security clearance',
    icon: ShieldCheck,
    colors: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColors: 'text-amber-500',
    tier: 2,
  },
  'top-secret': {
    label: 'Top Secret',
    shortLabel: 'TS',
    description: 'Top Secret security clearance',
    icon: ShieldCheck,
    colors: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColors: 'text-orange-500',
    tier: 3,
  },
  'ts-sci': {
    label: 'TS/SCI',
    shortLabel: 'TS/SCI',
    description: 'Top Secret with Sensitive Compartmented Information',
    icon: ShieldAlert,
    colors: 'bg-red-50 text-red-700 border-red-200',
    iconColors: 'text-red-500',
    tier: 4,
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

export function ClearanceBadge({
  level,
  verified = false,
  size = 'md',
  showLabel = true,
  className,
}: ClearanceBadgeProps) {
  // Don't show badge for 'none' clearance level
  if (level === 'none') {
    return null
  }

  const config = clearanceConfig[level]
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
      title={`${config.description}${verified ? ' (Verified)' : ''}`}
    >
      <Icon className={cn(sizes.icon, config.iconColors)} />
      {showLabel && (
        <span>
          {size === 'sm' ? config.shortLabel : config.label}
          {verified && (
            <span className="ml-0.5 text-success">*</span>
          )}
        </span>
      )}
    </span>
  )
}

// Helper to get clearance info
export function getClearanceInfo(level: ClearanceLevel) {
  return clearanceConfig[level]
}

// Helper to compare clearance levels
export function compareClearanceLevels(
  a: ClearanceLevel,
  b: ClearanceLevel
): number {
  return clearanceConfig[a].tier - clearanceConfig[b].tier
}
