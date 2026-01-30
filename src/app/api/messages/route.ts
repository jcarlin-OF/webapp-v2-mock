import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { MESSAGING_CONFIG } from '@/lib/messaging/constants'
import type { Conversation } from '@/types'
import {
  getConversationsByClientId,
  getConversationsByExpertId,
  getUnreadCount,
  findExistingConversation,
  createConversation,
  createMessage,
  getConversationById,
} from '@/mock/data/messages'
import { mockUsers } from '@/mock/data/users'

// GET /api/messages - Get all conversations for the current user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role as 'client' | 'expert'

    let conversations: Conversation[]
    if (userRole === 'client') {
      conversations = getConversationsByClientId(userId)
    } else {
      // For experts, find their expert ID
      const user = mockUsers.find((u) => u.id === userId)
      if (user?.expertId) {
        conversations = getConversationsByExpertId(user.expertId)
      } else {
        conversations = []
      }
    }

    const unreadCount = getUnreadCount(userId, userRole)

    return NextResponse.json({
      conversations,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create a new message or start a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role as 'client' | 'expert'
    const body = await request.json()

    // Start a new conversation
    if (body.startNew && body.expertId) {
      if (userRole !== 'client') {
        return NextResponse.json(
          { error: 'Only clients can start conversations' },
          { status: 403 }
        )
      }

      // Check if conversation already exists
      let conversation = findExistingConversation(userId, body.expertId)

      if (!conversation) {
        conversation = createConversation({
          expertId: body.expertId,
          clientId: userId,
        })
      }

      return NextResponse.json({ conversation })
    }

    // Send a message to existing conversation
    if (body.conversationId && body.content) {
      const conversation = getConversationById(body.conversationId)

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }

      // Verify user is part of conversation
      const isClient = conversation.clientId === userId
      const isExpert =
        userRole === 'expert' &&
        mockUsers.find((u) => u.id === userId)?.expertId === conversation.expertId

      if (!isClient && !isExpert) {
        return NextResponse.json(
          { error: 'Not authorized to send messages in this conversation' },
          { status: 403 }
        )
      }

      // Check free tier limit for clients
      if (
        isClient &&
        conversation.clientMessageCount >=
          MESSAGING_CONFIG.FREE_MESSAGES_PER_EXPERT
      ) {
        return NextResponse.json(
          {
            error: 'MESSAGE_LIMIT_REACHED',
            message:
              'You have reached your free message limit with this expert. Upgrade to Pro for unlimited messaging.',
            upgradeUrl: '/pricing',
          },
          { status: 403 }
        )
      }

      // Validate message content
      if (
        body.content.length < MESSAGING_CONFIG.MESSAGE_MIN_LENGTH ||
        body.content.length > MESSAGING_CONFIG.MESSAGE_MAX_LENGTH
      ) {
        return NextResponse.json(
          {
            error: `Message must be between ${MESSAGING_CONFIG.MESSAGE_MIN_LENGTH} and ${MESSAGING_CONFIG.MESSAGE_MAX_LENGTH} characters`,
          },
          { status: 400 }
        )
      }

      const message = createMessage({
        conversationId: body.conversationId,
        senderId: userId,
        senderRole: userRole,
        content: body.content,
      })

      const updatedConversation = getConversationById(body.conversationId)

      return NextResponse.json({
        message,
        clientMessageCount: updatedConversation?.clientMessageCount ?? 0,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
