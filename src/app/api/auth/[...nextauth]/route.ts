import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserById } from '@/lib/db/models/user'

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

        // Por ahora, solo permitimos los usuarios predefinidos
        const allowedUsers = ['cosh', 'rosch', 'maquin', 'flosh']
        const username = credentials.username.toLowerCase()
        
        if (!allowedUsers.includes(username)) {
          return null
        }

        // En el futuro, aquí verificaremos la contraseña contra la base de datos
        const user = await getUserById(username.charAt(0).toUpperCase() + username.slice(1))
        
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
    }
  }
})

export { handler as GET, handler as POST } 