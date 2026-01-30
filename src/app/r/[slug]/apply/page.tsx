'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QualificationResponseForm } from '@/components/requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  publicApplicationSchema,
  type PublicApplication,
} from '@/lib/validations/requests'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Linkedin,
  User,
  Building2,
  Calendar,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ExpertRequest, QualificationResponse } from '@/types'

type ApplyStep = 'profile' | 'questions' | 'review' | 'success'

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const slug = params.slug as string

  const [request, setRequest] = useState<Partial<ExpertRequest> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<ApplyStep>('profile')
  const [responses, setResponses] = useState<QualificationResponse[]>([])

  // Profile form for unauthenticated users
  const profileForm = useForm<{
    name: string
    email: string
    linkedinUrl: string
    headline: string
  }>({
    defaultValues: {
      name: '',
      email: '',
      linkedinUrl: '',
      headline: '',
    },
  })

  // Fetch request data
  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/public/requests/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setRequest(data.request)
        } else {
          setError('This opportunity is no longer available.')
        }
      } catch (err) {
        setError('Failed to load opportunity.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [slug])

  // Skip profile step if authenticated
  useEffect(() => {
    if (status === 'authenticated' && currentStep === 'profile') {
      if (request?.qualifications && request.qualifications.length > 0) {
        setCurrentStep('questions')
      } else {
        setCurrentStep('review')
      }
    }
  }, [status, currentStep, request])

  const handleNextFromProfile = useCallback(() => {
    // For unauthenticated users, validate profile
    if (!session) {
      const values = profileForm.getValues()
      if (!values.name.trim()) {
        profileForm.setError('name', { message: 'Name is required' })
        return
      }
    }

    if (request?.qualifications && request.qualifications.length > 0) {
      setCurrentStep('questions')
    } else {
      setCurrentStep('review')
    }
  }, [session, profileForm, request])

  const handleNextFromQuestions = useCallback(() => {
    // Validate required questions
    if (request?.qualifications) {
      const requiredQuals = request.qualifications.filter((q) => q.required)
      for (const qual of requiredQuals) {
        const response = responses.find((r) => r.qualificationId === qual.id)
        if (
          !response ||
          response.answer === undefined ||
          response.answer === null ||
          response.answer === '' ||
          (Array.isArray(response.answer) && response.answer.length === 0)
        ) {
          alert(`Please answer the required question: "${qual.question}"`)
          return
        }
      }
    }

    setCurrentStep('review')
  }, [request, responses])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const profileValues = profileForm.getValues()

      const payload: PublicApplication = {
        responses,
        ...(session
          ? {}
          : {
              name: profileValues.name,
              email: profileValues.email || undefined,
              linkedinUrl: profileValues.linkedinUrl || undefined,
              headline: profileValues.headline || undefined,
            }),
      }

      const res = await fetch(`/api/public/requests/${slug}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setCurrentStep('success')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit application')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [session, profileForm, responses, slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error && !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-6">{error}</p>
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
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href={`/r/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to opportunity
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Request Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h1 className="font-heading font-semibold text-gray-900 mb-1">
              {request?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {request?.agency && (
                <Badge variant="muted">
                  <Building2 className="h-3 w-3 mr-1" />
                  {request.agency}
                </Badge>
              )}
              {request?.deadline && (
                <span>
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Due {formatDate(request.deadline)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success State */}
        {currentStep === 'success' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for expressing interest in this opportunity. The team
                will review your application and reach out if there&apos;s a good
                fit.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href={`/r/${slug}`}>View Opportunity</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Browse More Opportunities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Step (for unauthenticated users) */}
        {currentStep === 'profile' && !session && (
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Login Options */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full" disabled>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Continue with LinkedIn
                </Button>
                <p className="text-xs text-center text-gray-500">
                  LinkedIn login coming soon
                </p>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                  or continue manually
                </span>
              </div>

              {/* Manual Profile Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...profileForm.register('name')}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...profileForm.register('email')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...profileForm.register('linkedinUrl')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    placeholder="e.g., Senior Cybersecurity Consultant"
                    {...profileForm.register('headline')}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNextFromProfile}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions Step */}
        {currentStep === 'questions' && (
          <Card>
            <CardHeader>
              <CardTitle>Questionnaire</CardTitle>
              <p className="text-sm text-gray-500">
                Please answer the following questions to help us understand your
                qualifications.
              </p>
            </CardHeader>
            <CardContent>
              <QualificationResponseForm
                qualifications={request?.qualifications || []}
                responses={responses}
                onChange={setResponses}
              />

              <div className="flex justify-between pt-6 border-t mt-6">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentStep(session ? 'questions' : 'profile')
                  }
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNextFromQuestions}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Your Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {session ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium">
                        {profileForm.getValues('name')}
                      </p>
                      {profileForm.getValues('headline') && (
                        <p className="text-sm text-gray-600">
                          {profileForm.getValues('headline')}
                        </p>
                      )}
                      {profileForm.getValues('email') && (
                        <p className="text-sm text-gray-500">
                          {profileForm.getValues('email')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Responses Summary */}
              {responses.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Your Responses
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {request?.qualifications?.map((q, i) => {
                      const response = responses.find(
                        (r) => r.qualificationId === q.id
                      )
                      const answer = response?.answer
                      let displayAnswer = '-'

                      if (answer !== undefined && answer !== null) {
                        if (typeof answer === 'boolean') {
                          displayAnswer = answer ? 'Yes' : 'No'
                        } else if (Array.isArray(answer)) {
                          displayAnswer = answer.join(', ')
                        } else {
                          displayAnswer = String(answer)
                        }
                      }

                      return (
                        <div key={q.id}>
                          <p className="text-sm font-medium text-gray-700">
                            {i + 1}. {q.question}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {displayAnswer}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentStep(
                      request?.qualifications?.length ? 'questions' : 'profile'
                    )
                  }
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
