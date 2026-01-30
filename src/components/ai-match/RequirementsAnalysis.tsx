'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Shield, Briefcase, FileText, Hash } from 'lucide-react'
import type { ExtractedRequirements } from '@/lib/ai-match/types'

interface RequirementsAnalysisProps {
  requirements: ExtractedRequirements
  className?: string
}

export function RequirementsAnalysis({
  requirements,
  className,
}: RequirementsAnalysisProps) {
  const hasContent =
    requirements.domains.length > 0 ||
    requirements.skills.length > 0 ||
    requirements.clearanceRequired ||
    requirements.contractType ||
    requirements.naicsCodes?.length

  if (!hasContent) return null

  return (
    <div
      className={cn(
        'rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-3',
        className
      )}
    >
      <h4 className="text-sm font-medium text-primary flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Extracted Requirements
      </h4>

      {requirements.domains.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            Domains:
          </span>
          {requirements.domains.map((domain) => (
            <Badge key={domain} variant="secondary" className="text-xs capitalize">
              {domain}
            </Badge>
          ))}
        </div>
      )}

      {requirements.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground font-medium">Skills:</span>
          {requirements.skills.slice(0, 8).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {requirements.skills.length > 8 && (
            <Badge variant="muted" className="text-xs">
              +{requirements.skills.length - 8} more
            </Badge>
          )}
        </div>
      )}

      {requirements.clearanceRequired && (
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Clearance:</span>
          <Badge variant="destructive" className="text-xs">
            {requirements.clearanceRequired}
          </Badge>
        </div>
      )}

      {requirements.contractType && (
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Contract:</span>
          <Badge variant="muted" className="text-xs">
            {requirements.contractType}
          </Badge>
        </div>
      )}

      {requirements.naicsCodes && requirements.naicsCodes.length > 0 && (
        <div className="flex items-center gap-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">NAICS:</span>
          {requirements.naicsCodes.map((code) => (
            <Badge key={code} variant="outline" className="text-xs font-mono">
              {code}
            </Badge>
          ))}
        </div>
      )}

      {requirements.experienceLevel && (
        <div className="text-xs text-muted-foreground">
          Experience: {requirements.experienceLevel}
        </div>
      )}
    </div>
  )
}
