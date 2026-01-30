'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import type { ExpertCandidate } from '@/types'

interface RequestStatsCardProps {
  candidates: ExpertCandidate[]
}

export function RequestStatsCard({ candidates }: RequestStatsCardProps) {
  const stats = {
    total: candidates.length,
    identified: candidates.filter((c) => c.status === 'identified').length,
    contacted: candidates.filter((c) => c.status === 'contacted').length,
    interested: candidates.filter((c) => c.status === 'interested').length,
    vetting: candidates.filter((c) => c.status === 'vetting').length,
    matched: candidates.filter((c) => c.status === 'matched').length,
    rejected: candidates.filter((c) => c.status === 'rejected').length,
    withResponses: candidates.filter(
      (c) => c.qualificationResponses.length > 0
    ).length,
  }

  const responseRate =
    stats.contacted > 0
      ? Math.round(
          ((stats.interested + stats.vetting + stats.matched) / stats.contacted) *
            100
        )
      : 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="h-4 w-4" />
              <span className="text-sm">Total Candidates</span>
            </div>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Contacted</span>
            </div>
            <p className="text-2xl font-semibold">{stats.contacted}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Response Rate</span>
            </div>
            <p className="text-2xl font-semibold">{responseRate}%</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Matched</span>
            </div>
            <p className="text-2xl font-semibold text-green-600">{stats.matched}</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-500 mb-3">Status Breakdown</p>
          <div className="flex gap-2 flex-wrap">
            {stats.identified > 0 && (
              <StatusPill label="Identified" count={stats.identified} color="gray" />
            )}
            {stats.contacted > 0 && (
              <StatusPill label="Contacted" count={stats.contacted} color="blue" />
            )}
            {stats.interested > 0 && (
              <StatusPill label="Interested" count={stats.interested} color="purple" />
            )}
            {stats.vetting > 0 && (
              <StatusPill label="Vetting" count={stats.vetting} color="amber" />
            )}
            {stats.matched > 0 && (
              <StatusPill label="Matched" count={stats.matched} color="green" />
            )}
            {stats.rejected > 0 && (
              <StatusPill label="Rejected" count={stats.rejected} color="red" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusPill({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: 'gray' | 'blue' | 'purple' | 'amber' | 'green' | 'red'
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {label}: {count}
    </span>
  )
}
