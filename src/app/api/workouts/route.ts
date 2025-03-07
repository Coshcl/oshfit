import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { UserType, ExerciseData, WorkoutLog } from '@/lib/types'
import { ObjectId } from 'mongodb'
import { normalizeExerciseData, normalizeWorkoutLog } from '@/lib/utils/dataUtils'

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
    
    // Normalizar el workout completo
    const normalizedWorkout = {
      ...workout,
      exercises: (workout.exercises || []).map((ex: ExerciseData) => normalizeExerciseData(ex))
    }
    
    // Guardar entrenamiento normalizado
    const workoutCollection = client.db('oshfit').collection('workouts')
    const workoutToSave = {
      ...normalizedWorkout,
      userId,
      createdAt: new Date()
    }
    
    const workoutResult = await workoutCollection.insertOne(workoutToSave)
    
    // Actualizar usuario
    try {
      const userCollection = client.db('oshfit').collection('users')
      await userCollection.updateOne(
        { id: userId },
        { 
          $push: { logs: workoutToSave },
          $set: { updatedAt: new Date() }
        }
      )
    } catch (error) {
      console.error('Error actualizando usuario:', error)
    }
    
    return NextResponse.json({ 
      success: true,
      workoutId: workoutResult.insertedId
    })
  } catch (error) {
    console.error('Error añadiendo entrenamiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
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
    
    // Normalizar los datos de ejercicios
    const normalizedExercises = workout.exercises.map((exercise: ExerciseData) => ({
      ...exercise,
      weightUnit: exercise.weightUnit || 'kg',
      sets: exercise.sets || 1,
      repsPerSet: exercise.repsPerSet || 0,
      reps: exercise.reps || (exercise.sets && exercise.repsPerSet ? exercise.sets * exercise.repsPerSet : 0)
    }))
    
    const workoutToUpdate = {
      ...workout,
      exercises: normalizedExercises,
      updatedAt: new Date()
    }
    
    const result = await collection.updateOne(
      { id: workoutId },
      { $set: workoutToUpdate }
    )
    
    // También actualizar el entrenamiento en el array de logs del usuario
    if (workout.userId) {
      try {
        const userCollection = client.db('oshfit').collection('users')
        await userCollection.updateOne(
          { id: workout.userId },
          { 
            $set: { 
              "logs.$[elem]": workoutToUpdate,
              updatedAt: new Date()
            }
          },
          { 
            arrayFilters: [{ "elem.id": workoutId }] 
          }
        )
      } catch (userUpdateError) {
        console.error('Error actualizando logs de usuario:', userUpdateError)
        // Continuar aunque falle la actualización
      }
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
      try {
        const userCollection = client.db('oshfit').collection('users')
        
        // Usar un operador de filtrado adecuado para eliminar el entrenamiento del array logs
        await userCollection.updateOne(
          { id: userId },
          { 
            // Corregido: Especificar que queremos eliminar elementos donde id=workoutId
            $pull: { 
              logs: { id: workoutId } as any // Usamos 'as any' para evitar errores de tipo
            },
            $set: { 
              updatedAt: new Date() 
            }
          }
        )
      } catch (userUpdateError) {
        console.error('Error eliminando log de usuario:', userUpdateError)
        // Continuar aunque falle la actualización
      }
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