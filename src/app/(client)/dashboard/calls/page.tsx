'use client'

import { useSession } from 'next-auth/react'
import { Calendar, History } from 'lucide-react'
import { DashboardHeader, CallCard } from '@/components/dashboard'
import { EmptyBookings } from '@/components/empty-states'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUpcomingBookings, getPastBookings } from '@/mock/data/bookings'

export default function ClientCallsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_001'

  const upcomingBookings = getUpcomingBookings(userId)
  const pastBookings = getPastBookings(userId)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Calls"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Calls' },
        ]}
        showMenuButton={false}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <CallCard key={booking.id} booking={booking} variant="client" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <EmptyBookings
                title="No upcoming calls"
                description="You don't have any upcoming calls scheduled. Find an expert to book your first consultation."
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <CallCard key={booking.id} booking={booking} variant="client" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <EmptyBookings
                title="No past calls"
                description="Your call history will appear here after you complete your first consultation."
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
