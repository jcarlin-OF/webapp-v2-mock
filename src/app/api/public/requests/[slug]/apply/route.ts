import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getExpertRequestBySlug,
  addCandidate,
  addQualificationResponses,
  getCandidatesByExpertId,
} from '@/mock/data/expert-requests'
import { mockUsers } from '@/mock/data/users'
import { publicApplicationSchema } from '@/lib/validations/requests'
import type { CandidateStatus, QualificationResponse } from '@/types'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// POST /api/public/requests/[slug]/apply - Submit an application
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    // Get the request
    const expertRequest = getExpertRequestBySlug(slug)

    if (!expertRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (!expertRequest.isPublic) {
      return NextResponse.json(
        { error: 'This request is not accepting public applications' },
        { status: 403 }
      )
    }

    if (expertRequest.state !== 'open') {
      return NextResponse.json(
        { error: 'This request is not accepting applications' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate application data
    const validationResult = publicApplicationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { responses, name, email, linkedinUrl, headline } = validationResult.data

    // Check if user is authenticated
    const session = await auth()
    let expertId: string | undefined
    let candidateName = name || 'Anonymous'

    if (session?.user?.id) {
      // Authenticated user - find their expert profile
      const user = mockUsers.find((u) => u.id === session.user?.id)
      if (user?.expertId) {
        expertId = user.expertId

        // Check if already a candidate
        const existingCandidates = getCandidatesByExpertId(expertId)
        const alreadyCandidate = existingCandidates.some(
          (c) => c.requestId === expertRequest.id
        )

        if (alreadyCandidate) {
          return NextResponse.json(
            { error: 'You have already applied to this request' },
            { status: 400 }
          )
        }

        candidateName = session.user.name || name || 'Unknown'
      }
    }

    // Validate required qualification responses
    const requiredQualifications = expertRequest.qualifications.filter(
      (q) => q.required
    )
    const responseMap = new Map(
      responses.map((r) => [r.qualificationId, r.answer])
    )

    for (const qual of requiredQualifications) {
      const answer = responseMap.get(qual.id)
      if (
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        return NextResponse.json(
          { error: `Required question "${qual.question}" was not answered` },
          { status: 400 }
        )
      }
    }

    // Create the candidate
    const newCandidate = addCandidate({
      requestId: expertRequest.id,
      expertId,
      externalProfile: !expertId
        ? {
            name: candidateName,
            email,
            linkedinUrl,
            headline,
          }
        : undefined,
      status: 'interested' as CandidateStatus,
      statusHistory: [
        {
          status: 'interested',
          changedBy: session?.user?.id || 'public_link',
          changedAt: new Date().toISOString(),
        },
      ],
      qualificationResponses: responses as QualificationResponse[],
      internalNotes: [],
      source: 'public_link',
      addedById: session?.user?.id || 'public_link',
      addedBy: session?.user?.name || 'Public Link',
    })

    return NextResponse.json(
      {
        success: true,
        candidateId: newCandidate.id,
        message: 'Your application has been submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
