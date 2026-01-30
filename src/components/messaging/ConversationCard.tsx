'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Conversation } from '@/types'

interface ConversationCardProps {
  conversation: Conversation
  isActive?: boolean
  onClick: () => void
  currentUserRole: 'client' | 'expert'
  unreadCount?: number
}

export function ConversationCard({
  conversation,
  isActive = false,
  onClick,
  currentUserRole,
  unreadCount = 0,
}: ConversationCardProps) {
  // Show the other participant
  const otherParticipant =
    currentUserRole === 'client' ? conversation.expert : conversation.client

  const formattedTime = getRelativeTime(conversation.lastMessageAt)

  // Truncate last message
  const lastMessagePreview =
    conversation.lastMessage?.content.slice(0, 60) +
    (conversation.lastMessage && conversation.lastMessage.content.length > 60
      ? '...'
      : '')

  // Show indicator if last message was from the other party
  const isFromOther =
    conversation.lastMessage?.senderRole !== currentUserRole

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
        isActive
          ? 'bg-primary/10'
          : 'hover:bg-gray-50'
      )}
    >
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
        <AvatarFallback>
          {otherParticipant.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'font-medium truncate',
              unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
            )}
          >
            {otherParticipant.name}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{formattedTime}</span>
        </div>

        {'headline' in otherParticipant && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {(otherParticipant as { headline: string }).headline}
          </p>
        )}

        {conversation.lastMessage && (
          <div className="flex items-center gap-2 mt-1">
            <p
              className={cn(
                'text-sm truncate',
                unreadCount > 0 && isFromOther
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500'
              )}
            >
              {!isFromOther && <span className="text-gray-400">You: </span>}
              {lastMessagePreview}
            </p>
            {unreadCount > 0 && (
              <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
