'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  isLimitReached?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  isLoading = false,
  isLimitReached = false,
  placeholder,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || isLoading || isLimitReached) return

    onSend(trimmed)
    setValue('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const getPlaceholder = () => {
    if (isLimitReached) {
      return 'Message limit reached. Start a new conversation to continue.'
    }
    if (placeholder) {
      return placeholder
    }
    return 'Describe your contract requirements or paste RFP text...'
  }

  const isDisabled = disabled || isLoading || isLimitReached
  const canSend = value.trim().length > 0 && !isDisabled

  return (
    <div className={cn('flex gap-2 items-end', className)}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={isDisabled}
          rows={1}
          className={cn(
            'w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[48px] max-h-[200px]'
          )}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            type="button"
            size="icon"
            onClick={handleSubmit}
            disabled={!canSend}
            className={cn(
              'h-8 w-8 rounded-lg',
              canSend
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-100 text-gray-400'
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
