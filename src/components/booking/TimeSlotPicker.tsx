'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Globe, Sun, Sunset, Moon } from 'lucide-react'
import { format, addDays, isSameDay, startOfDay, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { TIMEZONES } from '@/lib/constants'
import type { TimeSlot } from '@/types'

type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening'

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedDate: string | null
  selectedTime: string | null
  timezone: string
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
  onTimezoneChange: (tz: string) => void
  onContinue: () => void
  onBack: () => void
}

export function TimeSlotPicker({
  slots,
  selectedDate,
  selectedTime,
  timezone,
  onDateSelect,
  onTimeSelect,
  onTimezoneChange,
  onContinue,
  onBack,
}: TimeSlotPickerProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  // Generate 7 days starting from today + weekOffset
  const days = useMemo(() => {
    const today = startOfDay(new Date())
    return Array.from({ length: 7 }, (_, i) =>
      addDays(today, i + 1 + weekOffset * 7)
    )
  }, [weekOffset])

  // Get available dates from slots
  const availableDates = useMemo(() => {
    return new Set(slots.filter((s) => s.available).map((s) => s.date))
  }, [slots])

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return slots.filter((s) => s.date === selectedDate && s.available)
  }, [slots, selectedDate])

  // Filter slots by time of day
  const filteredSlots = useMemo(() => {
    if (timeFilter === 'all') return slotsForSelectedDate

    return slotsForSelectedDate.filter((slot) => {
      const hour = parseInt(slot.startTime.split(':')[0], 10)
      switch (timeFilter) {
        case 'morning':
          return hour >= 6 && hour < 12
        case 'afternoon':
          return hour >= 12 && hour < 17
        case 'evening':
          return hour >= 17 && hour < 22
        default:
          return true
      }
    })
  }, [slotsForSelectedDate, timeFilter])

  // Format time for display
  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const canGoBack = weekOffset > 0
  const canGoForward = weekOffset < 4 // Show up to 5 weeks ahead

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Choose Date & Time
        </h2>
        <p className="text-gray-600 mt-1">
          Select your preferred date and time for the consultation
        </p>
      </div>

      {/* Timezone selector */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <select
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          className="text-sm border-0 bg-transparent text-gray-600 focus:ring-0 cursor-pointer hover:text-gray-900"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setWeekOffset((prev) => prev - 1)}
          disabled={!canGoBack}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoBack
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-gray-900">
          {format(days[0], 'MMM d')} - {format(days[6], 'MMM d, yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setWeekOffset((prev) => prev + 1)}
          disabled={!canGoForward}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoForward
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Date picker */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isAvailable = availableDates.has(dateStr)
          const isSelected = selectedDate === dateStr

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => isAvailable && onDateSelect(dateStr)}
              disabled={!isAvailable}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl transition-all',
                isSelected
                  ? 'bg-primary text-white'
                  : isAvailable
                  ? 'hover:bg-gray-100 text-gray-900'
                  : 'text-gray-300 cursor-not-allowed'
              )}
            >
              <span className="text-xs font-medium uppercase">
                {format(day, 'EEE')}
              </span>
              <span className="text-lg font-semibold mt-1">
                {format(day, 'd')}
              </span>
              {isAvailable && !isSelected && (
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Time filter */}
      {selectedDate && slotsForSelectedDate.length > 0 && (
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              timeFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('morning')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              timeFilter === 'morning'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Sun className="h-4 w-4" />
            Morning
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('afternoon')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              timeFilter === 'afternoon'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Sunset className="h-4 w-4" />
            Afternoon
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('evening')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              timeFilter === 'evening'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Moon className="h-4 w-4" />
            Evening
          </button>
        </div>
      )}

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            Available times on {format(parseISO(selectedDate), 'EEEE, MMMM d')}
          </h3>

          {filteredSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filteredSlots.map((slot) => {
                const isSelected = selectedTime === slot.startTime
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => onTimeSelect(slot.startTime)}
                    className={cn(
                      'py-3 px-4 rounded-lg text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {formatTimeSlot(slot.startTime)}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4">
              No available times for this filter. Try selecting a different time of day.
            </p>
          )}
        </div>
      )}

      {/* No available dates message */}
      {!selectedDate && !availableDates.size && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No available slots in this week. Try navigating to a different week.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedDate || !selectedTime}
          className={cn(
            'flex-1 py-3 px-6 rounded-lg font-medium transition-colors',
            selectedDate && selectedTime
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          Continue to Details
        </button>
      </div>
    </div>
  )
}
