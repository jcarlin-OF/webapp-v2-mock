'use client'

import { CheckCircle, Calendar, Clock, Video, ArrowRight, Download } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import type { Expert, Service } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface BookingConfirmationProps {
  bookingId: string
  expert: Expert
  service: Service
  date: string
  startTime: string
  timezone: string
  clientName: string
  clientEmail: string
}

export function BookingConfirmation({
  bookingId,
  expert,
  service,
  date,
  startTime,
  timezone,
  clientName,
  clientEmail,
}: BookingConfirmationProps) {
  // Format time for display
  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Calculate end time
  const getEndTime = () => {
    const [hours, minutes] = startTime.split(':')
    const startHour = parseInt(hours, 10)
    const startMinute = parseInt(minutes, 10)
    const durationMinutes = service.duration

    let endHour = startHour + Math.floor((startMinute + durationMinutes) / 60)
    const endMinute = (startMinute + durationMinutes) % 60

    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
  }

  // Generate calendar URLs
  const generateGoogleCalendarUrl = () => {
    const startDateTime = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`
    const endDateTime = `${date.replace(/-/g, '')}T${getEndTime().replace(':', '')}00`

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Consultation with ${expert.name}`,
      dates: `${startDateTime}/${endDateTime}`,
      details: `Your consultation with ${expert.name}.\n\nService: ${service.name}\nDuration: ${service.duration} minutes\n\nA meeting link will be sent to your email before the call.`,
      location: 'Video Call (link will be provided)',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const generateOutlookCalendarUrl = () => {
    const startDateTime = `${date}T${startTime}:00`
    const endDateTime = `${date}T${getEndTime()}:00`

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: `Consultation with ${expert.name}`,
      startdt: startDateTime,
      enddt: endDateTime,
      body: `Your consultation with ${expert.name}.\n\nService: ${service.name}\nDuration: ${service.duration} minutes`,
      location: 'Video Call',
    })

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  const generateICSFile = () => {
    const startDateTime = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`
    const endDateTime = `${date.replace(/-/g, '')}T${getEndTime().replace(':', '')}00`

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OnFrontiers//Booking//EN
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:Consultation with ${expert.name}
DESCRIPTION:Your consultation with ${expert.name}.\\n\\nService: ${service.name}\\nDuration: ${service.duration} minutes\\n\\nA meeting link will be sent to your email before the call.
LOCATION:Video Call (link will be provided)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `onfrontiers-booking-${bookingId}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getTimezoneAbbr = (tz: string) => {
    const abbrevs: Record<string, string> = {
      'America/New_York': 'ET',
      'America/Chicago': 'CT',
      'America/Denver': 'MT',
      'America/Los_Angeles': 'PT',
      'Europe/London': 'GMT',
      'Europe/Paris': 'CET',
      'Asia/Tokyo': 'JST',
      'Asia/Singapore': 'SGT',
      'Australia/Sydney': 'AEDT',
    }
    return abbrevs[tz] || tz
  }

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
          <div className="relative bg-success rounded-full p-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mt-2">
          Your consultation with {expert.name} is scheduled. A confirmation email has been sent to{' '}
          <span className="font-medium">{clientEmail}</span>
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback>
              {expert.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{expert.name}</h3>
            <p className="text-sm text-gray-600">{service.name}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {formatTimeSlot(startTime)} - {formatTimeSlot(getEndTime())} ({getTimezoneAbbr(timezone)})
              </p>
              <p className="text-sm text-gray-500">{service.duration} minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Video Call</p>
              <p className="text-sm text-gray-500">
                Meeting link will be sent before your call
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount paid</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(service.price)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Booking ID</span>
            <span className="text-gray-500 font-mono">{bookingId}</span>
          </div>
        </div>
      </div>

      {/* Add to Calendar */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Add to your calendar</p>
        <div className="flex justify-center gap-3">
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google Calendar
          </a>

          <a
            href={generateOutlookCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#0078D4"
                d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.33.77.1.42.1.87-.02 0-.02.01zm2.33 2.26v-4.6h1.85q.67 0 1.09.18.43.18.67.51.24.32.34.75.1.43.1.93t-.1.94q-.1.43-.34.76-.24.32-.68.51-.43.18-1.1.18h-1.83zm1.15-3.7v2.81h.69q.66 0 1.02-.37.36-.37.36-1.03 0-.66-.36-1.04-.37-.37-1.03-.37h-.68z"
              />
              <path
                fill="#0078D4"
                d="M21.75 7.76l-.05.02-3.42 1.33V6.4c0-.55-.45-1-1-1H4.72c-.55 0-1 .45-1 1v11.2c0 .55.45 1 1 1h12.56c.55 0 1-.45 1-1v-2.71l3.42 1.33.05.02c.15.05.25.04.25-.12V7.88c0-.16-.1-.17-.25-.12z"
              />
            </svg>
            Outlook
          </a>

          <button
            onClick={generateICSFile}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download .ics
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>
              Check your email for a confirmation with all the details
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>
              You'll receive the video meeting link 15 minutes before your call
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>
              Join the call on time and have your questions ready!
            </span>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link
          href="/experts"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Browse More Experts
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
