'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-6">
            <AlertCircle className="h-10 w-10 text-error" />
          </div>

          {/* Content */}
          <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-8">
            We apologize for the inconvenience. An unexpected error has
            occurred. Please try again or contact support if the problem
            persists.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={reset}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && error.digest && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
              <p className="text-xs text-gray-500 font-mono">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
