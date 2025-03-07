import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserType } from '@/lib/types'
import { achievements } from '@/lib/config/achievements'
import clientPromise from '@/lib/db/mongodb'
import { WithId, Document } from 'mongodb'

// Asegurar que haya un secreto siempre
const secret = process.env.NEXTAUTH_SECRET || 'ESTE-ES-UN-SECRETO-TEMPORAL-NO-USAR-EN-PRODUCCION'

console.log('NEXTAUTH_SECRET está configurado:', !!process.env.NEXTAUTH_SECRET)
console.log('NEXTAUTH_URL está configurado:', process.env.NEXTAUTH_URL)

// Lista de usuarios predefinidos para simplificar, ahora con contraseñas
const predefinedUsers = {
  cosh: { 
    id: 'Cosh' as UserType, 
    name: 'cosh', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0 
  },
  rosch: { 
    id: 'Rosch' as UserType, 
    name: 'rosch', 
    password: 'trucha',
    logs: [], 
    achievements, 
    oshfitScore: 0 
  },
  maquin: { 
    id: 'Maquin' as UserType, 
    name: 'maquin', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0 
  },
  flosh: { 
    id: 'Flosh' as UserType, 
    name: 'flosh', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0 
  }
} as const;

// Lista de nombres de usuario válidos para verificación de tipado
const validUsernames = ['cosh', 'rosch', 'maquin', 'flosh'] as const;
type ValidUsername = typeof validUsernames[number];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log('Faltan credenciales')
          return null
        }
        
        // Obtener username y password
        const username = credentials.username.toLowerCase() as ValidUsername;
        const password = credentials.password;
        
        // Si no es un usuario predefinido, rechazar
        if (!validUsernames.includes(username as any)) {
          console.log(`Usuario no predefinido rechazado: ${username}`)
          return null
        }
        
        // Verificar contraseña
        if (password !== predefinedUsers[username].password) {
          console.log(`Contraseña incorrecta para: ${username}`)
          return null
        }
        
        try {
          // Conectar a MongoDB
          const client = await clientPromise
          const collection = client.db('oshfit').collection('users')
          
          // Buscar usuario en la BD
          let user: WithId<Document> | null = await collection.findOne({ name: username })
          
          // Si no existe en la BD pero es predefinido, crearlo
          if (!user) {
            console.log(`Creando usuario predefinido en MongoDB: ${username}`)
            // Creamos una copia sin la contraseña para no guardarla en la BD
            const { password: _, ...userDataWithoutPassword } = predefinedUsers[username];
            
            // Insertar el documento
            const result = await collection.insertOne(userDataWithoutPassword)
            
            // Buscar el documento recién insertado
            user = await collection.findOne({ _id: result.insertedId })
            
            if (!user) {
              // Si algo salió mal con la inserción, usar datos predefinidos como fallback
              console.warn(`No se pudo recuperar el usuario insertado, usando predefinido: ${username}`)
            }
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
  secret: secret, // Usamos nuestra variable que siempre tendrá un valor
  debug: true, // Activamos modo debug para ver más detalles del error
})

export { handler as GET, handler as POST } 