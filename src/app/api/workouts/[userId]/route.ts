import { NextResponse } from 'next/server'
import mongodb from '@/lib/db/mongodb'
import { WorkoutLog } from '@/lib/types'
import { ObjectId } from 'mongodb'

// GET - Obtener logs de entrenamiento del usuario
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    
    // Obtener parámetros de consulta para filtrado por fechas
    const url = new URL(request.url)
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')
    
    // Preparar filtro
    const filter: any = { userId }
    
    if (startDateParam || endDateParam) {
      filter.date = {}
      
      if (startDateParam) {
        filter.date.$gte = new Date(startDateParam)
      }
      
      if (endDateParam) {
        filter.date.$lte = new Date(endDateParam)
      }
    }
    
    const { db } = await mongodb()
    const logs = await db.collection('workoutLogs')
      .find(filter)
      .sort({ date: -1 })
      .toArray()
    
    // Transformar _id a id para consistencia en el cliente
    const formattedLogs = logs.map(log => ({
      ...log,
      id: log._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json({ logs: formattedLogs })
  } catch (error) {
    console.error('Error fetching workout logs:', error)
    return NextResponse.json(
      { error: 'Error al obtener los entrenamientos' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo log de entrenamiento
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    const data = await request.json()
    
    const newLog: Omit<WorkoutLog, 'id'> = {
      userId,
      date: new Date(data.date || new Date()),
      duration: data.duration || 0,
      exercises: data.exercises || {},
      notes: data.notes,
      cardioMinutes: data.cardioMinutes,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const { db } = await mongodb()
    const result = await db.collection('workoutLogs').insertOne(newLog)
    
    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      log: { ...newLog, id: result.insertedId.toString() }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating workout log:', error)
    return NextResponse.json(
      { error: 'Error al crear el entrenamiento' },
      { status: 500 }
    )
  }
} 