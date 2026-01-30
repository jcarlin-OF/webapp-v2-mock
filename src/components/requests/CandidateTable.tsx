'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CandidateStatusDropdown } from './CandidateStatusDropdown'
import { formatDate } from '@/lib/utils'
import {
  MoreHorizontal,
  MessageSquare,
  StickyNote,
  ExternalLink,
  Trash2,
  Linkedin,
  User,
} from 'lucide-react'
import type { ExpertCandidate, CandidateStatus, Expert } from '@/types'

interface CandidateWithExpert extends ExpertCandidate {
  expert?: Expert
}

interface CandidateTableProps {
  candidates: CandidateWithExpert[]
  onStatusChange: (candidateId: string, newStatus: CandidateStatus, note?: string) => void
  onAddNote: (candidateId: string) => void
  onRemove: (candidateId: string) => void
  onViewResponses: (candidateId: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function getSourceIcon(source: CandidateWithExpert['source']) {
  switch (source) {
    case 'linkedin':
      return <Linkedin className="h-3 w-3" />
    case 'platform':
      return <User className="h-3 w-3" />
    case 'public_link':
      return <ExternalLink className="h-3 w-3" />
    default:
      return <User className="h-3 w-3" />
  }
}

function getSourceLabel(source: CandidateWithExpert['source']) {
  switch (source) {
    case 'linkedin':
      return 'LinkedIn'
    case 'platform':
      return 'Platform'
    case 'public_link':
      return 'Public Link'
    case 'referral':
      return 'Referral'
    default:
      return source
  }
}

export function CandidateTable({
  candidates,
  onStatusChange,
  onAddNote,
  onRemove,
  onViewResponses,
}: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium">No candidates yet</p>
        <p className="text-sm mt-1">Add candidates from the platform or LinkedIn</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="pb-3 font-medium">Expert</th>
            <th className="pb-3 font-medium">Source</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Added</th>
            <th className="pb-3 font-medium">Last Activity</th>
            <th className="pb-3 font-medium w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {candidates.map((candidate) => {
            const name = candidate.expert?.name || candidate.externalProfile?.name || 'Unknown'
            const headline = candidate.expert?.headline || candidate.externalProfile?.headline || ''
            const avatar = candidate.expert?.avatar
            const linkedinUrl = candidate.externalProfile?.linkedinUrl
            const hasResponses = candidate.qualificationResponses.length > 0

            return (
              <tr key={candidate.id} className="group hover:bg-gray-50">
                {/* Expert Info */}
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {avatar && <AvatarImage src={avatar} alt={name} />}
                      <AvatarFallback className="text-xs">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{name}</p>
                        {linkedinUrl && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {headline}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Source */}
                <td className="py-4 pr-4">
                  <Badge variant="muted" className="text-xs font-normal">
                    {getSourceIcon(candidate.source)}
                    <span className="ml-1">{getSourceLabel(candidate.source)}</span>
                  </Badge>
                </td>

                {/* Status */}
                <td className="py-4 pr-4">
                  <CandidateStatusDropdown
                    currentStatus={candidate.status}
                    onStatusChange={(newStatus, note) =>
                      onStatusChange(candidate.id, newStatus, note)
                    }
                  />
                </td>

                {/* Added Date */}
                <td className="py-4 pr-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(candidate.createdAt)}
                  </span>
                </td>

                {/* Last Activity */}
                <td className="py-4 pr-4">
                  <span className="text-sm text-gray-500">
                    {candidate.respondedAt
                      ? formatDate(candidate.respondedAt)
                      : candidate.contactedAt
                      ? formatDate(candidate.contactedAt)
                      : '-'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {candidate.expertId && (
                        <DropdownMenuItem asChild>
                          <Link href={`/experts/${candidate.expert?.slug || candidate.expertId}`}>
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {hasResponses && (
                        <DropdownMenuItem onClick={() => onViewResponses(candidate.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Responses
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onAddNote(candidate.id)}>
                        <StickyNote className="h-4 w-4 mr-2" />
                        Add Note
                      </DropdownMenuItem>
                      {linkedinUrl && (
                        <DropdownMenuItem asChild>
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            View LinkedIn
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onRemove(candidate.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
