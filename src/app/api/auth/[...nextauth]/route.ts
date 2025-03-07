import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserById, getUserByUsername, createUser } from '@/lib/db/models/user'
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
        if (!credentials?.username || !credentials?.password) {
          console.log("Faltan credenciales");
          return null;
        }

        try {
          const username = credentials.username.toLowerCase();
          console.log(`Intento de inicio de sesión: ${username}`);
          
          // Comprobar si es un usuario predefinido
          const predefinedUsers = ['cosh', 'rosch', 'maquin', 'flosh'];
          const isPredefined = predefinedUsers.includes(username);
          
          // Para usuarios predefinidos, cualquier contraseña es válida
          // Para usuarios personalizados, debe coincidir con la almacenada
          let user = await getUserByUsername(username);
          
          // Si es un usuario predefinido pero no existe, crearlo
          if (isPredefined && !user) {
            console.log(`Creando usuario predefinido: ${username}`);
            // ID con primera letra mayúscula para predefinidos
            const userId = username.charAt(0).toUpperCase() + username.slice(1) as UserType;
            
            const newUser = {
              id: userId,
              name: username,
              logs: [],
              achievements: achievements,
              oshfitScore: 0,
              password: 'password123'
            };
            
            try {
              await createUser(newUser);
              user = newUser;
              console.log(`Usuario predefinido creado: ${username}`);
            } catch (error) {
              console.error(`Error al crear usuario predefinido:`, error);
              return null;
            }
          }
          
          // Si no es un usuario predefinido, verificar contraseña
          if (!user) {
            console.log(`Usuario no encontrado: ${username}`);
            return null;
          }
          
          const isValidPassword = isPredefined || user.password === credentials.password;
          if (!isValidPassword) {
            console.log(`Contraseña incorrecta para: ${username}`);
            return null;
          }
          
          console.log(`Inicio de sesión exitoso: ${username}`);
          return {
            id: user.id,
            name: user.name,
            email: `${username}@example.com`
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
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
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      };
    }
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST } 