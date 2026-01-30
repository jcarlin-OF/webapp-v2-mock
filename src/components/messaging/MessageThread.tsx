'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/types'

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
  currentUserRole: 'client' | 'expert'
}

export function MessageThread({
  messages,
  currentUserId,
  currentUserRole,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Group messages by date
  const messagesByDate = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, Message[]>
  )

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">Send a message to start the conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              {date}
            </div>
          </div>
          {/* Messages for this date */}
          <div className="space-y-3">
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderRole === currentUserRole}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
