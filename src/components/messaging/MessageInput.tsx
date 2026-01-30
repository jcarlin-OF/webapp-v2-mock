'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MESSAGING_CONFIG } from '@/lib/messaging/constants'

interface MessageInputProps {
  onSend: (content: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
  messagesRemaining?: number
  showLimit?: boolean
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  messagesRemaining,
  showLimit = false,
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(async () => {
    const trimmedContent = content.trim()
    if (!trimmedContent || isSending || disabled) return

    setIsSending(true)
    try {
      await onSend(trimmedContent)
      setContent('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } finally {
      setIsSending(false)
    }
  }, [content, isSending, disabled, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  const isOverLimit = content.length > MESSAGING_CONFIG.MESSAGE_MAX_LENGTH
  const canSend =
    content.trim().length >= MESSAGING_CONFIG.MESSAGE_MIN_LENGTH &&
    !isOverLimit &&
    !disabled &&
    !isSending

  return (
    <div className="border-t bg-white p-4">
      {showLimit && messagesRemaining !== undefined && messagesRemaining < 5 && (
        <div className="text-xs text-gray-500 mb-2">
          {messagesRemaining > 0 ? (
            <span>
              {messagesRemaining} free message{messagesRemaining !== 1 ? 's' : ''}{' '}
              remaining
            </span>
          ) : (
            <span className="text-error">Message limit reached</span>
          )}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className={cn(
              'w-full resize-none rounded-lg border bg-white px-4 py-2.5 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
              isOverLimit && 'border-error focus:border-error focus:ring-error/20'
            )}
            style={{ maxHeight: '150px' }}
          />
          {content.length > 0 && (
            <div
              className={cn(
                'absolute bottom-1 right-2 text-xs',
                isOverLimit ? 'text-error' : 'text-gray-400'
              )}
            >
              {content.length}/{MESSAGING_CONFIG.MESSAGE_MAX_LENGTH}
            </div>
          )}
        </div>
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
