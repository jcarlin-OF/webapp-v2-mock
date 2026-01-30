'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Calendar,
  DollarSign,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { DashboardHeader, StatsCard, CallCard } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getExpertPendingRequests,
  getExpertUpcomingCalls,
  getBookingsByExpertId,
} from '@/mock/data/bookings'
import { getExpertUserData } from '@/mock/data/users'

export default function ExpertDashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_exp_001'

  // Get expert data
  const expertUserData = getExpertUserData(userId)
  const expertId = expertUserData?.expert?.id || 'exp_001'

  // Get booking data
  const pendingRequests = getExpertPendingRequests(expertId)
  const upcomingCalls = getExpertUpcomingCalls(expertId)
  const allBookings = getBookingsByExpertId(expertId)
  const completedCalls = allBookings.filter((b) => b.status === 'completed')

  // Calculate earnings
  const totalEarnings = expertUserData?.earnings?.total || 0
  const pendingEarnings = expertUserData?.earnings?.pending || 0

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title={`Welcome back, ${session?.user?.name?.split(' ')[0] || 'Expert'}!`}
        showMenuButton={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Pending Requests"
          value={pendingRequests.length}
          icon={Clock}
        />
        <StatsCard
          label="Upcoming Calls"
          value={upcomingCalls.length}
          icon={Calendar}
        />
        <StatsCard
          label="Total Earnings"
          value={formatCurrency(totalEarnings)}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          label="Rating"
          value={expertUserData?.expert?.rating?.toFixed(2) || '5.00'}
          icon={Star}
        />
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/expert/requests" className="flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.slice(0, 2).map((booking) => (
                <CallCard
                  key={booking.id}
                  booking={booking}
                  variant="expert"
                  onAccept={(id) => console.log('Accept:', id)}
                  onDecline={(id) => console.log('Decline:', id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-heading">Upcoming Calls</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/expert/schedule" className="flex items-center gap-1">
              View Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingCalls.length > 0 ? (
            <div className="space-y-4">
              {upcomingCalls.slice(0, 3).map((booking) => (
                <CallCard key={booking.id} booking={booking} variant="expert" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming calls scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-heading">Earnings Summary</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/expert/earnings" className="flex items-center gap-1">
                Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Available Balance</span>
                <span className="text-xl font-semibold text-gray-900">
                  {formatCurrency(expertUserData?.earnings?.available || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pending</span>
                <span className="text-gray-600">
                  {formatCurrency(pendingEarnings)}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Sessions</span>
                <span className="font-medium">{completedCalls.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Reviews</span>
                <span className="font-medium">
                  {expertUserData?.expert?.reviewCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Profile Views</span>
                <span className="font-medium">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
