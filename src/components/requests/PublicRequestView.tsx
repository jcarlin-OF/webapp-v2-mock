'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ExpertRequest, ClearanceLevel } from '@/types'

interface PublicRequestViewProps {
  request: Partial<ExpertRequest>
}

const clearanceLabels: Record<ClearanceLevel, string> = {
  none: 'None',
  'public-trust': 'Public Trust',
  secret: 'Secret',
  'top-secret': 'Top Secret',
  'ts-sci': 'TS/SCI',
}

export function PublicRequestView({ request }: PublicRequestViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          {request.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {request.agency && (
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{request.agency}</span>
            </div>
          )}
          {request.contractType && (
            <Badge variant="muted">{request.contractType}</Badge>
          )}
          {request.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Due {formatDate(request.deadline)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Opportunity Details
          </h2>
          <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Requirements
          </h2>

          {/* Required Expertise */}
          {request.requiredExpertise && request.requiredExpertise.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Required Expertise</p>
              <div className="flex flex-wrap gap-2">
                {request.requiredExpertise.map((expertise) => (
                  <Badge key={expertise} variant="secondary">
                    {expertise}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Clearance */}
          {request.clearanceRequired && request.clearanceRequired !== 'none' && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Security Clearance</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-gray-900">
                  {clearanceLabels[request.clearanceRequired]} required
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questionnaire Preview */}
      {request.qualifications && request.qualifications.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-medium text-gray-900 mb-4">
              Questionnaire ({request.qualifications.length} questions)
            </h2>
            <div className="space-y-4">
              {request.qualifications.map((q, index) => (
                <div key={q.id} className="flex gap-3">
                  <span className="text-sm text-gray-400 font-medium">
                    {index + 1}.
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">{q.question}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {q.type === 'text' && 'Short answer'}
                      {q.type === 'long_text' && 'Long answer'}
                      {q.type === 'boolean' && 'Yes/No'}
                      {q.type === 'single_select' && `Select one: ${q.options?.join(', ')}`}
                      {q.type === 'multi_select' && `Select multiple: ${q.options?.join(', ')}`}
                      {q.required && ' • Required'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
