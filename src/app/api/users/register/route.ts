import { NextResponse } from 'next/server'
import { getUserById, createUser } from '@/lib/db/models/user'
import { UserProfile } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    // Validaciones básicas
    if (!userData.id || !userData.name || !userData.password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }
    
    // Comprobar si el usuario ya existe
    const existingUser = await getUserById(userData.id)
    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 })
    }
    
    // Preparar el usuario para almacenar
    // NOTA: En producción, se debería hashear la contraseña
    const newUser: UserProfile & { password: string } = {
      id: userData.id,
      name: userData.name,
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