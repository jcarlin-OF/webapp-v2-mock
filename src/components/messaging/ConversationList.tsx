'use client'

import { MessageSquare } from 'lucide-react'
import { ConversationCard } from './ConversationCard'
import type { Conversation } from '@/types'

interface ConversationListProps {
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (conversationId: string) => void
  currentUserRole: 'client' | 'expert'
  isLoading?: boolean
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserRole,
  isLoading = false,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <MessageSquare className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No conversations yet</p>
        <p className="text-gray-400 text-xs mt-1">
          {currentUserRole === 'client'
            ? 'Message an expert to start a conversation'
            : 'Conversations with clients will appear here'}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onClick={() => onSelectConversation(conversation.id)}
          currentUserRole={currentUserRole}
        />
      ))}
    </div>
  )
}
