import { NextResponse } from 'next/server'
import { achievements } from '@/lib/config/achievements'
import { UserType } from '@/lib/types'
import mongodb from '@/lib/db/mongodb'

// Usuarios predefinidos para inicializar la base de datos
const predefinedUsers = {
  cosh: { id: 'Cosh' as UserType, name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch' as UserType, name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin' as UserType, name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh' as UserType, name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

export async function GET() {
  try {
    const { client, db } = await mongodb()
    const collection = db.collection('users')
    
    // Verificar que la conexión a MongoDB está funcionando
    const pingResult = await client.db("admin").command({ ping: 1 })
    console.log("MongoDB conexión exitosa:", pingResult)
    
    // Inicializar cada usuario predefinido si no existe
    const results = await Promise.allSettled(
      Object.entries(predefinedUsers).map(async ([username, userData]) => {
        try {
          // Verificar si ya existe
          const existingUser = await collection.findOne({ name: username })
          
          if (!existingUser) {
            // Crear usuario si no existe
            const result = await collection.insertOne({
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            return { username, created: true, id: result.insertedId.toString() }
          }
          
          return { username, created: false, exists: true }
        } catch (error) {
          console.error(`Error inicializando usuario ${username}:`, error)
          return { username, error: String(error) }
        }
      })
    )
    
    // Contar resultados
    const succeeded = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    return NextResponse.json({ 
      success: succeeded > 0,
      message: `Inicialización completada. ${succeeded} exitosos, ${failed} fallidos.`,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason })
    })
  } catch (error) {
    console.error('Error inicializando usuarios:', error)
    return NextResponse.json({ 
      error: 'Error inicializando usuarios predefinidos',
      details: String(error),
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 })
  }
} 