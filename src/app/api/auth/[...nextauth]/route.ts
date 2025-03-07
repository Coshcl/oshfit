import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserById, getUserByUsername, createUser, validateUserCredentials } from '@/lib/db/models/user'
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
        if (!credentials?.username || !credentials?.password) return null

        const username = credentials.username.toLowerCase()
        
        // Validar credenciales
        const isValid = await validateUserCredentials(username, credentials.password)
        if (!isValid) return null
        
        // Buscar por nombre de usuario (más fiable)
        let user = await getUserByUsername(username)
        
        // Si no existe y es uno de los usuarios predefinidos, crearlo
        if (!user && ['cosh', 'rosch', 'maquin', 'flosh'].includes(username)) {
          // Asegurarnos de que el ID coincida exactamente con uno de los tipos UserType
          // Primera letra mayúscula y resto minúscula para coincidir con 'Cosh', 'Rosch', etc.
          const userId = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase() as UserType
          
          const newUser = {
            id: userId,
            name: username,
            logs: [],
            achievements: achievements,
            oshfitScore: 0,
            password: 'password123' // Contraseña por defecto para usuarios predefinidos
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      }
    }
  }
})

export { handler as GET, handler as POST } 