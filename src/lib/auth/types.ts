import type { DefaultSession } from 'next-auth'
import type { JWT as DefaultJWT } from '@auth/core/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    role: 'client' | 'expert' | 'admin'
    expertId?: string
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role: 'client' | 'expert' | 'admin'
      expertId?: string
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: 'client' | 'expert' | 'admin'
    expertId?: string
  }
}
