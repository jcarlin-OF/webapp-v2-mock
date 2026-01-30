import { NextResponse } from 'next/server'
import { AI_MATCH_CONFIG } from '@/lib/ai-match/constants'
import {
  generateMockResponse,
  createAssistantMessage,
} from '@/lib/ai-match/mock-responses'
import type { ChatAPIRequest, ChatAPIResponse } from '@/lib/ai-match/types'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatAPIRequest
    const { message, history } = body

    // Validate message
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length < AI_MATCH_CONFIG.MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message must be at least ${AI_MATCH_CONFIG.MIN_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    if (message.length > AI_MATCH_CONFIG.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message must be less than ${AI_MATCH_CONFIG.MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    // Simulate AI processing delay (500-2000ms)
    const delay =
      AI_MATCH_CONFIG.TYPING_MIN_DURATION_MS +
      Math.random() *
        (AI_MATCH_CONFIG.TYPING_MAX_DURATION_MS -
          AI_MATCH_CONFIG.TYPING_MIN_DURATION_MS)
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Generate mock response
    const mockResponse = generateMockResponse(message, history || [])
    const assistantMessage = createAssistantMessage(mockResponse)

    const response: ChatAPIResponse = {
      message: assistantMessage,
      requirements: mockResponse.requirements,
      recommendations: mockResponse.recommendations,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Match chat error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
