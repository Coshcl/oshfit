import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { UserType } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('workouts')
    
    const workouts = await collection.find({ userId }).sort({ date: -1 }).toArray()
    
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error obteniendo entrenamientos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, workout } = await request.json()

    if (!userId || !workout) {
      return NextResponse.json({ error: 'userId y workout son requeridos' }, { status: 400 })
    }

    const client = await clientPromise
    
    // Primero guardar el entrenamiento
    const workoutCollection = client.db('oshfit').collection('workouts')
    const workoutResult = await workoutCollection.insertOne({
      ...workout,
      userId,
      createdAt: new Date()
    })
    
    // Luego actualizar el usuario para incluir el entrenamiento en sus logs
    const userCollection = client.db('oshfit').collection('users')
    await userCollection.updateOne(
      { id: userId },
      { 
        $push: { logs: workout },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({ 
      success: true,
      workoutId: workoutResult.insertedId
    })
  } catch (error) {
    console.error('Error añadiendo entrenamiento:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: String(error)
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { workoutId, workout } = await request.json()

    if (!workoutId || !workout) {
      return NextResponse.json({ error: 'workoutId y workout son requeridos' }, { status: 400 })
    }

    const client = await clientPromise
    const collection = client.db('oshfit').collection('workouts')
    
    const result = await collection.updateOne(
      { id: workoutId },
      { 
        $set: {
          ...workout,
          updatedAt: new Date()
        }
      }
    )
    
    // También actualizar el entrenamiento en el array de logs del usuario
    if (workout.userId) {
      const userCollection = client.db('oshfit').collection('users')
      await userCollection.updateOne(
        { id: workout.userId },
        { 
          $set: { 
            "logs.$[elem]": workout,
            updatedAt: new Date()
          }
        },
        { 
          arrayFilters: [{ "elem.id": workoutId }] 
        }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      updated: result.modifiedCount > 0
    })
  } catch (error) {
    console.error('Error actualizando entrenamiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const workoutId = searchParams.get('workoutId')
  const userId = searchParams.get('userId')

  if (!workoutId) {
    return NextResponse.json({ error: 'workoutId es requerido' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    
    // Eliminar el entrenamiento
    const workoutCollection = client.db('oshfit').collection('workouts')
    const result = await workoutCollection.deleteOne({ id: workoutId })
    
    // Si se proporciona el userId, también eliminar el entrenamiento de los logs del usuario
    if (userId) {
      const userCollection = client.db('oshfit').collection('users')
      await userCollection.updateOne(
        { id: userId },
        { 
          $pull: { logs: { id: workoutId } },
          $set: { updatedAt: new Date() }
        }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      deleted: result.deletedCount > 0
    })
  } catch (error) {
    console.error('Error eliminando entrenamiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 