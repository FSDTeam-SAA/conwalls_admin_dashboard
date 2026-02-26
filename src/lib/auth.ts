import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          )

          const response = await res.json()

          if (!res.ok || !response?.status) {
            throw new Error(response?.message || 'Login failed')
          }

          const { user, accessToken } = response.data

          return {
            id: user._id,
            email: user.email,
            role: user.role,
            language: user.language,
            profileImage: user.profileImage || '',
            accessToken,
            refreshToken: user.refreshToken || '',
          }
        } catch (error) {
          console.error('Authentication error:', error)
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Authentication failed. Please try again.'
          throw new Error(errorMessage)
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email ?? ''
        token.role = user.role
        token.language = user.language
        token.profileImage = user.profileImage
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email ?? '',
        role: token.role,
        language: token.language,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
      return session
    },
  },
}
