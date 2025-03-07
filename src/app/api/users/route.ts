import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Se requiere un nombre de usuario' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    const user = await collection.findOne({ name: username.toLowerCase() })
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
} 