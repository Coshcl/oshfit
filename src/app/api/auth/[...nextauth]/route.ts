import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByUsername, createUser } from '@/lib/db/models/user'
import { achievements } from '@/lib/config/achievements'
import { UserType } from '@/lib/types'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null
        
        // Simplificamos drásticamente - cualquier usuario puede iniciar sesión
        // Este enfoque es solo para hacer que el sistema funcione básicamente
        const username = credentials.username.toLowerCase()
        
        // Predefined users
        const predefinedUsers = ['cosh', 'rosch', 'maquin', 'flosh']
        const isPredefined = predefinedUsers.includes(username)
        
        // Check if user exists
        let user = await getUserByUsername(username)
        
        // Create user if it doesn't exist (for predefined users only)
        if (!user && isPredefined) {
          const userId = username.charAt(0).toUpperCase() + username.slice(1) as UserType
          
          const newUser = {
            id: userId,
            name: username,
            logs: [],
            achievements: achievements,
            oshfitScore: 0
          }
          
          await createUser(newUser)
          user = newUser
        }
        
        if (!user) return null
        
        return {
          id: user.id,
          name: user.name,
          email: `${username}@example.com`
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})

export { handler as GET, handler as POST } 