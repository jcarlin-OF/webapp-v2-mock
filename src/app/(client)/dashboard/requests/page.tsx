'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { DashboardHeader, StatsCard } from '@/components/dashboard'
import { ExpertRequestCard } from '@/components/requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Plus,
  FileSearch,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react'
import type { ExpertRequest, ExpertRequestState } from '@/types'

export default function RequestsListPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<ExpertRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | ExpertRequestState>('all')

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch('/api/requests')
        if (res.ok) {
          const data = await res.json()
          setRequests(data.requests)
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const stats = {
    total: requests.length,
    open: requests.filter((r) => r.state === 'open').length,
    draft: requests.filter((r) => r.state === 'draft').length,
    closed: requests.filter((r) => r.state === 'closed').length,
    totalCandidates: requests.reduce((sum, r) => sum + r.candidateCount, 0),
    totalMatched: requests.reduce((sum, r) => sum + r.matchedCount, 0),
  }

  const filteredRequests =
    activeTab === 'all'
      ? requests
      : requests.filter((r) => r.state === activeTab)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <DashboardHeader
          title="Expert Requests"
          description="Manage your expert sourcing requests"
        />
        <Button asChild>
          <Link href="/dashboard/requests/new">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          label="Active Requests"
          value={stats.open}
          icon={FileSearch}
        />
        <StatsCard
          label="Total Candidates"
          value={stats.totalCandidates}
          icon={Users}
        />
        <StatsCard
          label="Experts Matched"
          value={stats.totalMatched}
          icon={CheckCircle}
        />
        <StatsCard label="Drafts" value={stats.draft} icon={Clock} />
      </div>

      {/* Request List */}
      <Card>
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({stats.closed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading requests...
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <ExpertRequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {activeTab === 'all'
                      ? 'No expert requests yet'
                      : `No ${activeTab} requests`}
                  </p>
                  {activeTab === 'all' && (
                    <Button asChild>
                      <Link href="/dashboard/requests/new">
                        Create Your First Request
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
