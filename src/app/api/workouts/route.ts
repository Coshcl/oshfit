import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { UserType } from '@/lib/types'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveWorkoutLog } from '@/lib/db/workoutLogs'
import { checkAchievements } from '@/lib/utils/achievementUtils'

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const data = await req.json()
    
    // Validar datos mínimos
    if (!data.exercises || !Array.isArray(data.exercises) || data.exercises.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un ejercicio' },
        { status: 400 }
      )
    }
    
    // Crear objeto para guardar en la base de datos
    const workoutData = {
      userId,
      date: new Date(),
      bodyWeight: data.bodyWeight,
      bodyWeightUnit: data.bodyWeightUnit,
      exercises: data.exercises.map((ex: any) => ({
        exerciseName: ex.exerciseName,
        emoji: ex.emoji || '💪',
        weight: ex.weight || 0,
        weightUnit: ex.weightUnit || 'kg',
        sets: ex.sets || 0,
        reps: ex.reps || 0,
        perceivedEffort: ex.perceivedEffort || 0
      })),
      notes: data.notes,
      duration: data.duration,
      cardioAfter: data.cardioAfter || false,
      cardioMinutes: data.cardioMinutes,
      type: data.type || 'general'
    }
    
    // Guardar en la base de datos
    const savedWorkout = await saveWorkoutLog(workoutData)
    
    // Verificar y actualizar logros
    if (savedWorkout) {
      await checkAchievements(userId)
    }
    
    return NextResponse.json(savedWorkout)
  } catch (error) {
    console.error('Error al guardar entrenamiento:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
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
      try {
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