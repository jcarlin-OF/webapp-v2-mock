'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { DashboardHeader } from '@/components/dashboard'
import {
  CandidateStatusBadge,
  QualificationResponseForm,
} from '@/components/requests'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import {
  Building2,
  Calendar,
  Shield,
  CheckCircle,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  getExpertRequestById,
  getCandidatesByExpertId,
  addQualificationResponses,
} from '@/mock/data/expert-requests'
import { mockUsers } from '@/mock/data/users'
import type { ExpertRequest, ExpertCandidate, QualificationResponse } from '@/types'

const clearanceLabels: Record<string, string> = {
  none: 'None',
  'public-trust': 'Public Trust',
  secret: 'Secret',
  'top-secret': 'Top Secret',
  'ts-sci': 'TS/SCI',
}

export default function ExpertOpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const requestId = params.id as string

  const [request, setRequest] = useState<ExpertRequest | null>(null)
  const [candidate, setCandidate] = useState<ExpertCandidate | null>(null)
  const [responses, setResponses] = useState<QualificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Get expert ID from user
    const userId = session?.user?.id || 'user_002'
    const user = mockUsers.find((u) => u.id === userId)
    const expertId = user?.expertId

    if (expertId) {
      const requestData = getExpertRequestById(requestId)
      const candidates = getCandidatesByExpertId(expertId)
      const candidateData = candidates.find((c) => c.requestId === requestId)

      if (requestData && candidateData) {
        setRequest(requestData)
        setCandidate(candidateData)
        setResponses(candidateData.qualificationResponses || [])
      } else {
        router.push('/expert/opportunities')
      }
    }

    setIsLoading(false)
  }, [session, requestId, router])

  const handleSaveResponses = useCallback(async () => {
    if (!candidate) return

    setIsSaving(true)
    try {
      // In a real app, this would be an API call
      addQualificationResponses(candidate.id, responses)
      toast({ title: 'Responses saved' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save responses',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [candidate, responses])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!request || !candidate) {
    return null
  }

  const hasResponses = candidate.qualificationResponses.length > 0
  const hasQuestions = request.qualifications.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title={request.title}
        backHref="/expert/opportunities"
        backLabel="Back to Opportunities"
      />

      {/* Status Banner */}
      <Card
        className={`border-l-4 ${
          candidate.status === 'matched'
            ? 'border-l-green-500 bg-green-50'
            : candidate.status === 'rejected'
            ? 'border-l-red-500 bg-red-50'
            : 'border-l-blue-500 bg-blue-50'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CandidateStatusBadge status={candidate.status} />
              <span className="text-sm text-gray-600">
                {candidate.status === 'matched'
                  ? "You've been matched for this opportunity!"
                  : candidate.status === 'rejected'
                  ? 'You were not selected for this opportunity.'
                  : candidate.status === 'vetting'
                  ? "You're being evaluated for this opportunity."
                  : candidate.status === 'interested'
                  ? 'The team is reviewing your interest.'
                  : 'You have been added as a candidate.'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Added {formatDate(candidate.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Opportunity Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">
                {request.description}
              </p>
            </CardContent>
          </Card>

          {/* Questionnaire */}
          {hasQuestions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Questionnaire
                </CardTitle>
                {!hasResponses && (
                  <p className="text-sm text-gray-500">
                    Please answer the following questions to express your
                    interest
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <QualificationResponseForm
                  qualifications={request.qualifications}
                  responses={responses}
                  onChange={setResponses}
                  readOnly={candidate.status === 'matched' || candidate.status === 'rejected'}
                />

                {candidate.status !== 'matched' &&
                  candidate.status !== 'rejected' && (
                    <div className="mt-6 pt-6 border-t flex justify-end">
                      <Button onClick={handleSaveResponses} disabled={isSaving}>
                        {isSaving ? 'Saving...' : hasResponses ? 'Update Responses' : 'Submit Responses'}
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.agency && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{request.agency}</span>
                </div>
              )}
              {request.contractType && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{request.contractType}</span>
                </div>
              )}
              {request.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Due {formatDate(request.deadline)}
                  </span>
                </div>
              )}
              {request.clearanceRequired &&
                request.clearanceRequired !== 'none' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="text-gray-600">
                      {clearanceLabels[request.clearanceRequired]} required
                    </span>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Required Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {request.requiredExpertise.map((exp) => (
                  <Badge key={exp} variant="secondary">
                    {exp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          {candidate.statusHistory.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidate.statusHistory
                    .slice()
                    .reverse()
                    .map((entry, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                        <div>
                          <p className="text-sm">
                            Status changed to{' '}
                            <span className="font-medium">{entry.status}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(entry.changedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
