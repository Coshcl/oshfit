import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db('oshfit')
    
    // Eliminar todas las colecciones
    await db.collection('users').deleteMany({})
    await db.collection('workouts').deleteMany({})
    
    return NextResponse.json({ 
      success: true,
      message: 'Base de datos limpiada correctamente. Todos los datos han sido eliminados.'
    })
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error)
    return NextResponse.json({ 
      error: 'Error al limpiar la base de datos',
      details: String(error)
    }, { status: 500 })
  }
} 