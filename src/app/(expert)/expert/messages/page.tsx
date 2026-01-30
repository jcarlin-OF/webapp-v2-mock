'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageSquare, Loader2 } from 'lucide-react'
import { useMessages } from '@/hooks/use-messages'
import {
  ConversationList,
  ConversationHeader,
  MessageThread,
  MessageInput,
} from '@/components/messaging'
import { cn } from '@/lib/utils'

function ExpertMessagesContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showMobileList, setShowMobileList] = useState(true)

  const {
    conversations,
    currentConversation,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    canSendMessage,
  } = useMessages()

  const userId = session?.user?.id
  const userRole = session?.user?.role as 'client' | 'expert' | undefined

  // Handle URL params for direct conversation access
  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId && conversations.length > 0) {
      selectConversation(conversationId)
      setShowMobileList(false)
    }
  }, [searchParams, conversations.length, selectConversation])

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId)
    setShowMobileList(false)
    // Update URL
    router.push(`/expert/messages?conversation=${conversationId}`, {
      scroll: false,
    })
  }

  const handleBack = () => {
    setShowMobileList(true)
    router.push('/expert/messages', { scroll: false })
  }

  if (!userId || userRole !== 'expert') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900">
          Messages
        </h1>
        <p className="text-gray-600 mt-1">
          Respond to client inquiries and pre-booking questions
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="flex h-[calc(100vh-280px)] min-h-[500px]">
          {/* Conversations List */}
          <div
            className={cn(
              'w-full lg:w-80 border-r flex-shrink-0 flex flex-col',
              showMobileList ? 'flex' : 'hidden lg:flex'
            )}
          >
            <div className="p-4 border-b">
              <h2 className="font-medium text-gray-900">Client Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeConversationId={currentConversation?.id}
                onSelectConversation={handleSelectConversation}
                currentUserRole="expert"
                isLoading={isLoading && conversations.length === 0}
              />
            </div>
          </div>

          {/* Message Thread */}
          <div
            className={cn(
              'flex-1 flex flex-col',
              !showMobileList ? 'flex' : 'hidden lg:flex'
            )}
          >
            {currentConversation ? (
              <>
                <ConversationHeader
                  conversation={currentConversation}
                  currentUserRole="expert"
                  onBack={handleBack}
                  showBackButton
                />
                <MessageThread
                  messages={currentConversation.messages}
                  currentUserId={userId}
                  currentUserRole="expert"
                />
                <MessageInput
                  onSend={sendMessage}
                  disabled={!canSendMessage}
                  placeholder="Reply to client..."
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium">Select a conversation</p>
                  <p className="text-sm mt-1">
                    Choose a conversation to view and respond to client messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpertMessagesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900">
          Messages
        </h1>
        <p className="text-gray-600 mt-1">
          Respond to client inquiries and pre-booking questions
        </p>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="flex h-[calc(100vh-280px)] min-h-[500px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default function ExpertMessagesPage() {
  return (
    <Suspense fallback={<ExpertMessagesLoading />}>
      <ExpertMessagesContent />
    </Suspense>
  )
}
