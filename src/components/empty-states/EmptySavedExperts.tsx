import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptySavedExpertsProps {
  title?: string
  description?: string
  showCta?: boolean
}

export function EmptySavedExperts({
  title = 'No saved experts yet',
  description = 'Save experts you like to easily find them later.',
  showCta = true,
}: EmptySavedExpertsProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Heart className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">{description}</p>
      {showCta && (
        <Button className="mt-6" asChild>
          <Link href="/experts">Discover Experts</Link>
        </Button>
      )}
    </div>
  )
}
