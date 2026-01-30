'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PublicRequestView } from '@/components/requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Briefcase } from 'lucide-react'
import type { ExpertRequest } from '@/types'

export default function PublicRequestPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [request, setRequest] = useState<Partial<ExpertRequest> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/public/requests/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setRequest(data.request)
        } else if (res.status === 404) {
          setError('This opportunity is no longer available or does not exist.')
        } else {
          setError('Failed to load opportunity details.')
        }
      } catch (err) {
        console.error('Error fetching request:', err)
        setError('An error occurred. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              Opportunity Not Found
            </h1>
            <p className="text-gray-500 mb-6">
              {error || 'This opportunity is no longer available.'}
            </p>
            <Button asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-heading font-bold text-primary">
            OnFrontiers
          </Link>
          <Button asChild>
            <Link href={`/r/${slug}/apply`}>
              Express Interest
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <PublicRequestView request={request} />

        {/* CTA */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-gray-900 mb-1">
                  Interested in this opportunity?
                </h2>
                <p className="text-sm text-gray-600">
                  Express your interest and share your qualifications
                </p>
              </div>
              <Button asChild size="lg">
                <Link href={`/r/${slug}/apply`}>
                  Apply Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Powered by OnFrontiers - Expert Marketplace</p>
        </div>
      </footer>
    </div>
  )
}
