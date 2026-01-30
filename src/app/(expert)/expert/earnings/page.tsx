'use client'

import { useSession } from 'next-auth/react'
import { format, subDays } from 'date-fns'
import {
  DollarSign,
  TrendingUp,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { DashboardHeader, StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getBookingsByExpertId } from '@/mock/data/bookings'
import { getExpertUserData } from '@/mock/data/users'

export default function ExpertEarningsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_exp_001'

  const expertUserData = getExpertUserData(userId)
  const expertId = expertUserData?.expert?.id || 'exp_001'
  const earnings = expertUserData?.earnings

  // Get completed bookings for transactions
  const completedBookings = getBookingsByExpertId(expertId).filter(
    (b) => b.status === 'completed'
  )

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  // Mock payout history
  const payouts = [
    {
      id: 'pay_001',
      amount: 350000,
      date: subDays(new Date(), 14),
      status: 'completed',
    },
    {
      id: 'pay_002',
      amount: 425000,
      date: subDays(new Date(), 44),
      status: 'completed',
    },
    {
      id: 'pay_003',
      amount: 287500,
      date: subDays(new Date(), 74),
      status: 'completed',
    },
  ]

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Earnings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/expert/dashboard' },
          { label: 'Earnings' },
        ]}
        showMenuButton={false}
        actions={
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        }
      />

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-4xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(earnings?.available || 0)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <StatsCard
          label="Pending Earnings"
          value={formatCurrency(earnings?.pending || 0)}
          icon={Clock}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Earned (All Time)"
          value={formatCurrency(earnings?.total || 0)}
          icon={DollarSign}
        />
        <StatsCard
          label="Completed Sessions"
          value={completedBookings.length}
          icon={TrendingUp}
        />
        <StatsCard
          label="Average Per Session"
          value={formatCurrency(
            completedBookings.length > 0
              ? completedBookings.reduce((sum, b) => sum + b.price, 0) /
                  completedBookings.length
              : 0
          )}
          icon={DollarSign}
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Session with Client
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.service.name} &middot;{' '}
                      {format(new Date(booking.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    +{formatCurrency(booking.price)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}

            {completedBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-500">
                      {format(payout.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(payout.amount)}
                  </p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      payout.status === 'completed' &&
                        'bg-green-100 text-green-700'
                    )}
                  >
                    {payout.status === 'completed' ? 'Paid' : 'Processing'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
