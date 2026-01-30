import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getExpertRequestById,
  getCandidateById,
  updateCandidateStatus,
  updateCandidate,
  addCandidateNote,
  removeCandidate,
} from '@/mock/data/expert-requests'
import {
  updateCandidateStatusSchema,
  addCandidateNoteSchema,
} from '@/lib/validations/requests'
import type { CandidateStatus } from '@/types'

interface RouteParams {
  params: Promise<{ id: string; candidateId: string }>
}

// GET /api/requests/[id]/candidates/[candidateId] - Get a single candidate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, candidateId } = await params

    const expertRequest = getExpertRequestById(id)
    if (!expertRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check ownership
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidate = getCandidateById(candidateId)
    if (!candidate || candidate.requestId !== id) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ candidate })
  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/requests/[id]/candidates/[candidateId] - Update a candidate
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, candidateId } = await params

    const expertRequest = getExpertRequestById(id)
    if (!expertRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check ownership
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidate = getCandidateById(candidateId)
    if (!candidate || candidate.requestId !== id) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    const userId = session.user.id
    const userName = session.user.name || 'Unknown User'

    const body = await request.json()
    const { action } = body

    // Handle different update actions
    if (action === 'status') {
      // Update status
      const validationResult = updateCandidateStatusSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.flatten() },
          { status: 400 }
        )
      }

      const { status, note } = validationResult.data

      const updatedCandidate = updateCandidateStatus(
        candidateId,
        status as CandidateStatus,
        userId,
        note
      )

      if (!updatedCandidate) {
        return NextResponse.json(
          { error: 'Failed to update candidate' },
          { status: 500 }
        )
      }

      return NextResponse.json({ candidate: updatedCandidate })
    } else if (action === 'note') {
      // Add note
      const validationResult = addCandidateNoteSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.flatten() },
          { status: 400 }
        )
      }

      const { note } = validationResult.data

      const updatedCandidate = addCandidateNote(
        candidateId,
        userId,
        userName,
        note
      )

      if (!updatedCandidate) {
        return NextResponse.json(
          { error: 'Failed to add note' },
          { status: 500 }
        )
      }

      return NextResponse.json({ candidate: updatedCandidate })
    } else {
      // Generic update (for external profile updates, etc.)
      const updatedCandidate = updateCandidate(candidateId, body)

      if (!updatedCandidate) {
        return NextResponse.json(
          { error: 'Failed to update candidate' },
          { status: 500 }
        )
      }

      return NextResponse.json({ candidate: updatedCandidate })
    }
  } catch (error) {
    console.error('Error updating candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/requests/[id]/candidates/[candidateId] - Remove a candidate
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, candidateId } = await params

    const expertRequest = getExpertRequestById(id)
    if (!expertRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check ownership
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidate = getCandidateById(candidateId)
    if (!candidate || candidate.requestId !== id) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    const removed = removeCandidate(candidateId)

    if (!removed) {
      return NextResponse.json(
        { error: 'Failed to remove candidate' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
