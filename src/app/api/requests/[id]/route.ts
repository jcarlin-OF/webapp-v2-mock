import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getExpertRequestById,
  updateExpertRequest,
  deleteExpertRequest,
  getCandidatesWithExperts,
} from '@/mock/data/expert-requests'
import { updateExpertRequestSchema } from '@/lib/validations/requests'
import type { ExpertRequestState, ClearanceLevel } from '@/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/requests/[id] - Get a single request with candidates
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

    // Check ownership (in production, also check team membership)
    if (expertRequest.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get candidates with enriched expert data
    const candidates = getCandidatesWithExperts(id)

    return NextResponse.json({
      request: expertRequest,
      candidates,
    })
  } catch (error) {
    console.error('Error fetching request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/requests/[id] - Update a request
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json()

    // Validate request body
    const validationResult = updateExpertRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Build update object
    const updates: Parameters<typeof updateExpertRequest>[1] = {}

    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.agency !== undefined) updates.agency = data.agency
    if (data.contractType !== undefined) updates.contractType = data.contractType
    if (data.naicsCode !== undefined) updates.naicsCode = data.naicsCode
    if (data.deadline !== undefined) updates.deadline = data.deadline
    if (data.requiredExpertise !== undefined)
      updates.requiredExpertise = data.requiredExpertise
    if (data.clearanceRequired !== undefined)
      updates.clearanceRequired = data.clearanceRequired as ClearanceLevel
    if (data.qualifications !== undefined)
      updates.qualifications = data.qualifications.map((q, index) => ({
        ...q,
        id: q.id || `q_${Date.now()}_${index}`,
      }))
    if (data.state !== undefined) updates.state = data.state as ExpertRequestState
    if (data.isPublic !== undefined) updates.isPublic = data.isPublic
    if (data.closeReason !== undefined) updates.closeReason = data.closeReason

    const updatedRequest = updateExpertRequest(id, updates)

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/requests/[id] - Delete a request
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const deleted = deleteExpertRequest(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
