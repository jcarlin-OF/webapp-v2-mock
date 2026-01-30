'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useAIChat } from '@/hooks/use-ai-chat'
import { WelcomeScreen } from './WelcomeScreen'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { RateLimitIndicator } from './RateLimitIndicator'

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    error,
    messageCount,
    maxMessages,
    messagesRemaining,
    isLimitReached,
    sendMessage,
    startNewConversation,
    clearError,
  } = useAIChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleExampleClick = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const hasMessages = messages.length > 0

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with rate limit */}
      {hasMessages && (
        <div className="flex-shrink-0 px-4 py-3 border-b bg-white flex items-center justify-between gap-4">
          <RateLimitIndicator
            messagesRemaining={messagesRemaining}
            maxMessages={maxMessages}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewConversation}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        {!hasMessages ? (
          <WelcomeScreen onExampleClick={handleExampleClick} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-4 h-4 text-gray-600">AI</div>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex-shrink-0 px-4 py-2">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit reached message */}
      {isLimitReached && (
        <div className="flex-shrink-0 px-4 py-2">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border">
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached the message limit for this session.
              </p>
              <Button onClick={startNewConversation} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-4 border-t bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            isLimitReached={isLimitReached}
            placeholder={
              hasMessages
                ? 'Add more details or ask a follow-up question...'
                : undefined
            }
          />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
