'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Conversation } from '@/types'

interface ConversationHeaderProps {
  conversation: Conversation
  currentUserRole: 'client' | 'expert'
  onBack?: () => void
  showBackButton?: boolean
}

export function ConversationHeader({
  conversation,
  currentUserRole,
  onBack,
  showBackButton = false,
}: ConversationHeaderProps) {
  const otherParticipant =
    currentUserRole === 'client' ? conversation.expert : conversation.client

  const isExpert = 'headline' in otherParticipant

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      {showBackButton && onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to conversations</span>
        </Button>
      )}

      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
        <AvatarFallback>
          {otherParticipant.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">
            {otherParticipant.name}
          </span>
          {isExpert && (
            <CheckCircle className="h-4 w-4 text-primary fill-primary-light/30 shrink-0" />
          )}
        </div>
        {isExpert && (
          <p className="text-xs text-gray-500 truncate">
            {(otherParticipant as { headline: string }).headline}
          </p>
        )}
      </div>

      {currentUserRole === 'client' && (
        <Button size="sm" asChild className="shrink-0">
          <Link href={`/book/${conversation.expertId}`}>
            <Calendar className="h-4 w-4 mr-2" />
            Book Call
          </Link>
        </Button>
      )}
    </div>
  )
}
