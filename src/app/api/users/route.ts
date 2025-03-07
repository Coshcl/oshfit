import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { achievements } from '@/lib/config/achievements'
import { UserType } from '@/lib/types'

// Usuarios predefinidos para fallback
const predefinedUsers = {
  cosh: { id: 'Cosh' as UserType, name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch' as UserType, name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin' as UserType, name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh' as UserType, name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')?.toLowerCase()

  if (!username) {
    return NextResponse.json({ error: 'Se requiere un nombre de usuario' }, { status: 400 })
  }

  // Verificar si es un usuario válido
  if (!['cosh', 'rosch', 'maquin', 'flosh'].includes(username)) {
    return NextResponse.json({ error: 'Usuario no válido' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    // Buscar usuario en la BD
    const user = await collection.findOne({ name: username })
    
    if (!user) {
      // Si no existe en la BD, intentar crearlo
      console.log(`Usuario ${username} no encontrado en BD, intentando crearlo...`)
      
      try {
        const userData = predefinedUsers[username as keyof typeof predefinedUsers]
        const result = await collection.insertOne({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        
        // Buscar el documento recién insertado
        const newUser = await collection.findOne({ _id: result.insertedId })
        
        if (newUser) {
          return NextResponse.json(newUser)
        } else {
          // Si falla la creación, devolver los datos predefinidos
          return NextResponse.json(predefinedUsers[username as keyof typeof predefinedUsers])
        }
      } catch (createError) {
        console.error(`Error creando usuario ${username}:`, createError)
        // Si falla la creación, devolver los datos predefinidos
        return NextResponse.json(predefinedUsers[username as keyof typeof predefinedUsers])
      }
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    
    // Si hay error de conexión, devolver los datos predefinidos como fallback
    if (username in predefinedUsers) {
      return NextResponse.json(
        predefinedUsers[username as keyof typeof predefinedUsers],
        { status: 200 } // Devolver 200 aunque sea fallback
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
} 