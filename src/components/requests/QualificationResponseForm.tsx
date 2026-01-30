'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Qualification, QualificationResponse } from '@/types'

interface QualificationResponseFormProps {
  qualifications: Qualification[]
  responses: QualificationResponse[]
  onChange: (responses: QualificationResponse[]) => void
  readOnly?: boolean
}

export function QualificationResponseForm({
  qualifications,
  responses,
  onChange,
  readOnly = false,
}: QualificationResponseFormProps) {
  const getResponse = useCallback(
    (qualificationId: string): QualificationResponse | undefined => {
      return responses.find((r) => r.qualificationId === qualificationId)
    },
    [responses]
  )

  const handleUpdateResponse = useCallback(
    (qualificationId: string, answer: string | boolean | string[]) => {
      const existingIndex = responses.findIndex(
        (r) => r.qualificationId === qualificationId
      )
      const newResponses = [...responses]

      if (existingIndex >= 0) {
        newResponses[existingIndex] = { qualificationId, answer }
      } else {
        newResponses.push({ qualificationId, answer })
      }

      onChange(newResponses)
    },
    [responses, onChange]
  )

  const handleMultiSelectChange = useCallback(
    (qualificationId: string, option: string, checked: boolean) => {
      const existingResponse = getResponse(qualificationId)
      const currentValues = Array.isArray(existingResponse?.answer)
        ? (existingResponse?.answer as string[])
        : []

      let newValues: string[]
      if (checked) {
        newValues = [...currentValues, option]
      } else {
        newValues = currentValues.filter((v) => v !== option)
      }

      handleUpdateResponse(qualificationId, newValues)
    },
    [getResponse, handleUpdateResponse]
  )

  if (qualifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No questionnaire for this request</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {qualifications.map((question, index) => {
        const response = getResponse(question.id)

        return (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Question */}
                <div className="flex items-start justify-between gap-2">
                  <Label className="text-base font-medium leading-relaxed">
                    {index + 1}. {question.question}
                  </Label>
                  {question.required && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Required
                    </Badge>
                  )}
                </div>

                {/* Answer Input */}
                <div className="pt-1">
                  {/* Short Text */}
                  {question.type === 'text' && (
                    <Input
                      placeholder="Your answer..."
                      value={(response?.answer as string) || ''}
                      onChange={(e) =>
                        handleUpdateResponse(question.id, e.target.value)
                      }
                      disabled={readOnly}
                    />
                  )}

                  {/* Long Text */}
                  {question.type === 'long_text' && (
                    <Textarea
                      placeholder="Your answer..."
                      value={(response?.answer as string) || ''}
                      onChange={(e) =>
                        handleUpdateResponse(question.id, e.target.value)
                      }
                      disabled={readOnly}
                      rows={4}
                    />
                  )}

                  {/* Boolean (Yes/No) */}
                  {question.type === 'boolean' && (
                    <RadioGroup
                      value={
                        response?.answer === true
                          ? 'yes'
                          : response?.answer === false
                          ? 'no'
                          : undefined
                      }
                      onValueChange={(value) =>
                        handleUpdateResponse(question.id, value === 'yes')
                      }
                      disabled={readOnly}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                        <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${question.id}-no`} />
                        <Label htmlFor={`${question.id}-no`}>No</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {/* Single Select */}
                  {question.type === 'single_select' && question.options && (
                    <RadioGroup
                      value={(response?.answer as string) || undefined}
                      onValueChange={(value) =>
                        handleUpdateResponse(question.id, value)
                      }
                      disabled={readOnly}
                      className="space-y-2"
                    >
                      {question.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${option}`}
                          />
                          <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* Multi Select */}
                  {question.type === 'multi_select' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isChecked = Array.isArray(response?.answer)
                          ? (response?.answer as string[]).includes(option)
                          : false

                        return (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange(
                                  question.id,
                                  option,
                                  checked as boolean
                                )
                              }
                              disabled={readOnly}
                            />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Read-only display of responses
interface QualificationResponseDisplayProps {
  qualifications: Qualification[]
  responses: QualificationResponse[]
}

export function QualificationResponseDisplay({
  qualifications,
  responses,
}: QualificationResponseDisplayProps) {
  const getResponse = (qualificationId: string): QualificationResponse | undefined => {
    return responses.find((r) => r.qualificationId === qualificationId)
  }

  const formatAnswer = (
    answer: string | boolean | string[] | undefined,
    type: Qualification['type']
  ): string => {
    if (answer === undefined || answer === null) return '-'
    if (type === 'boolean') return answer ? 'Yes' : 'No'
    if (Array.isArray(answer)) return answer.join(', ')
    return String(answer)
  }

  if (qualifications.length === 0 || responses.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No responses submitted</div>
    )
  }

  return (
    <div className="space-y-4">
      {qualifications.map((question, index) => {
        const response = getResponse(question.id)

        return (
          <div key={question.id} className="border-b pb-4 last:border-0">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {index + 1}. {question.question}
            </p>
            <p className="text-sm text-gray-900">
              {formatAnswer(response?.answer, question.type)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
