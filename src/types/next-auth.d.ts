/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            role: string
            language: string
            profileImage: string
            accessToken: string
            refreshToken: string
        } & DefaultSession['user']
    }

    interface User {
        id: string
        email: string
        role: string
        language: string
        profileImage: string
        accessToken: string
        refreshToken: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        email: string
        role: string
        language: string
        profileImage: string
        accessToken: string
        refreshToken: string
    }
}
