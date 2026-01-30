import { NextRequest, NextResponse } from 'next/server'
import { getPublicRequestInfo } from '@/mock/data/expert-requests'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/public/requests/[slug] - Get public request info (no auth required)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const publicRequest = getPublicRequestInfo(slug)

    if (!publicRequest) {
      return NextResponse.json(
        { error: 'Request not found or not public' },
        { status: 404 }
      )
    }

    return NextResponse.json({ request: publicRequest })
  } catch (error) {
    console.error('Error fetching public request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
