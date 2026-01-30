'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AI_MATCH_CONFIG } from '@/lib/ai-match/constants'
import { generateMessageId } from '@/lib/ai-match/mock-responses'
import type {
  ChatMessage,
  ChatSession,
  SerializedChatSession,
  ChatAPIResponse,
} from '@/lib/ai-match/types'

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function serializeSession(session: ChatSession): SerializedChatSession {
  return {
    ...session,
    messages: session.messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    })),
  }
}

function deserializeSession(serialized: SerializedChatSession): ChatSession {
  return {
    ...serialized,
    messages: serialized.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })),
  }
}

function loadSessionFromStorage(): ChatSession | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(AI_MATCH_CONFIG.SESSION_STORAGE_KEY)
    if (!stored) return null

    const serialized = JSON.parse(stored) as SerializedChatSession
    return deserializeSession(serialized)
  } catch {
    return null
  }
}

function saveSessionToStorage(session: ChatSession): void {
  if (typeof window === 'undefined') return

  try {
    const serialized = serializeSession(session)
    localStorage.setItem(
      AI_MATCH_CONFIG.SESSION_STORAGE_KEY,
      JSON.stringify(serialized)
    )
  } catch {
    // Ignore storage errors
  }
}

function clearSessionStorage(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(AI_MATCH_CONFIG.SESSION_STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

function createNewSession(): ChatSession {
  return {
    id: generateSessionId(),
    messages: [],
    messageCount: 0,
    maxMessages: AI_MATCH_CONFIG.MAX_MESSAGES_PER_SESSION,
    createdAt: new Date().toISOString(),
  }
}

export interface UseAIChatReturn {
  // State
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  messageCount: number
  maxMessages: number
  messagesRemaining: number
  isLimitReached: boolean
  sessionId: string

  // Actions
  sendMessage: (content: string) => Promise<void>
  startNewConversation: () => void
  clearError: () => void
}

export function useAIChat(): UseAIChatReturn {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load session from storage on mount
  useEffect(() => {
    const stored = loadSessionFromStorage()
    if (stored) {
      setSession(stored)
    } else {
      setSession(createNewSession())
    }
    setIsInitialized(true)
  }, [])

  // Save session to storage whenever it changes
  useEffect(() => {
    if (isInitialized && session) {
      saveSessionToStorage(session)
    }
  }, [session, isInitialized])

  const sendMessage = useCallback(async (content: string) => {
    if (!session) return
    if (session.messageCount >= session.maxMessages) {
      setError('Message limit reached. Start a new conversation to continue.')
      return
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    // Create user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Optimistically add user message
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        messages: [...prev.messages, userMessage],
        messageCount: prev.messageCount + 1,
      }
    })

    setIsLoading(true)
    setError(null)

    try {
      // Build history for API
      const history = session.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch('/api/ai-match/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          message: content,
          history,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = (await response.json()) as ChatAPIResponse

      // Add assistant message with timestamp
      const assistantMessage: ChatMessage = {
        ...data.message,
        timestamp: new Date(data.message.timestamp),
      }

      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, assistantMessage],
          messageCount: prev.messageCount + 1,
        }
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }

      // Rollback optimistic update
      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: prev.messages.filter((msg) => msg.id !== userMessage.id),
          messageCount: prev.messageCount - 1,
        }
      })

      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [session])

  const startNewConversation = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    clearSessionStorage()
    setSession(createNewSession())
    setError(null)
    setIsLoading(false)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Compute derived state
  const messageCount = session?.messageCount ?? 0
  const maxMessages = session?.maxMessages ?? AI_MATCH_CONFIG.MAX_MESSAGES_PER_SESSION
  const messagesRemaining = maxMessages - messageCount
  const isLimitReached = messagesRemaining <= 0

  return {
    messages: session?.messages ?? [],
    isLoading,
    error,
    messageCount,
    maxMessages,
    messagesRemaining,
    isLimitReached,
    sessionId: session?.id ?? '',
    sendMessage,
    startNewConversation,
    clearError,
  }
}
