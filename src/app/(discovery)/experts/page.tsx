import { Suspense } from 'react'
import { ExpertsContent } from './experts-content'
import { Container } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

function ExpertsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <Container className="py-6">
          <Skeleton className="h-9 w-48 mb-4" />
          <Skeleton className="h-11 w-full" />
        </Container>
      </div>
      <Container className="py-8">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </Container>
    </main>
  )
}

export default function ExpertsPage() {
  return (
    <Suspense fallback={<ExpertsLoading />}>
      <ExpertsContent />
    </Suspense>
  )
}
