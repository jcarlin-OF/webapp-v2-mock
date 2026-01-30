'use client'

import { cn } from '@/lib/utils'
import { Sparkles, FileText, Users, Zap } from 'lucide-react'
import { EXAMPLE_PROMPTS } from '@/lib/ai-match/constants'

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void
  className?: string
}

export function WelcomeScreen({ onExampleClick, className }: WelcomeScreenProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white mb-4">
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          AI Expert Matching
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Paste your RFP, SOW, or contract requirements below. Our AI will analyze
          your needs and match you with the perfect consultants.
        </p>
      </div>

      {/* How it works */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span>Paste RFP</span>
        </div>
        <div className="text-muted-foreground hidden sm:block">→</div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span>Smart Matching</span>
        </div>
        <div className="text-muted-foreground hidden sm:block">→</div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span>Expert Results</span>
        </div>
      </div>

      {/* Example prompts */}
      <div className="w-full max-w-2xl px-4">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">
          Try an example:
        </p>
        <div className="grid gap-3">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.id}
              onClick={() => onExampleClick(example.prompt)}
              className={cn(
                'w-full text-left p-4 rounded-xl border border-gray-200',
                'bg-white hover:bg-gray-50 hover:border-primary/30 hover:shadow-sm',
                'transition-all group'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {example.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {example.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
