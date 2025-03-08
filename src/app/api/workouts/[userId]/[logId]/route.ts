import { NextResponse } from 'next/server'
import mongodb from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

// GET - Obtener un log específico
export async function GET(
  request: Request,
  { params }: { params: { userId: string, logId: string } }
) {
  try {
    const { userId, logId } = params
    
    // Validar que el ID de log sea un ObjectId válido
    let objectId: ObjectId
    try {
      objectId = new ObjectId(logId)
    } catch (error) {
      return NextResponse.json(
        { error: 'ID de log inválido' },
        { status: 400 }
      )
    }
    
    const { db } = await mongodb()
    const log = await db.collection('workoutLogs').findOne({
      _id: objectId,
      userId
    })
    
    if (!log) {
      return NextResponse.json(
        { error: 'Log no encontrado' },
        { status: 404 }
      )
    }
    
    // Convertir _id a id para consistencia
    const formattedLog = {
      ...log,
      id: log._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json({ log: formattedLog })
  } catch (error) {
    console.error('Error fetching workout log:', error)
    return NextResponse.json(
      { error: 'Error al obtener el entrenamiento' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un log
export async function PUT(
  request: Request,
  { params }: { params: { userId: string, logId: string } }
) {
  try {
    const { userId, logId } = params
    const data = await request.json()
    
    // Validar que el ID de log sea un ObjectId válido
    let objectId: ObjectId
    try {
      objectId = new ObjectId(logId)
    } catch (error) {
      return NextResponse.json(
        { error: 'ID de log inválido' },
        { status: 400 }
      )
    }
    
    // Preparar datos a actualizar
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    
    // Eliminar campos que no deberían actualizarse
    delete updateData.id
    delete updateData._id
    delete updateData.userId
    delete updateData.createdAt
    
    // Asegurarse de que las fechas sean objetos Date
    if (updateData.date && typeof updateData.date === 'string') {
      updateData.date = new Date(updateData.date)
    }
    
    const { db } = await mongodb()
    const result = await db.collection('workoutLogs').updateOne(
      { _id: objectId, userId },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Log no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Entrenamiento actualizado con éxito'
    })
  } catch (error) {
    console.error('Error updating workout log:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el entrenamiento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un log
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, logId: string } }
) {
  try {
    const { userId, logId } = params
    
    // Validar que el ID de log sea un ObjectId válido
    let objectId: ObjectId
    try {
      objectId = new ObjectId(logId)
    } catch (error) {
      return NextResponse.json(
        { error: 'ID de log inválido' },
        { status: 400 }
      )
    }
    
    const { db } = await mongodb()
    const result = await db.collection('workoutLogs').deleteOne({
      _id: objectId,
      userId
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Log no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Entrenamiento eliminado con éxito'
    })
  } catch (error) {
    console.error('Error deleting workout log:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el entrenamiento' },
      { status: 500 }
    )
  }
} 