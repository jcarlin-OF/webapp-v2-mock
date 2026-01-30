'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { Conversation, Message, ConversationWithMessages } from '@/types'
import { MESSAGING_CONFIG } from '@/lib/messaging/constants'

export interface UseMessagesReturn {
  // State
  conversations: Conversation[]
  currentConversation: ConversationWithMessages | null
  isLoading: boolean
  isSending: boolean
  error: string | null
  unreadCount: number

  // Actions
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  startConversation: (expertId: string) => Promise<Conversation | null>
  markAsRead: () => Promise<void>
  clearError: () => void

  // Computed
  canSendMessage: boolean
  messagesRemaining: number
  isLimitReached: boolean
}

export function useMessages(): UseMessagesReturn {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] =
    useState<ConversationWithMessages | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const userId = session?.user?.id
  const userRole = session?.user?.role as 'client' | 'expert' | undefined

  // Free tier: 3 messages per expert
  const messagesRemaining =
    currentConversation && userRole === 'client'
      ? Math.max(
          0,
          MESSAGING_CONFIG.FREE_MESSAGES_PER_EXPERT -
            currentConversation.clientMessageCount
        )
      : Infinity

  const isLimitReached = userRole === 'client' && messagesRemaining <= 0
  const canSendMessage = !isLimitReached && !isSending && !!currentConversation

  // Load all conversations for the user
  const loadConversations = useCallback(async () => {
    if (!userId || !userRole) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/messages')
      if (!response.ok) {
        throw new Error('Failed to load conversations')
      }

      const data = await response.json()
      setConversations(data.conversations)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [userId, userRole])

  // Select and load a specific conversation
  const selectConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/messages/${conversationId}`)
        if (!response.ok) {
          throw new Error('Failed to load conversation')
        }

        const data = await response.json()
        setCurrentConversation(data.conversation)

        // Mark messages as read
        await fetch(`/api/messages/${conversationId}/read`, {
          method: 'POST',
        })

        // Update unread count
        await loadConversations()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    },
    [userId, loadConversations]
  )

  // Send a message in the current conversation
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentConversation || !userId || !userRole) return
      if (userRole === 'client' && isLimitReached) {
        setError('Message limit reached. Upgrade to Pro for unlimited messaging.')
        return
      }

      setIsSending(true)
      setError(null)

      // Optimistic update
      const optimisticMessage: Message = {
        id: `temp_${Date.now()}`,
        conversationId: currentConversation.id,
        senderId: userId,
        senderRole: userRole,
        content,
        createdAt: new Date().toISOString(),
      }

      setCurrentConversation((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, optimisticMessage],
          clientMessageCount:
            userRole === 'client'
              ? prev.clientMessageCount + 1
              : prev.clientMessageCount,
        }
      })

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: currentConversation.id,
            content,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to send message')
        }

        const data = await response.json()

        // Replace optimistic message with real one
        setCurrentConversation((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            messages: prev.messages.map((m) =>
              m.id === optimisticMessage.id ? data.message : m
            ),
            clientMessageCount: data.clientMessageCount,
          }
        })

        // Refresh conversations list
        await loadConversations()
      } catch (err) {
        // Rollback optimistic update
        setCurrentConversation((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            messages: prev.messages.filter((m) => m.id !== optimisticMessage.id),
            clientMessageCount:
              userRole === 'client'
                ? prev.clientMessageCount - 1
                : prev.clientMessageCount,
          }
        })

        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsSending(false)
      }
    },
    [currentConversation, userId, userRole, isLimitReached, loadConversations]
  )

  // Start a new conversation with an expert
  const startConversation = useCallback(
    async (expertId: string): Promise<Conversation | null> => {
      if (!userId) return null

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expertId, startNew: true }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to start conversation')
        }

        const data = await response.json()
        await loadConversations()
        return data.conversation
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [userId, loadConversations]
  )

  // Mark current conversation as read
  const markAsRead = useCallback(async () => {
    if (!currentConversation) return

    try {
      await fetch(`/api/messages/${currentConversation.id}/read`, {
        method: 'POST',
      })
      await loadConversations()
    } catch {
      // Silent fail for read receipts
    }
  }, [currentConversation, loadConversations])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load conversations on mount and set up polling
  useEffect(() => {
    if (userId && userRole) {
      loadConversations()

      // Set up polling for new messages
      pollIntervalRef.current = setInterval(() => {
        loadConversations()
        if (currentConversation) {
          selectConversation(currentConversation.id)
        }
      }, MESSAGING_CONFIG.POLLING_INTERVAL)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [userId, userRole]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    conversations,
    currentConversation,
    isLoading,
    isSending,
    error,
    unreadCount,
    loadConversations,
    selectConversation,
    sendMessage,
    startConversation,
    markAsRead,
    clearError,
    canSendMessage,
    messagesRemaining,
    isLimitReached,
  }
}
