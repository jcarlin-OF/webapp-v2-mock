import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getExpertRequestsByUserId,
  createExpertRequest,
} from '@/mock/data/expert-requests'
import { createExpertRequestSchema } from '@/lib/validations/requests'
import type { ExpertRequestState, ClearanceLevel, Qualification } from '@/types'

// GET /api/requests - Get all requests for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state') as ExpertRequestState | null

    let requests = getExpertRequestsByUserId(userId)

    // Filter by state if provided
    if (state) {
      requests = requests.filter((r) => r.state === state)
    }

    // Sort by created date descending
    requests = requests.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/requests - Create a new request
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userName = session.user.name || 'Unknown User'
    const userEmail = session.user.email || ''

    const body = await request.json()

    // Validate request body
    const validationResult = createExpertRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate IDs for qualifications if not present
    const qualifications: Qualification[] = (data.qualifications || []).map(
      (q, index) => ({
        ...q,
        id: q.id || `q_${Date.now()}_${index}`,
      })
    )

    // Create the request
    const newRequest = createExpertRequest({
      createdById: userId,
      createdBy: {
        id: userId,
        name: userName,
        email: userEmail,
      },
      title: data.title,
      description: data.description,
      agency: data.agency,
      contractType: data.contractType,
      naicsCode: data.naicsCode,
      deadline: data.deadline,
      requiredExpertise: data.requiredExpertise,
      clearanceRequired: data.clearanceRequired as ClearanceLevel | undefined,
      qualifications,
      state: (data.state || 'draft') as ExpertRequestState,
      isPublic: data.isPublic ?? true,
    })

    return NextResponse.json({ request: newRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
