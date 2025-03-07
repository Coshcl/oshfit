import { NextResponse } from 'next/server'
import { achievements } from '@/lib/config/achievements'
import { UserType } from '@/lib/types'
import clientPromise from '@/lib/db/mongodb'

// Usuarios predefinidos para inicializar la base de datos
const predefinedUsers = {
  cosh: { id: 'Cosh', name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch', name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin', name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh', name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

export async function GET() {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    // Inicializar cada usuario predefinido si no existe
    const results = await Promise.all(
      Object.entries(predefinedUsers).map(async ([username, userData]) => {
        // Verificar si ya existe
        const existingUser = await collection.findOne({ name: username })
        
        if (!existingUser) {
          // Crear usuario si no existe
          await collection.insertOne(userData)
          return { username, created: true }
        }
        
        return { username, created: false, exists: true }
      })
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuarios predefinidos inicializados',
      results
    })
  } catch (error) {
    console.error('Error inicializando usuarios:', error)
    return NextResponse.json({ 
      error: 'Error inicializando usuarios predefinidos',
      details: error
    }, { status: 500 })
  }
} 