'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DashboardHeader } from '@/components/dashboard'
import { QualificationForm } from '@/components/requests'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  requestBasicInfoSchema,
  requestRequirementsSchema,
  CONTRACT_TYPES,
  AGENCIES,
  type RequestBasicInfo,
  type RequestRequirements,
  type QualificationInput,
} from '@/lib/validations/requests'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  ListChecks,
  MessageSquareText,
  Eye,
  X,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClearanceLevel } from '@/types'

type WizardStep = 'basics' | 'requirements' | 'qualifications' | 'review'

const steps: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: 'basics', label: 'Details', icon: FileText },
  { id: 'requirements', label: 'Requirements', icon: ListChecks },
  { id: 'qualifications', label: 'Questions', icon: MessageSquareText },
  { id: 'review', label: 'Review', icon: Eye },
]

const clearanceLevels: { value: ClearanceLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'public-trust', label: 'Public Trust' },
  { value: 'secret', label: 'Secret' },
  { value: 'top-secret', label: 'Top Secret' },
  { value: 'ts-sci', label: 'TS/SCI' },
]

export default function NewRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expertiseInput, setExpertiseInput] = useState('')

  // Form state
  const [basicInfo, setBasicInfo] = useState<RequestBasicInfo>({
    title: '',
    description: '',
    agency: '',
    contractType: '',
    naicsCode: '',
    deadline: '',
  })

  const [requirements, setRequirements] = useState<RequestRequirements>({
    requiredExpertise: [],
    clearanceRequired: undefined,
  })

  const [qualifications, setQualifications] = useState<QualificationInput[]>([])

  const [settings, setSettings] = useState({
    isPublic: true,
    saveAsDraft: false,
  })

  // Form validation
  const basicForm = useForm<RequestBasicInfo>({
    resolver: zodResolver(requestBasicInfoSchema),
    defaultValues: basicInfo,
  })

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleAddExpertise = useCallback(() => {
    const trimmed = expertiseInput.trim()
    if (trimmed && !requirements.requiredExpertise.includes(trimmed)) {
      setRequirements((prev) => ({
        ...prev,
        requiredExpertise: [...prev.requiredExpertise, trimmed],
      }))
      setExpertiseInput('')
    }
  }, [expertiseInput, requirements.requiredExpertise])

  const handleRemoveExpertise = useCallback((expertise: string) => {
    setRequirements((prev) => ({
      ...prev,
      requiredExpertise: prev.requiredExpertise.filter((e) => e !== expertise),
    }))
  }, [])

  const handleNext = useCallback(async () => {
    if (currentStep === 'basics') {
      const isValid = await basicForm.trigger()
      if (!isValid) return

      const values = basicForm.getValues()
      setBasicInfo(values)
    }

    if (currentStep === 'requirements') {
      if (requirements.requiredExpertise.length === 0) {
        alert('Please add at least one required expertise')
        return
      }
    }

    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }, [currentStep, currentStepIndex, basicForm, requirements])

  const handleBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }, [currentStepIndex])

  const handleSubmit = useCallback(
    async (saveAsDraft: boolean) => {
      setIsSubmitting(true)

      try {
        const payload = {
          ...basicInfo,
          ...requirements,
          qualifications: qualifications.map((q, i) => ({
            ...q,
            id: q.id || `q_${i}`,
          })),
          isPublic: settings.isPublic,
          state: saveAsDraft ? 'draft' : 'open',
        }

        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Failed to create request')
        }

        const { request } = await res.json()
        router.push(`/dashboard/requests/${request.id}`)
      } catch (error) {
        console.error('Error creating request:', error)
        alert(error instanceof Error ? error.message : 'Failed to create request')
      } finally {
        setIsSubmitting(false)
      }
    },
    [basicInfo, requirements, qualifications, settings.isPublic, router]
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Create Expert Request"
        description="Define your requirements and find the right experts"
        backHref="/dashboard/requests"
        backLabel="Back to Requests"
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isComplete = index < currentStepIndex
          const Icon = step.icon

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : isComplete
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 text-gray-400'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2',
                    isActive ? 'text-primary font-medium' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-24 h-0.5 mx-2',
                    index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {/* Step 1: Basics */}
          {currentStep === 'basics' && (
            <form className="space-y-6">
              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., CMMC Level 2 Compliance Expert for DoD RFP"
                  {...basicForm.register('title')}
                  className="mt-1"
                />
                {basicForm.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {basicForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you're looking for, the opportunity, and ideal expert qualifications..."
                  {...basicForm.register('description')}
                  className="mt-1"
                  rows={6}
                />
                {basicForm.formState.errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {basicForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agency">Agency</Label>
                  <Select
                    value={basicForm.watch('agency')}
                    onValueChange={(v) => basicForm.setValue('agency', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENCIES.map((agency) => (
                        <SelectItem key={agency} value={agency}>
                          {agency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select
                    value={basicForm.watch('contractType')}
                    onValueChange={(v) => basicForm.setValue('contractType', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="naicsCode">NAICS Code</Label>
                  <Input
                    id="naicsCode"
                    placeholder="e.g., 541512"
                    {...basicForm.register('naicsCode')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Proposal Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...basicForm.register('deadline')}
                    className="mt-1"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 'requirements' && (
            <div className="space-y-6">
              <div>
                <Label>Required Expertise *</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Add keywords that describe the expertise you need
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="e.g., CMMC, Cybersecurity, FedRAMP"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddExpertise()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddExpertise}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requirements.requiredExpertise.map((expertise) => (
                    <Badge
                      key={expertise}
                      variant="secondary"
                      className="pl-3 pr-1 py-1"
                    >
                      {expertise}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(expertise)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {requirements.requiredExpertise.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Add at least one required expertise
                  </p>
                )}
              </div>

              <div>
                <Label>Security Clearance Required</Label>
                <Select
                  value={requirements.clearanceRequired || 'none'}
                  onValueChange={(v) =>
                    setRequirements((prev) => ({
                      ...prev,
                      clearanceRequired: v as ClearanceLevel,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clearanceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Qualifications */}
          {currentStep === 'qualifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-1">Custom Questionnaire</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add questions that experts will answer when expressing
                  interest. This helps you vet candidates more effectively.
                </p>
                <QualificationForm
                  qualifications={qualifications}
                  onChange={setQualifications}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Basic Info Review */}
              <div>
                <h3 className="font-medium text-gray-500 text-sm mb-2">
                  Request Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-lg">{basicInfo.title}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {basicInfo.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {basicInfo.agency && (
                      <Badge variant="muted">{basicInfo.agency}</Badge>
                    )}
                    {basicInfo.contractType && (
                      <Badge variant="muted">{basicInfo.contractType}</Badge>
                    )}
                    {basicInfo.deadline && (
                      <Badge variant="muted">Due: {basicInfo.deadline}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements Review */}
              <div>
                <h3 className="font-medium text-gray-500 text-sm mb-2">
                  Requirements
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {requirements.requiredExpertise.map((exp) => (
                      <Badge key={exp} variant="secondary">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                  {requirements.clearanceRequired &&
                    requirements.clearanceRequired !== 'none' && (
                      <p className="text-sm text-gray-600">
                        Clearance:{' '}
                        {
                          clearanceLevels.find(
                            (l) => l.value === requirements.clearanceRequired
                          )?.label
                        }
                      </p>
                    )}
                </div>
              </div>

              {/* Qualifications Review */}
              {qualifications.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-500 text-sm mb-2">
                    Questionnaire ({qualifications.length} questions)
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {qualifications.map((q, i) => (
                      <p key={q.id || i} className="text-sm">
                        {i + 1}. {q.question}
                        {q.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Link</p>
                    <p className="text-sm text-gray-500">
                      Allow experts to apply via shareable link
                    </p>
                  </div>
                  <Switch
                    checked={settings.isPublic}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            {currentStepIndex > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {currentStep === 'review' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Create & Open
                  </Button>
                </>
              ) : (
                <Button onClick={handleNext}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
