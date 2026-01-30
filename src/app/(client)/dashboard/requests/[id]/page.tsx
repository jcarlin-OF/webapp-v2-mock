'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  CandidateTable,
  RequestStateBadge,
  RequestStatsCard,
  AddCandidateModal,
  QualificationResponseDisplay,
} from '@/components/requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import {
  Plus,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Edit,
  Archive,
  Trash2,
  Building2,
  Calendar,
  Shield,
  CheckCircle,
  Users,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type {
  ExpertRequest,
  ExpertCandidate,
  CandidateStatus,
  Expert,
} from '@/types'
import type { AddLinkedInCandidate } from '@/lib/validations/requests'

interface CandidateWithExpert extends ExpertCandidate {
  expert?: Expert
}

const clearanceLabels: Record<string, string> = {
  none: 'None',
  'public-trust': 'Public Trust',
  secret: 'Secret',
  'top-secret': 'Top Secret',
  'ts-sci': 'TS/SCI',
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  const [request, setRequest] = useState<ExpertRequest | null>(null)
  const [candidates, setCandidates] = useState<CandidateWithExpert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('candidates')

  // Modal states
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showResponsesModal, setShowResponsesModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateWithExpert | null>(null)
  const [noteText, setNoteText] = useState('')

  // Fetch request data
  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/requests/${requestId}`)
        if (res.ok) {
          const data = await res.json()
          setRequest(data.request)
          setCandidates(data.candidates)
        } else if (res.status === 404) {
          router.push('/dashboard/requests')
        }
      } catch (error) {
        console.error('Error fetching request:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [requestId, router])

  const handleStatusChange = useCallback(
    async (candidateId: string, newStatus: CandidateStatus, note?: string) => {
      try {
        const res = await fetch(
          `/api/requests/${requestId}/candidates/${candidateId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'status', status: newStatus, note }),
          }
        )

        if (res.ok) {
          const { candidate } = await res.json()
          setCandidates((prev) =>
            prev.map((c) => (c.id === candidateId ? { ...c, ...candidate } : c))
          )
          toast({
            title: 'Status updated',
            description: `Candidate status changed to ${newStatus}`,
          })
        }
      } catch (error) {
        console.error('Error updating status:', error)
        toast({
          title: 'Error',
          description: 'Failed to update status',
          variant: 'destructive',
        })
      }
    },
    [requestId]
  )

  const handleAddNote = useCallback((candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId)
    if (candidate) {
      setSelectedCandidate(candidate)
      setNoteText('')
      setShowNoteModal(true)
    }
  }, [candidates])

  const handleSaveNote = useCallback(async () => {
    if (!selectedCandidate || !noteText.trim()) return

    try {
      const res = await fetch(
        `/api/requests/${requestId}/candidates/${selectedCandidate.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'note', note: noteText }),
        }
      )

      if (res.ok) {
        const { candidate } = await res.json()
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === selectedCandidate.id ? { ...c, ...candidate } : c
          )
        )
        setShowNoteModal(false)
        toast({ title: 'Note added' })
      }
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      })
    }
  }, [selectedCandidate, noteText, requestId])

  const handleRemoveCandidate = useCallback(
    async (candidateId: string) => {
      if (!confirm('Are you sure you want to remove this candidate?')) return

      try {
        const res = await fetch(
          `/api/requests/${requestId}/candidates/${candidateId}`,
          { method: 'DELETE' }
        )

        if (res.ok) {
          setCandidates((prev) => prev.filter((c) => c.id !== candidateId))
          toast({ title: 'Candidate removed' })
        }
      } catch (error) {
        console.error('Error removing candidate:', error)
        toast({
          title: 'Error',
          description: 'Failed to remove candidate',
          variant: 'destructive',
        })
      }
    },
    [requestId]
  )

  const handleViewResponses = useCallback(
    (candidateId: string) => {
      const candidate = candidates.find((c) => c.id === candidateId)
      if (candidate) {
        setSelectedCandidate(candidate)
        setShowResponsesModal(true)
      }
    },
    [candidates]
  )

  const handleAddPlatformCandidate = useCallback(
    async (expertId: string, note?: string) => {
      try {
        const res = await fetch(`/api/requests/${requestId}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'platform', expertId, note }),
        })

        if (res.ok) {
          // Refetch candidates to get enriched data
          const refreshRes = await fetch(`/api/requests/${requestId}`)
          if (refreshRes.ok) {
            const data = await refreshRes.json()
            setCandidates(data.candidates)
            setRequest(data.request)
          }
          toast({ title: 'Candidate added' })
        } else {
          const error = await res.json()
          toast({
            title: 'Error',
            description: error.error,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Error adding candidate:', error)
        toast({
          title: 'Error',
          description: 'Failed to add candidate',
          variant: 'destructive',
        })
      }
    },
    [requestId]
  )

  const handleAddLinkedInCandidate = useCallback(
    async (data: AddLinkedInCandidate) => {
      try {
        const res = await fetch(`/api/requests/${requestId}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'linkedin', ...data }),
        })

        if (res.ok) {
          // Refetch candidates
          const refreshRes = await fetch(`/api/requests/${requestId}`)
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json()
            setCandidates(refreshData.candidates)
            setRequest(refreshData.request)
          }
          toast({ title: 'Candidate added from LinkedIn' })
        } else {
          const error = await res.json()
          toast({
            title: 'Error',
            description: error.error,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Error adding LinkedIn candidate:', error)
        toast({
          title: 'Error',
          description: 'Failed to add candidate',
          variant: 'destructive',
        })
      }
    },
    [requestId]
  )

  const handleCopyPublicLink = useCallback(() => {
    if (request) {
      const publicUrl = `${window.location.origin}/r/${request.slug}`
      navigator.clipboard.writeText(publicUrl)
      toast({ title: 'Public link copied to clipboard' })
    }
  }, [request])

  const handleCloseRequest = useCallback(async () => {
    if (!confirm('Are you sure you want to close this request?')) return

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'closed' }),
      })

      if (res.ok) {
        const { request: updated } = await res.json()
        setRequest(updated)
        toast({ title: 'Request closed' })
      }
    } catch (error) {
      console.error('Error closing request:', error)
    }
  }, [requestId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!request) {
    return null
  }

  const existingCandidateExpertIds = candidates
    .filter((c) => c.expertId)
    .map((c) => c.expertId as string)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <DashboardHeader
            title={request.title}
            backHref="/dashboard/requests"
            backLabel="Back to Requests"
          />
          <div className="flex items-center gap-3 mt-2">
            <RequestStateBadge state={request.state} />
            {request.agency && (
              <Badge variant="muted">
                <Building2 className="h-3 w-3 mr-1" />
                {request.agency}
              </Badge>
            )}
            {request.deadline && (
              <span className="text-sm text-gray-500">
                <Calendar className="h-3 w-3 inline mr-1" />
                Due {formatDate(request.deadline)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {request.isPublic && request.state === 'open' && (
            <Button variant="outline" size="sm" onClick={handleCopyPublicLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {request.isPublic && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/r/${request.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/requests/${request.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {request.state === 'open' && (
                <DropdownMenuItem onClick={handleCloseRequest}>
                  <Archive className="h-4 w-4 mr-2" />
                  Close Request
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <RequestStatsCard candidates={candidates} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="candidates">
            <Users className="h-4 w-4 mr-2" />
            Candidates ({candidates.length})
          </TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Candidates</CardTitle>
              {request.state === 'open' && (
                <Button size="sm" onClick={() => setShowAddCandidate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <CandidateTable
                candidates={candidates}
                onStatusChange={handleStatusChange}
                onAddNote={handleAddNote}
                onRemove={handleRemoveCandidate}
                onViewResponses={handleViewResponses}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {request.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Required Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {request.requiredExpertise.map((exp) => (
                      <Badge key={exp} variant="secondary">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
                {request.clearanceRequired &&
                  request.clearanceRequired !== 'none' && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Security Clearance
                      </p>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <span>
                          {clearanceLabels[request.clearanceRequired]} required
                        </span>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Questionnaire */}
            {request.qualifications.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    Questionnaire ({request.qualifications.length} questions)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {request.qualifications.map((q, i) => (
                      <div key={q.id} className="flex gap-3">
                        <span className="text-sm text-gray-400 font-medium">
                          {i + 1}.
                        </span>
                        <div>
                          <p className="text-sm text-gray-700">
                            {q.question}
                            {q.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {q.type === 'text' && 'Short answer'}
                            {q.type === 'long_text' && 'Long answer'}
                            {q.type === 'boolean' && 'Yes/No'}
                            {q.type === 'single_select' &&
                              `Select one: ${q.options?.join(', ')}`}
                            {q.type === 'multi_select' &&
                              `Select multiple: ${q.options?.join(', ')}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={showAddCandidate}
        onOpenChange={setShowAddCandidate}
        onAddPlatformCandidate={handleAddPlatformCandidate}
        onAddLinkedInCandidate={handleAddLinkedInCandidate}
        existingCandidateExpertIds={existingCandidateExpertIds}
      />

      {/* Add Note Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Internal Note</DialogTitle>
            <DialogDescription>
              Add a note about{' '}
              {selectedCandidate?.expert?.name ||
                selectedCandidate?.externalProfile?.name ||
                'this candidate'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Add your internal notes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={!noteText.trim()}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Responses Modal */}
      <Dialog open={showResponsesModal} onOpenChange={setShowResponsesModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Questionnaire Responses</DialogTitle>
            <DialogDescription>
              Responses from{' '}
              {selectedCandidate?.expert?.name ||
                selectedCandidate?.externalProfile?.name ||
                'this candidate'}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <QualificationResponseDisplay
              qualifications={request.qualifications}
              responses={selectedCandidate.qualificationResponses}
            />
          )}
          <DialogFooter>
            <Button onClick={() => setShowResponsesModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
