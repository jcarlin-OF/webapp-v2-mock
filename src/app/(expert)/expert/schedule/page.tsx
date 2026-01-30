'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, Video } from 'lucide-react'
import { DashboardHeader, CallCard } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getExpertUpcomingCalls, getBookingsByExpertId } from '@/mock/data/bookings'
import { getExpertUserData } from '@/mock/data/users'

export default function ExpertSchedulePage() {
  const { data: session } = useSession()
  const userId = session?.user?.id || 'user_exp_001'

  const expertUserData = getExpertUserData(userId)
  const expertId = expertUserData?.expert?.id || 'exp_001'

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get all bookings for this expert (confirmed only for schedule)
  const allBookings = getBookingsByExpertId(expertId).filter(
    (b) => b.status === 'confirmed'
  )

  // Get bookings for selected date
  const selectedDateBookings = allBookings.filter((booking) =>
    isSameDay(parseISO(booking.date), selectedDate)
  )

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  )

  // Check if a date has bookings
  const hasBookings = (date: Date) =>
    allBookings.some((b) => isSameDay(parseISO(b.date), date))

  const goToPreviousWeek = () =>
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  const goToNextWeek = () =>
    setCurrentWeekStart(addDays(currentWeekStart, 7))

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Schedule"
        breadcrumbs={[
          { label: 'Dashboard', href: '/expert/dashboard' },
          { label: 'Schedule' },
        ]}
        showMenuButton={false}
      />

      {/* Week Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="font-medium">
            {format(currentWeekStart, 'MMMM d')} -{' '}
            {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </span>
          <Button variant="ghost" size="sm" onClick={goToNextWeek}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())
              const hasCalls = hasBookings(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'p-3 rounded-lg text-center transition-all',
                    isSelected
                      ? 'bg-primary text-white'
                      : isToday
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100'
                  )}
                >
                  <div className="text-xs font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-semibold mt-1',
                      isSelected && 'text-white'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  {hasCalls && (
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full mx-auto mt-1',
                        isSelected ? 'bg-white' : 'bg-primary'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(selectedDate, 'EEEE, MMMM d')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateBookings.length > 0 ? (
            <div className="space-y-4">
              {selectedDateBookings.map((booking) => (
                <CallCard key={booking.id} booking={booking} variant="expert" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No calls scheduled for this day</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Calls List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">
            All Upcoming Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allBookings.filter((b) => parseISO(b.date) >= new Date()).length > 0 ? (
            <div className="space-y-4">
              {allBookings
                .filter((b) => parseISO(b.date) >= new Date())
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((booking) => (
                  <CallCard key={booking.id} booking={booking} variant="expert" />
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming calls</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
