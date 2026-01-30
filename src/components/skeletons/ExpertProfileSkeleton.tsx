import { Skeleton } from '@/components/ui/skeleton'
import { Container } from '@/components/layout'

export function ExpertProfileSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <Container className="py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Profile Header */}
            <section className="bg-white rounded-xl border p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shrink-0" />

                {/* Info */}
                <div className="flex-1">
                  {/* Name */}
                  <Skeleton className="h-8 w-48 sm:h-9" />
                  {/* Headline */}
                  <Skeleton className="h-5 w-64 mt-2" />

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-28" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-18 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-1 flex gap-1">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>

              {/* Bio Section */}
              <section className="bg-white rounded-xl border p-6 lg:p-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </section>

              {/* Credentials Section */}
              <section className="bg-white rounded-xl border p-6 lg:p-8">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:w-96 shrink-0 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6">
                <Skeleton className="h-9 w-24 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto mt-1" />
              </div>

              {/* Services */}
              <div className="space-y-3 mb-6">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-20 mt-2" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </div>
                ))}
              </div>

              {/* Availability */}
              <Skeleton className="h-4 w-40 mb-6" />

              {/* CTA */}
              <Skeleton className="h-11 w-full rounded-md" />

              {/* Trust Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-44 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  )
}
