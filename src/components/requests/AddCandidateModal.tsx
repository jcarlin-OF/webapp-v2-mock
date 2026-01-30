'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  addLinkedInCandidateSchema,
  type AddLinkedInCandidate,
} from '@/lib/validations/requests'
import { searchExpertsForRequest } from '@/mock/data/expert-requests'
import { Search, Linkedin, User, Check, Star } from 'lucide-react'
import type { Expert } from '@/types'

interface AddCandidateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlatformCandidate: (expertId: string, note?: string) => void
  onAddLinkedInCandidate: (data: AddLinkedInCandidate) => void
  existingCandidateExpertIds: string[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function AddCandidateModal({
  open,
  onOpenChange,
  onAddPlatformCandidate,
  onAddLinkedInCandidate,
  existingCandidateExpertIds,
}: AddCandidateModalProps) {
  const [activeTab, setActiveTab] = useState<'platform' | 'linkedin'>('platform')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Expert[]>([])
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const [platformNote, setPlatformNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // LinkedIn form
  const linkedInForm = useForm<AddLinkedInCandidate>({
    resolver: zodResolver(addLinkedInCandidateSchema),
    defaultValues: {
      name: '',
      email: '',
      linkedinUrl: '',
      headline: '',
      note: '',
    },
  })

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query.length >= 2) {
        const results = searchExpertsForRequest(query, existingCandidateExpertIds)
        setSearchResults(results.slice(0, 6))
      } else {
        setSearchResults([])
      }
    },
    [existingCandidateExpertIds]
  )

  const handleSelectExpert = (expert: Expert) => {
    setSelectedExpert(expert)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleAddPlatformCandidate = async () => {
    if (!selectedExpert) return
    setIsSubmitting(true)
    try {
      await onAddPlatformCandidate(selectedExpert.id, platformNote || undefined)
      handleReset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddLinkedInCandidate = async (data: AddLinkedInCandidate) => {
    setIsSubmitting(true)
    try {
      await onAddLinkedInCandidate(data)
      handleReset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedExpert(null)
    setPlatformNote('')
    linkedInForm.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleReset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>
            Add an expert from the platform or paste a LinkedIn profile URL
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'platform' | 'linkedin')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Platform Search Tab */}
          <TabsContent value="platform" className="space-y-4 mt-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search experts by name or expertise..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedExpert && (
              <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                {searchResults.map((expert) => (
                  <button
                    key={expert.id}
                    type="button"
                    onClick={() => handleSelectExpert(expert)}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{expert.name}</p>
                      <p className="text-sm text-gray-500 truncate">{expert.headline}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {expert.rating.toFixed(1)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Expert Card */}
            {selectedExpert && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedExpert.avatar} alt={selectedExpert.name} />
                      <AvatarFallback>{getInitials(selectedExpert.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{selectedExpert.name}</p>
                          <p className="text-sm text-gray-500">{selectedExpert.headline}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedExpert(null)}
                        >
                          Change
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedExpert.expertise.slice(0, 3).map((exp) => (
                          <Badge key={exp} variant="secondary" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optional Note */}
                  <div className="mt-4">
                    <Label htmlFor="platform-note">Note (optional)</Label>
                    <Textarea
                      id="platform-note"
                      placeholder="Add a note about why you're adding this candidate..."
                      value={platformNote}
                      onChange={(e) => setPlatformNote(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {searchQuery.length < 2 && !selectedExpert && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Type to search for experts</p>
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !selectedExpert && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No experts found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPlatformCandidate}
                disabled={!selectedExpert || isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* LinkedIn Tab */}
          <TabsContent value="linkedin" className="mt-4">
            <form onSubmit={linkedInForm.handleSubmit(handleAddLinkedInCandidate)} className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL *</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  {...linkedInForm.register('linkedinUrl')}
                  className="mt-1"
                />
                {linkedInForm.formState.errors.linkedinUrl && (
                  <p className="text-sm text-red-600 mt-1">
                    {linkedInForm.formState.errors.linkedinUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  {...linkedInForm.register('name')}
                  className="mt-1"
                />
                {linkedInForm.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {linkedInForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  placeholder="Former DoD Cybersecurity Advisor"
                  {...linkedInForm.register('headline')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@email.com"
                  {...linkedInForm.register('email')}
                  className="mt-1"
                />
                {linkedInForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {linkedInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="linkedin-note">Note (optional)</Label>
                <Textarea
                  id="linkedin-note"
                  placeholder="Add a note about this candidate..."
                  {...linkedInForm.register('note')}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Add from LinkedIn
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
