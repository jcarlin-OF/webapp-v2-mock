import type { Message, Conversation, ConversationWithMessages } from '@/types'
import { experts } from './experts'
import { mockUsers } from './users'

// Generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Mock conversations - in-memory store
export const conversations: Conversation[] = [
  {
    id: 'conv_001',
    expertId: 'exp_001',
    clientId: 'user_001',
    expert: {
      id: 'exp_001',
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      headline: 'Former Google PM | AI/ML Product Strategy',
    },
    client: {
      id: 'user_001',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    },
    lastMessage: {
      content:
        'Thanks for reaching out! Yes, I have extensive experience with CMMC compliance for DoD contractors.',
      createdAt: '2024-01-28T14:30:00.000Z',
      senderRole: 'expert',
    },
    lastMessageAt: '2024-01-28T14:30:00.000Z',
    status: 'active',
    createdAt: '2024-01-28T10:00:00.000Z',
    clientMessageCount: 2,
  },
  {
    id: 'conv_002',
    expertId: 'exp_003',
    clientId: 'user_001',
    expert: {
      id: 'exp_003',
      name: 'Michael Torres',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      headline: 'Cybersecurity Director | FedRAMP Expert',
    },
    client: {
      id: 'user_001',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    },
    lastMessage: {
      content:
        "I'd be happy to review your FedRAMP authorization package. When would you like to schedule a call?",
      createdAt: '2024-01-27T16:45:00.000Z',
      senderRole: 'expert',
    },
    lastMessageAt: '2024-01-27T16:45:00.000Z',
    status: 'active',
    createdAt: '2024-01-26T09:00:00.000Z',
    clientMessageCount: 3,
  },
]

// Mock messages - in-memory store
export const messages: Message[] = [
  // Conversation 1 messages
  {
    id: 'msg_001',
    conversationId: 'conv_001',
    senderId: 'user_001',
    senderRole: 'client',
    content:
      'Hi Sarah, I saw your profile and noticed your experience with DoD contracts. We\'re working on a proposal for a Defense Innovation Unit opportunity and need guidance on CMMC Level 2 compliance. Do you have experience with this?',
    createdAt: '2024-01-28T10:00:00.000Z',
    readAt: '2024-01-28T10:05:00.000Z',
  },
  {
    id: 'msg_002',
    conversationId: 'conv_001',
    senderId: 'user_exp_001',
    senderRole: 'expert',
    content:
      "Hi John! Yes, I've helped several small contractors achieve CMMC Level 2 certification. I worked on 3 DoD proposals last year that required this. What's your current compliance status?",
    createdAt: '2024-01-28T11:30:00.000Z',
    readAt: '2024-01-28T12:00:00.000Z',
  },
  {
    id: 'msg_003',
    conversationId: 'conv_001',
    senderId: 'user_001',
    senderRole: 'client',
    content:
      "We're about 60% compliant based on our self-assessment. The main gaps are around access control and incident response. The RFP deadline is in 45 days.",
    createdAt: '2024-01-28T13:15:00.000Z',
    readAt: '2024-01-28T13:20:00.000Z',
  },
  {
    id: 'msg_004',
    conversationId: 'conv_001',
    senderId: 'user_exp_001',
    senderRole: 'expert',
    content:
      'Thanks for reaching out! Yes, I have extensive experience with CMMC compliance for DoD contractors. 45 days is tight but doable if we focus on the critical controls first. I can help you create a remediation roadmap and review your SSP. Would you like to book a call to discuss specifics?',
    createdAt: '2024-01-28T14:30:00.000Z',
  },
  // Conversation 2 messages
  {
    id: 'msg_005',
    conversationId: 'conv_002',
    senderId: 'user_001',
    senderRole: 'client',
    content:
      "Hi Michael, we're looking at pursuing FedRAMP authorization for our SaaS platform. I understand you've helped multiple companies through this process. What's the typical timeline for a Low baseline?",
    createdAt: '2024-01-26T09:00:00.000Z',
    readAt: '2024-01-26T09:30:00.000Z',
  },
  {
    id: 'msg_006',
    conversationId: 'conv_002',
    senderId: 'user_exp_002',
    senderRole: 'expert',
    content:
      "Hello! Great question. For FedRAMP Low, you're typically looking at 6-12 months depending on your current security posture. The key factors are: 1) Your existing controls documentation, 2) Whether you have an agency sponsor, 3) Resources you can dedicate to the process. Have you started any preliminary work?",
    createdAt: '2024-01-26T11:00:00.000Z',
    readAt: '2024-01-26T11:30:00.000Z',
  },
  {
    id: 'msg_007',
    conversationId: 'conv_002',
    senderId: 'user_001',
    senderRole: 'client',
    content:
      "We have SOC 2 Type II already, so we have a lot of the controls documented. We're also in discussions with a potential agency sponsor at HHS. What would be the next steps?",
    createdAt: '2024-01-27T10:00:00.000Z',
    readAt: '2024-01-27T10:15:00.000Z',
  },
  {
    id: 'msg_008',
    conversationId: 'conv_002',
    senderId: 'user_001',
    senderRole: 'client',
    content:
      "Also, do you have experience working with 3PAOs? We're trying to understand the assessment process better.",
    createdAt: '2024-01-27T10:05:00.000Z',
    readAt: '2024-01-27T10:15:00.000Z',
  },
  {
    id: 'msg_009',
    conversationId: 'conv_002',
    senderId: 'user_exp_002',
    senderRole: 'expert',
    content:
      "I'd be happy to review your FedRAMP authorization package. When would you like to schedule a call? Having SOC 2 is a great foundation - about 60% of FedRAMP Low controls overlap. I've worked with several 3PAOs and can recommend ones that are efficient and thorough.",
    createdAt: '2024-01-27T16:45:00.000Z',
  },
]

// Helper functions

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}

export function getConversationsByClientId(clientId: string): Conversation[] {
  return conversations
    .filter((c) => c.clientId === clientId && c.status === 'active')
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )
}

export function getConversationsByExpertId(expertId: string): Conversation[] {
  // Get the expert's user ID from the mock users
  const expertUser = mockUsers.find((u) => u.expertId === expertId)
  if (!expertUser) return []

  return conversations
    .filter((c) => c.expertId === expertId && c.status === 'active')
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )
}

export function getMessagesByConversationId(conversationId: string): Message[] {
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

export function getConversationWithMessages(
  conversationId: string
): ConversationWithMessages | null {
  const conversation = getConversationById(conversationId)
  if (!conversation) return null

  const conversationMessages = getMessagesByConversationId(conversationId)
  return {
    ...conversation,
    messages: conversationMessages,
  }
}

export function getUnreadCount(
  userId: string,
  role: 'client' | 'expert'
): number {
  let count = 0

  const userConversations =
    role === 'client'
      ? getConversationsByClientId(userId)
      : (() => {
          // Find expert ID for this user
          const user = mockUsers.find((u) => u.id === userId)
          return user?.expertId
            ? getConversationsByExpertId(user.expertId)
            : []
        })()

  for (const conv of userConversations) {
    const convMessages = getMessagesByConversationId(conv.id)
    for (const msg of convMessages) {
      // Count messages from the other party that haven't been read
      if (msg.senderRole !== role && !msg.readAt) {
        count++
      }
    }
  }

  return count
}

export function findExistingConversation(
  clientId: string,
  expertId: string
): Conversation | undefined {
  return conversations.find(
    (c) =>
      c.clientId === clientId && c.expertId === expertId && c.status === 'active'
  )
}

export function createConversation(data: {
  expertId: string
  clientId: string
}): Conversation {
  const expert = experts.find((e) => e.id === data.expertId)
  const client = mockUsers.find((u) => u.id === data.clientId)

  if (!expert || !client) {
    throw new Error('Expert or client not found')
  }

  const newConversation: Conversation = {
    id: generateId('conv'),
    expertId: data.expertId,
    clientId: data.clientId,
    expert: {
      id: expert.id,
      name: expert.name,
      avatar: expert.avatar,
      headline: expert.headline,
    },
    client: {
      id: client.id,
      name: client.name,
      avatar: client.avatar,
    },
    lastMessageAt: new Date().toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
    clientMessageCount: 0,
  }

  conversations.push(newConversation)
  return newConversation
}

export function createMessage(data: {
  conversationId: string
  senderId: string
  senderRole: 'client' | 'expert'
  content: string
}): Message {
  const conversation = getConversationById(data.conversationId)
  if (!conversation) {
    throw new Error('Conversation not found')
  }

  const newMessage: Message = {
    id: generateId('msg'),
    conversationId: data.conversationId,
    senderId: data.senderId,
    senderRole: data.senderRole,
    content: data.content,
    createdAt: new Date().toISOString(),
  }

  messages.push(newMessage)

  // Update conversation
  const convIndex = conversations.findIndex((c) => c.id === data.conversationId)
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = {
      content: data.content,
      createdAt: newMessage.createdAt,
      senderRole: data.senderRole,
    }
    conversations[convIndex].lastMessageAt = newMessage.createdAt

    // Increment client message count if sender is client
    if (data.senderRole === 'client') {
      conversations[convIndex].clientMessageCount++
    }
  }

  return newMessage
}

export function markMessagesAsRead(
  conversationId: string,
  readerRole: 'client' | 'expert'
): void {
  const now = new Date().toISOString()

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (
      msg.conversationId === conversationId &&
      msg.senderRole !== readerRole &&
      !msg.readAt
    ) {
      messages[i] = { ...msg, readAt: now }
    }
  }
}

export function getClientMessageCount(
  clientId: string,
  expertId: string
): number {
  const conversation = findExistingConversation(clientId, expertId)
  return conversation?.clientMessageCount ?? 0
}
