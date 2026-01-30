'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, GripVertical, X } from 'lucide-react'
import type { QuestionType, Qualification } from '@/types'

// Input type allows optional ID (for creating new qualifications)
type QualificationInput = Omit<Qualification, 'id'> & { id?: string }

interface QualificationFormProps {
  qualifications: QualificationInput[]
  onChange: (qualifications: QualificationInput[]) => void
}

const questionTypeLabels: Record<QuestionType, string> = {
  text: 'Short Text',
  long_text: 'Long Text',
  boolean: 'Yes/No',
  single_select: 'Single Select',
  multi_select: 'Multi Select',
}

function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

// Helper to get a stable key for each question
function getQuestionKey(question: QualificationInput, index: number): string {
  return question.id || `temp_${index}`
}

export function QualificationForm({
  qualifications,
  onChange,
}: QualificationFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAddQuestion = useCallback(() => {
    const newId = generateId()
    const newQuestion: QualificationInput = {
      id: newId,
      question: '',
      type: 'text',
      required: true,
    }
    const updated = [...qualifications, newQuestion]
    onChange(updated)
    setExpandedId(newId)
  }, [qualifications, onChange])

  const handleRemoveQuestion = useCallback(
    (key: string) => {
      onChange(qualifications.filter((q, i) => getQuestionKey(q, i) !== key))
      if (expandedId === key) {
        setExpandedId(null)
      }
    },
    [qualifications, onChange, expandedId]
  )

  const handleUpdateQuestion = useCallback(
    (key: string, updates: Partial<QualificationInput>) => {
      onChange(
        qualifications.map((q, i) =>
          getQuestionKey(q, i) === key ? { ...q, ...updates } : q
        )
      )
    },
    [qualifications, onChange]
  )

  const handleAddOption = useCallback(
    (key: string) => {
      const question = qualifications.find((q, i) => getQuestionKey(q, i) === key)
      if (!question) return

      const options = [...(question.options || []), '']
      handleUpdateQuestion(key, { options })
    },
    [qualifications, handleUpdateQuestion]
  )

  const handleUpdateOption = useCallback(
    (key: string, optionIndex: number, value: string) => {
      const question = qualifications.find((q, i) => getQuestionKey(q, i) === key)
      if (!question || !question.options) return

      const options = [...question.options]
      options[optionIndex] = value
      handleUpdateQuestion(key, { options })
    },
    [qualifications, handleUpdateQuestion]
  )

  const handleRemoveOption = useCallback(
    (key: string, optionIndex: number) => {
      const question = qualifications.find((q, i) => getQuestionKey(q, i) === key)
      if (!question || !question.options) return

      const options = question.options.filter((_, i) => i !== optionIndex)
      handleUpdateQuestion(key, { options })
    },
    [qualifications, handleUpdateQuestion]
  )

  return (
    <div className="space-y-4">
      {qualifications.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-500">
          <p className="mb-2">No questions added yet</p>
          <p className="text-sm">Questions help you vet candidates more effectively</p>
        </div>
      )}

      {qualifications.map((question, index) => {
        const key = getQuestionKey(question, index)

        return (
          <Card key={key} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Drag Handle (visual only for now) */}
                <div className="pt-2 text-gray-400 cursor-grab">
                  <GripVertical className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Switch
                          id={`required-${key}`}
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            handleUpdateQuestion(key, { required: checked })
                          }
                        />
                        <Label htmlFor={`required-${key}`} className="text-gray-500">
                          Required
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(key)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <Label htmlFor={`question-${key}`}>Question</Label>
                    <Textarea
                      id={`question-${key}`}
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) =>
                        handleUpdateQuestion(key, { question: e.target.value })
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {/* Question Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Answer Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: QuestionType) => {
                          const updates: Partial<QualificationInput> = { type: value }
                          // Initialize options for select types
                          if (
                            (value === 'single_select' || value === 'multi_select') &&
                            !question.options
                          ) {
                            updates.options = ['', '']
                          }
                          // Clear options for non-select types
                          if (value !== 'single_select' && value !== 'multi_select') {
                            updates.options = undefined
                          }
                          handleUpdateQuestion(key, updates)
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(questionTypeLabels) as QuestionType[]).map((type) => (
                            <SelectItem key={type} value={type}>
                              {questionTypeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Options for select types */}
                  {(question.type === 'single_select' || question.type === 'multi_select') && (
                    <div>
                      <Label>Options</Label>
                      <div className="space-y-2 mt-2">
                        {(question.options || []).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleUpdateOption(key, optionIndex, e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(key, optionIndex)}
                              className="text-gray-400 hover:text-red-600"
                              disabled={(question.options?.length || 0) <= 2}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(key)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddQuestion}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </Button>
    </div>
  )
}
