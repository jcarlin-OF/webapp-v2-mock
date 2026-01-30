import Link from 'next/link'
import { FileQuestion, Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <FileQuestion className="h-10 w-10 text-primary" />
          </div>

          {/* Content */}
          <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or doesn&apos;t exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/experts" className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Experts
              </Link>
            </Button>
          </div>

          {/* Additional Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">You might also try:</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link
                href="/"
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Homepage
              </Link>
              <Link
                href="/experts"
                className="text-primary hover:text-primary-dark transition-colors"
              >
                All Experts
              </Link>
              <Link
                href="/how-it-works"
                className="text-primary hover:text-primary-dark transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
