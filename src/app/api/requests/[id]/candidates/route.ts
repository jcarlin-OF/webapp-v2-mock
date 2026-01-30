import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getExpertRequestById,
  getCandidatesWithExperts,
  addCandidate,
  addCandidateNote,
} from '@/mock/data/expert-requests'
import { getExpertById } from '@/mock/data/experts'
import {
  addPlatformCandidateSchema,
  addLinkedInCandidateSchema,
} from '@/lib/validations/requests'
import type { CandidateStatus, ExpertCandidate } from '@/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/requests/[id]/candidates - Get all candidates for a request
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const expertRequest = getExpertRequestById(id)

    if (!expertRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check ownership
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidates = getCandidatesWithExperts(id)

    return NextResponse.json({ candidates })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/requests/[id]/candidates - Add a candidate to a request
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const expertRequest = getExpertRequestById(id)

    if (!expertRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check ownership
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const userName = session.user.name || 'Unknown User'

    const body = await request.json()
    const { type } = body // 'platform' or 'linkedin'

    let newCandidate: ExpertCandidate

    if (type === 'platform') {
      // Validate platform candidate data
      const validationResult = addPlatformCandidateSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.flatten() },
          { status: 400 }
        )
      }

      const { expertId, note } = validationResult.data

      // Verify expert exists
      const expert = getExpertById(expertId)
      if (!expert) {
        return NextResponse.json(
          { error: 'Expert not found' },
          { status: 404 }
        )
      }

      // Check if expert is already a candidate
      const existingCandidates = getCandidatesWithExperts(id)
      if (existingCandidates.some((c) => c.expertId === expertId)) {
        return NextResponse.json(
          { error: 'Expert is already a candidate for this request' },
          { status: 400 }
        )
      }

      newCandidate = addCandidate({
        requestId: id,
        expertId,
        status: 'identified' as CandidateStatus,
        statusHistory: [
          {
            status: 'identified',
            changedBy: userId,
            changedAt: new Date().toISOString(),
          },
        ],
        qualificationResponses: [],
        internalNotes: [],
        source: 'platform',
        addedById: userId,
        addedBy: userName,
      })

      // Add initial note if provided
      if (note) {
        addCandidateNote(newCandidate.id, userId, userName, note)
      }
    } else if (type === 'linkedin') {
      // Validate LinkedIn candidate data
      const validationResult = addLinkedInCandidateSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.flatten() },
          { status: 400 }
        )
      }

      const { name, email, linkedinUrl, headline, note } = validationResult.data

      newCandidate = addCandidate({
        requestId: id,
        externalProfile: {
          name,
          email,
          linkedinUrl,
          headline,
        },
        status: 'identified' as CandidateStatus,
        statusHistory: [
          {
            status: 'identified',
            changedBy: userId,
            changedAt: new Date().toISOString(),
          },
        ],
        qualificationResponses: [],
        internalNotes: [],
        source: 'linkedin',
        addedById: userId,
        addedBy: userName,
      })

      // Add initial note if provided
      if (note) {
        addCandidateNote(newCandidate.id, userId, userName, note)
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid candidate type. Must be "platform" or "linkedin"' },
        { status: 400 }
      )
    }

    return NextResponse.json({ candidate: newCandidate }, { status: 201 })
  } catch (error) {
    console.error('Error adding candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
