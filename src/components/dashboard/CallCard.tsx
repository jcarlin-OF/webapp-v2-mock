'use client'

import Link from 'next/link'
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns'
import { Calendar, Clock, Video, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Booking } from '@/types'

interface CallCardProps {
  booking: Booking
  variant?: 'client' | 'expert'
  onAccept?: (bookingId: string) => void
  onDecline?: (bookingId: string) => void
  className?: string
}

export function CallCard({
  booking,
  variant = 'client',
  onAccept,
  onDecline,
  className,
}: CallCardProps) {
  const date = parseISO(booking.date)
  const isCallToday = isToday(date)
  const isCallTomorrow = isTomorrow(date)
  const isCallPast = isPast(date) || booking.status === 'completed'

  const getDateLabel = () => {
    if (isCallToday) return 'Today'
    if (isCallTomorrow) return 'Tomorrow'
    return format(date, 'EEEE, MMMM d')
  }

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="default" className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  const person = variant === 'client' ? booking.expert : { name: 'Client', avatar: undefined, headline: 'Client' }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={person.avatar} alt={person.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {person.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-gray-900">
                  {variant === 'client' ? (
                    <Link
                      href={`/experts/${booking.expertId}`}
                      className="hover:text-primary transition-colors"
                    >
                      {person.name}
                    </Link>
                  ) : (
                    person.name
                  )}
                </h3>
                <p className="text-sm text-gray-500 truncate">{person.headline}</p>
              </div>
              {getStatusBadge()}
            </div>

            {/* Date & Time */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className={cn(isCallToday && 'font-medium text-primary')}>
                  {getDateLabel()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </div>

            {/* Service & Price */}
            <div className="mt-2 text-sm text-gray-500">
              {booking.service.name} ({booking.service.duration} min) &middot;{' '}
              {formatPrice(booking.price)}
            </div>

            {/* Agenda preview */}
            {booking.agenda && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {booking.agenda}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {booking.status === 'confirmed' && booking.meetingLink && !isCallPast && (
                <Button size="sm" asChild>
                  <a
                    href={booking.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <Video className="h-4 w-4" />
                    Join Call
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}

              {booking.status === 'pending' && variant === 'expert' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onAccept?.(booking.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDecline?.(booking.id)}
                  >
                    Decline
                  </Button>
                </>
              )}

              {booking.status === 'completed' && variant === 'client' && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/experts/${booking.expertId}`}>Book Again</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
