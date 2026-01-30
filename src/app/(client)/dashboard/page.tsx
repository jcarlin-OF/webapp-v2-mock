'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Calendar, CheckCircle, Heart, ArrowRight, Search } from 'lucide-react'
import { DashboardHeader, StatsCard, CallCard } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUpcomingBookings, getPastBookings } from '@/mock/data/bookings'
import { getUserById } from '@/mock/data/users'

export default function ClientDashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_001'

  // Get mock data
  const upcomingBookings = getUpcomingBookings(userId)
  const pastBookings = getPastBookings(userId)
  const mockUser = getUserById(userId)
  const savedExpertsCount = mockUser?.savedExperts?.length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title={`Welcome back, ${session?.user?.name?.split(' ')[0] || 'there'}!`}
        showMenuButton={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Upcoming Calls"
          value={upcomingBookings.length}
          icon={Calendar}
        />
        <StatsCard
          label="Completed Calls"
          value={pastBookings.filter((b) => b.status === 'completed').length}
          icon={CheckCircle}
        />
        <StatsCard
          label="Saved Experts"
          value={savedExpertsCount}
          icon={Heart}
        />
      </div>

      {/* Upcoming Calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-heading">Upcoming Calls</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/calls" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <CallCard key={booking.id} booking={booking} variant="client" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No upcoming calls scheduled</p>
              <Button asChild>
                <Link href="/experts">Find an Expert</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/experts" className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Experts</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Discover world-class experts across various industries
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/dashboard/saved" className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Saved Experts</h3>
                <p className="text-sm text-gray-500 mt-1">
                  View and book from your saved list of experts
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed Calls */}
      {pastBookings.filter((b) => b.status === 'completed').length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-heading">Recent Calls</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/calls" className="flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastBookings
                .filter((b) => b.status === 'completed')
                .slice(0, 2)
                .map((booking) => (
                  <CallCard key={booking.id} booking={booking} variant="client" />
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
