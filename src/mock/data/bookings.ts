import type { Booking, BookingStatus } from '@/types'
import { addDays, subDays, format } from 'date-fns'

// Generate mock bookings
const now = new Date()

export const bookings: Booking[] = [
  {
    id: 'bkg_001',
    expertId: 'exp_001',
    expert: {
      id: 'exp_001',
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      headline: 'Former Google Product Director | AI & Machine Learning Strategy',
    },
    clientId: 'user_001',
    serviceId: 'svc_001_60',
    service: {
      id: 'svc_001_60',
      name: 'Deep Dive Session',
      duration: 60,
      price: 45000,
      description: 'Comprehensive strategy session with actionable recommendations',
    },
    date: format(addDays(now, 3), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    agenda: 'Discuss AI product strategy for our new B2B platform. Looking for guidance on feature prioritization and go-to-market approach.',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    createdAt: format(subDays(now, 2), 'yyyy-MM-dd'),
    price: 45000,
  },
  {
    id: 'bkg_002',
    expertId: 'exp_003',
    expert: {
      id: 'exp_003',
      name: 'Maria Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      headline: 'CMO & Growth Expert | Built Marketing Teams at Uber, Airbnb',
    },
    clientId: 'user_001',
    serviceId: 'svc_003_30',
    service: {
      id: 'svc_003_30',
      name: 'Growth Check-in',
      duration: 30,
      price: 20000,
      description: 'Quick strategy check or specific marketing question',
    },
    date: format(addDays(now, 7), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '14:30',
    status: 'pending',
    agenda: 'Need help optimizing our customer acquisition funnel. CAC has been increasing and looking for strategies to improve.',
    createdAt: format(subDays(now, 1), 'yyyy-MM-dd'),
    price: 20000,
  },
  {
    id: 'bkg_003',
    expertId: 'exp_002',
    expert: {
      id: 'exp_002',
      name: 'James Morrison',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      headline: 'Ex-Goldman Sachs MD | Investment Banking & Capital Markets Expert',
    },
    clientId: 'user_001',
    serviceId: 'svc_002_60',
    service: {
      id: 'svc_002_60',
      name: 'Strategy Session',
      duration: 60,
      price: 60000,
      description: 'In-depth financial strategy and transaction advisory',
    },
    date: format(subDays(now, 5), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    status: 'completed',
    agenda: 'Series B fundraising preparation. Need guidance on valuation expectations and investor targeting.',
    meetingLink: 'https://meet.google.com/klm-nopq-rst',
    createdAt: format(subDays(now, 10), 'yyyy-MM-dd'),
    price: 60000,
  },
  {
    id: 'bkg_004',
    expertId: 'exp_008',
    expert: {
      id: 'exp_008',
      name: 'Michael Chang',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      headline: 'CTO & Engineering Leader | Built Engineering at Coinbase, Robinhood',
    },
    clientId: 'user_002',
    serviceId: 'svc_008_60',
    service: {
      id: 'svc_008_60',
      name: 'Engineering Strategy Session',
      duration: 60,
      price: 40000,
      description: 'Comprehensive engineering strategy and architecture review',
    },
    date: format(subDays(now, 14), 'yyyy-MM-dd'),
    startTime: '15:00',
    endTime: '16:00',
    status: 'completed',
    agenda: 'Scaling our engineering team from 10 to 50 engineers. Need advice on hiring, org structure, and technical processes.',
    meetingLink: 'https://meet.google.com/uvw-xyz-123',
    createdAt: format(subDays(now, 20), 'yyyy-MM-dd'),
    price: 40000,
  },
  {
    id: 'bkg_005',
    expertId: 'exp_004',
    expert: {
      id: 'exp_004',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      headline: 'Former Partner at Kirkland & Ellis | M&A and Corporate Law',
    },
    clientId: 'user_001',
    serviceId: 'svc_004_30',
    service: {
      id: 'svc_004_30',
      name: 'Legal Consultation',
      duration: 30,
      price: 30000,
      description: 'Quick legal guidance on specific questions',
    },
    date: format(subDays(now, 3), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '11:30',
    status: 'cancelled',
    agenda: 'Questions about term sheet provisions from our latest investor offer.',
    createdAt: format(subDays(now, 7), 'yyyy-MM-dd'),
    price: 30000,
  },
]

// Helper functions
export function getBookingById(id: string): Booking | undefined {
  return bookings.find((booking) => booking.id === id)
}

export function getBookingsByClientId(clientId: string): Booking[] {
  return bookings.filter((booking) => booking.clientId === clientId)
}

export function getBookingsByExpertId(expertId: string): Booking[] {
  return bookings.filter((booking) => booking.expertId === expertId)
}

export function getUpcomingBookings(clientId: string): Booking[] {
  const today = format(new Date(), 'yyyy-MM-dd')
  return bookings
    .filter(
      (booking) =>
        booking.clientId === clientId &&
        booking.date >= today &&
        (booking.status === 'confirmed' || booking.status === 'pending')
    )
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getPastBookings(clientId: string): Booking[] {
  const today = format(new Date(), 'yyyy-MM-dd')
  return bookings
    .filter(
      (booking) =>
        booking.clientId === clientId &&
        (booking.date < today || booking.status === 'completed' || booking.status === 'cancelled')
    )
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getExpertPendingRequests(expertId: string): Booking[] {
  return bookings.filter(
    (booking) => booking.expertId === expertId && booking.status === 'pending'
  )
}

export function getExpertUpcomingCalls(expertId: string): Booking[] {
  const today = format(new Date(), 'yyyy-MM-dd')
  return bookings
    .filter(
      (booking) =>
        booking.expertId === expertId &&
        booking.date >= today &&
        booking.status === 'confirmed'
    )
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Mock function to create a booking (returns a new booking with ID)
export function createBooking(data: {
  expertId: string
  expert: Booking['expert']
  clientId: string
  serviceId: string
  service: Booking['service']
  date: string
  startTime: string
  endTime: string
  agenda: string
  price: number
}): Booking {
  const newBooking: Booking = {
    id: `bkg_${Date.now()}`,
    ...data,
    status: 'pending',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  }
  bookings.push(newBooking)
  return newBooking
}

// Mock function to update booking status
export function updateBookingStatus(bookingId: string, status: BookingStatus): Booking | undefined {
  const booking = bookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.status = status
    if (status === 'confirmed') {
      booking.meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
    }
  }
  return booking
}
