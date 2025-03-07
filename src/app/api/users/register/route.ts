import { NextResponse } from 'next/server'
import { getUserById, getUserByUsername, createUser } from '@/lib/db/models/user'
import { UserProfile, UserType } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    // Validaciones básicas
    if (!userData.name || !userData.password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }
    
    // Confirmar que el nombre de usuario no existe ya
    const existingUser = await getUserByUsername(userData.name.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 })
    }

    // Crear un ID compatible con UserType
    const username = userData.name.toLowerCase()
    
    // Si es un nombre predefinido, usar el formato exacto
    let userId: UserType
    const predefinedUsers = ['cosh', 'rosch', 'maquin', 'flosh']
    
    if (predefinedUsers.includes(username)) {
      // Usar el formato exacto para usuarios predefinidos (Cosh, Rosch, etc.)
      userId = username.charAt(0).toUpperCase() + username.slice(1) as UserType
    } else {
      // Para usuarios personalizados, asignar uno de los tipos permitidos
      // con un identificador personalizado, por ejemplo, agregando un prefijo
      userId = 'Custom' as UserType
    }
    
    // Preparar el usuario para almacenar
    const newUser: UserProfile & { password: string } = {
      id: userId,
      name: username,
      logs: [],
      achievements: userData.achievements || [],
      oshfitScore: 0,
      password: userData.password
    }
    
    // Guardar en la base de datos
    await createUser(newUser)
    
    // Devolver respuesta sin incluir la contraseña
    const { password, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
    
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 