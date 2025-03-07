import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserType } from '@/lib/types'
import { achievements } from '@/lib/config/achievements'

// Lista de usuarios predefinidos para simplificar
const predefinedUsers = {
  cosh: { id: 'Cosh', name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch', name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin', name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh', name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

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
        
        // Simplificamos drásticamente: solo verificar si es un usuario predefinido
        const username = credentials.username.toLowerCase()
        
        // Si es un usuario predefinido, permitir acceso
        if (Object.keys(predefinedUsers).includes(username)) {
          console.log(`Login exitoso para usuario predefinido: ${username}`)
          return {
            id: username.charAt(0).toUpperCase() + username.slice(1),
            name: username,
            email: `${username}@example.com`
          }
        }
        
        console.log(`Usuario no encontrado: ${username}`)
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirigir a login en caso de error
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST } 