import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getConversationById, markMessagesAsRead } from '@/mock/data/messages'
import { mockUsers } from '@/mock/data/users'

interface RouteParams {
  params: Promise<{ conversationId: string }>
}

// POST /api/messages/[conversationId]/read - Mark messages as read
export async function POST(request: NextRequest, { params }: RouteParams) {
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
        { error: 'Not authorized to access this conversation' },
        { status: 403 }
      )
    }

    markMessagesAsRead(conversationId, userRole)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
