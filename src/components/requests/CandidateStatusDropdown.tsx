'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'
import { CandidateStatusBadge } from './CandidateStatusBadge'
import type { CandidateStatus } from '@/types'

interface CandidateStatusDropdownProps {
  currentStatus: CandidateStatus
  onStatusChange: (newStatus: CandidateStatus, note?: string) => void
  disabled?: boolean
}

const statusOptions: { status: CandidateStatus; description: string }[] = [
  { status: 'identified', description: 'Added to request' },
  { status: 'contacted', description: 'Outreach sent' },
  { status: 'interested', description: 'Expert expressed interest' },
  { status: 'vetting', description: 'Under evaluation' },
  { status: 'matched', description: 'Confirmed as good fit' },
  { status: 'rejected', description: 'Not proceeding' },
]

export function CandidateStatusDropdown({
  currentStatus,
  onStatusChange,
  disabled,
}: CandidateStatusDropdownProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (status: CandidateStatus) => {
    if (status !== currentStatus) {
      onStatusChange(status)
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1 px-2"
          disabled={disabled}
        >
          <CandidateStatusBadge status={currentStatus} />
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {statusOptions.map((option, idx) => (
          <div key={option.status}>
            <DropdownMenuItem
              onClick={() => handleSelect(option.status)}
              className="flex items-center justify-between"
            >
              <div>
                <CandidateStatusBadge status={option.status} />
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </div>
              {currentStatus === option.status && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
            {idx === 2 && <DropdownMenuSeparator />}
            {idx === 4 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
