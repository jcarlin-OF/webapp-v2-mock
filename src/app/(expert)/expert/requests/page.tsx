'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Clock, CheckCircle } from 'lucide-react'
import { DashboardHeader, CallCard } from '@/components/dashboard'
import { getExpertPendingRequests, updateBookingStatus } from '@/mock/data/bookings'
import { getExpertUserData } from '@/mock/data/users'

export default function ExpertRequestsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_exp_001'

  const expertUserData = getExpertUserData(userId)
  const expertId = expertUserData?.expert?.id || 'exp_001'

  const [pendingRequests, setPendingRequests] = useState(() =>
    getExpertPendingRequests(expertId)
  )

  const handleAccept = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed')
    setPendingRequests((prev) => prev.filter((b) => b.id !== bookingId))
  }

  const handleDecline = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled')
    setPendingRequests((prev) => prev.filter((b) => b.id !== bookingId))
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Booking Requests"
        breadcrumbs={[
          { label: 'Dashboard', href: '/expert/dashboard' },
          { label: 'Requests' },
        ]}
        showMenuButton={false}
      />

      {pendingRequests.length > 0 ? (
        <div className="space-y-4">
          {pendingRequests.map((booking) => (
            <CallCard
              key={booking.id}
              booking={booking}
              variant="expert"
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-gray-200">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You have no pending booking requests. New requests will appear here
            when clients book consultations with you.
          </p>
        </div>
      )}
    </div>
  )
}
