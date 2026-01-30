'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard'
import { ExpertCard } from '@/components/experts'
import { EmptySavedExperts } from '@/components/empty-states'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/mock/data/users'
import { getExpertById } from '@/mock/data/experts'
import type { Expert } from '@/types'

export default function SavedExpertsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_001'

  const mockUser = getUserById(userId)
  const savedExpertIds = mockUser?.savedExperts || []

  // Get full expert data for saved experts
  const savedExperts: Expert[] = savedExpertIds
    .map((id) => getExpertById(id))
    .filter((expert): expert is Expert => expert !== undefined)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Saved Experts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Saved Experts' },
        ]}
        showMenuButton={false}
        actions={
          savedExperts.length > 0 ? (
            <Button variant="outline" asChild>
              <Link href="/experts" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find More
              </Link>
            </Button>
          ) : null
        }
      />

      {savedExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <EmptySavedExperts
            description="When you find experts you're interested in, save them here for quick access later. Click the heart icon on any expert card to save them."
          />
        </div>
      )}
    </div>
  )
}
