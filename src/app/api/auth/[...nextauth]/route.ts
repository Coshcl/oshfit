import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserType } from '@/lib/types'
import { achievements } from '@/lib/config/achievements'
import clientPromise from '@/lib/db/mongodb'

// Lista de usuarios predefinidos para simplificar
const predefinedUsers = {
  cosh: { id: 'Cosh' as UserType, name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch' as UserType, name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin' as UserType, name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh' as UserType, name: 'flosh', logs: [], achievements, oshfitScore: 0 }
} as const;

// Lista de nombres de usuario válidos para verificación de tipado
const validUsernames = ['cosh', 'rosch', 'maquin', 'flosh'] as const;
type ValidUsername = typeof validUsernames[number];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null
        
        // Simplificamos drásticamente: solo verificar si es un usuario predefinido
        const username = credentials.username.toLowerCase() as ValidUsername;
        
        // Si no es un usuario predefinido, rechazar
        if (!validUsernames.includes(username as any)) {
          console.log(`Usuario no predefinido rechazado: ${username}`)
          return null
        }
        
        try {
          // Conectar a MongoDB
          const client = await clientPromise
          const collection = client.db('oshfit').collection('users')
          
          // Buscar usuario en la BD
          let user = await collection.findOne({ name: username })
          
          // Si no existe en la BD pero es predefinido, crearlo
          if (!user) {
            console.log(`Creando usuario predefinido en MongoDB: ${username}`)
            const userData = predefinedUsers[username]
            await collection.insertOne(userData)
            user = userData
          }
          
          console.log(`Login exitoso para: ${username}`)
          return {
            id: predefinedUsers[username].id,
            name: username,
            email: `${username}@example.com`
          }
        } catch (error) {
          console.error(`Error en BD durante login para ${username}:`, error)
          
          // Si hay error de BD, permitir login de todos modos para usuarios predefinidos
          console.log(`Continuando con login sin BD para usuario predefinido: ${username}`)
          return {
            id: predefinedUsers[username].id,
            name: username,
            email: `${username}@example.com`
          }
        }
      }
    })
  ],
  pages: {
    signIn: '/',
    error: '/',
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