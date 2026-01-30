'use client'

import { cn } from '@/lib/utils'
import { Check, CheckCheck } from 'lucide-react'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
  showReadStatus?: boolean
}

export function MessageBubble({
  message,
  isOwnMessage,
  showReadStatus = true,
}: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'flex flex-col max-w-[80%] sm:max-w-[70%]',
        isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div
        className={cn(
          'px-4 py-2.5 rounded-2xl',
          isOwnMessage
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
      <div
        className={cn(
          'flex items-center gap-1 mt-1 text-xs text-gray-400',
          isOwnMessage ? 'flex-row-reverse' : ''
        )}
      >
        <span>{formattedTime}</span>
        {isOwnMessage && showReadStatus && (
          <span className="ml-1">
            {message.readAt ? (
              <CheckCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </div>
    </div>
  )
}
