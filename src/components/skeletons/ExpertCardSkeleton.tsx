import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ExpertCardSkeletonProps {
  variant?: 'default' | 'compact'
}

export function ExpertCardSkeleton({
  variant = 'default',
}: ExpertCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 overflow-hidden',
        variant === 'compact' ? 'p-4' : 'p-5'
      )}
    >
      {/* Expert Info */}
      <div className="flex gap-4">
        {/* Avatar */}
        <Skeleton
          className={cn(
            'shrink-0 rounded-full',
            variant === 'compact' ? 'h-14 w-14' : 'h-16 w-16'
          )}
        />

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <Skeleton className="h-5 w-32" />

          {/* Headline */}
          <Skeleton className="h-4 w-48 mt-2" />

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Tags */}
      {variant === 'default' && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      )}

      {/* Price and Availability */}
      <div
        className={cn(
          'flex items-center justify-between border-t border-gray-100',
          variant === 'compact' ? 'mt-3 pt-3' : 'mt-4 pt-4'
        )}
      >
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}
