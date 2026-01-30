'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { DashboardHeader, StatsCard } from '@/components/dashboard'
import { CandidateStatusBadge } from '@/components/requests'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  Briefcase,
  Building2,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  getRequestsForExpert,
  getCandidatesByExpertId,
} from '@/mock/data/expert-requests'
import { mockUsers } from '@/mock/data/users'
import type { ExpertRequest, ExpertCandidate } from '@/types'

interface OpportunityWithCandidate {
  request: ExpertRequest
  candidate: ExpertCandidate
}

export default function ExpertOpportunitiesPage() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<OpportunityWithCandidate[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get expert ID from user
    const userId = session?.user?.id || 'user_002' // user_002 is expert jane
    const user = mockUsers.find((u) => u.id === userId)
    const expertId = user?.expertId

    if (expertId) {
      const requests = getRequestsForExpert(expertId)
      const candidates = getCandidatesByExpertId(expertId)

      const combined = requests
        .map((request) => ({
          request,
          candidate: candidates.find((c) => c.requestId === request.id)!,
        }))
        .filter((o) => o.candidate)
        .sort(
          (a, b) =>
            new Date(b.candidate.createdAt).getTime() -
            new Date(a.candidate.createdAt).getTime()
        )

      setOpportunities(combined)
    }

    setIsLoading(false)
  }, [session])

  const stats = {
    total: opportunities.length,
    pending: opportunities.filter((o) =>
      ['identified', 'contacted', 'interested', 'vetting'].includes(
        o.candidate.status
      )
    ).length,
    matched: opportunities.filter((o) => o.candidate.status === 'matched')
      .length,
    rejected: opportunities.filter((o) => o.candidate.status === 'rejected')
      .length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Opportunities"
        description="Contract opportunities you're being considered for"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          label="Active Opportunities"
          value={stats.pending}
          icon={Clock}
        />
        <StatsCard label="Matched" value={stats.matched} icon={CheckCircle} />
        <StatsCard label="Total" value={stats.total} icon={Briefcase} />
        <StatsCard
          label="Not Selected"
          value={stats.rejected}
          icon={AlertCircle}
        />
      </div>

      {/* Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map(({ request, candidate }) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CandidateStatusBadge status={candidate.status} />
                        {request.agency && (
                          <Badge variant="muted">
                            <Building2 className="h-3 w-3 mr-1" />
                            {request.agency}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {request.requiredExpertise.slice(0, 4).map((exp) => (
                          <Badge
                            key={exp}
                            variant="secondary"
                            className="text-xs"
                          >
                            {exp}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {request.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due {formatDate(request.deadline)}
                          </span>
                        )}
                        <span>Added {formatDate(candidate.createdAt)}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/expert/opportunities/${request.id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No opportunities yet</p>
              <p className="text-sm text-gray-400">
                You&apos;ll see opportunities here when clients consider you for
                their projects
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
