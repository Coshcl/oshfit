import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { Achievement } from '@/lib/types'

export async function PUT(request: Request) {
  try {
    const { userId, achievements } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    }
    
    // Si se proporcionan logros, actualizarlos
    if (achievements) {
      updateData.achievements = achievements
    }
    
    const result = await collection.updateOne(
      { id: userId },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true,
      updated: result.modifiedCount > 0
    })
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 