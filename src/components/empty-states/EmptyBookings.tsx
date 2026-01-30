import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyBookingsProps {
  title?: string
  description?: string
  showCta?: boolean
}

export function EmptyBookings({
  title = 'No upcoming calls',
  description = 'Book a session with an expert to get started.',
  showCta = true,
}: EmptyBookingsProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">{description}</p>
      {showCta && (
        <Button className="mt-6" asChild>
          <Link href="/experts">Browse Experts</Link>
        </Button>
      )}
    </div>
  )
}
