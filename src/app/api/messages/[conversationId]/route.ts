import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getConversationWithMessages,
  getConversationById,
} from '@/mock/data/messages'
import { mockUsers } from '@/mock/data/users'

interface RouteParams {
  params: Promise<{ conversationId: string }>
}

// GET /api/messages/[conversationId] - Get conversation with all messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params
    const userId = session.user.id
    const userRole = session.user.role as 'client' | 'expert'

    const conversation = getConversationById(conversationId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this conversation
    const isClient = conversation.clientId === userId
    const isExpert =
      userRole === 'expert' &&
      mockUsers.find((u) => u.id === userId)?.expertId === conversation.expertId

    if (!isClient && !isExpert) {
      return NextResponse.json(
        { error: 'Not authorized to view this conversation' },
        { status: 403 }
      )
    }

    const conversationWithMessages = getConversationWithMessages(conversationId)

    return NextResponse.json({ conversation: conversationWithMessages })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
