import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/expert']

// Routes that require specific roles
const clientOnlyRoutes = ['/dashboard']
const expertOnlyRoutes = ['/expert']

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route needs protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get the session
  const session = await auth()

  // If not authenticated, redirect to login
  if (!session?.user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = session.user.role

  // Check role-based access
  const isClientRoute = clientOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isExpertRoute = expertOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Client trying to access expert routes
  if (isExpertRoute && userRole !== 'expert') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Expert trying to access client routes
  if (isClientRoute && userRole === 'expert') {
    return NextResponse.redirect(new URL('/expert/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/expert/:path*',
  ],
}
