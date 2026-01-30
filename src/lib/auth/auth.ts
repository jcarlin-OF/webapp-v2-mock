import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { validateCredentials } from '@/mock/data/users'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = validateCredentials(
          credentials.email as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        // Return user object that will be stored in the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          expertId: user.expertId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id as string
        token.role = user.role as 'client' | 'expert' | 'admin'
        token.expertId = user.expertId as string | undefined
      }
      return token
    },
    async session({ session, token }) {
      // Add token data to session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'client' | 'expert' | 'admin'
        session.user.expertId = token.expertId as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
})
