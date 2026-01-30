import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Skeleton className="h-8 w-64" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calls Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CallCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CallCardSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48 mt-1" />
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-9 w-20 rounded-md shrink-0" />
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
