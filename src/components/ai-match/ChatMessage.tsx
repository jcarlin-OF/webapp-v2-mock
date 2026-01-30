'use client'

import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/lib/ai-match/types'
import { RequirementsAnalysis } from './RequirementsAnalysis'
import { ExpertRecommendationCard } from './ExpertRecommendationCard'

interface ChatMessageProps {
  message: ChatMessageType
  className?: string
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 max-w-[85%] sm:max-w-[75%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-900 rounded-tl-sm'
          )}
        >
          {/* Message content with basic markdown-like formatting */}
          <div
            className={cn(
              'text-sm whitespace-pre-wrap prose prose-sm max-w-none',
              isUser
                ? '[&_strong]:text-white [&_strong]:font-semibold'
                : '[&_strong]:text-gray-900 [&_strong]:font-semibold'
            )}
            dangerouslySetInnerHTML={{
              __html: formatMessageContent(message.content),
            }}
          />
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            'mt-1 text-xs text-muted-foreground',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {formatTime(message.timestamp)}
        </div>

        {/* Assistant-only: Requirements analysis */}
        {!isUser && message.requirements && (
          <div className="mt-3">
            <RequirementsAnalysis requirements={message.requirements} />
          </div>
        )}

        {/* Assistant-only: Expert recommendations */}
        {!isUser &&
          message.expertRecommendations &&
          message.expertRecommendations.length > 0 && (
            <div className="mt-4 space-y-3">
              {message.expertRecommendations.map((rec) => (
                <ExpertRecommendationCard
                  key={rec.expert.id}
                  recommendation={rec}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function formatMessageContent(content: string): string {
  // Basic markdown-like formatting
  return content
    // Bold text: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Line breaks
    .replace(/\n/g, '<br />')
}
