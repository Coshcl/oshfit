import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { WorkoutLog } from '@/lib/types'

export async function getWorkoutsByUserId(userId: string): Promise<WorkoutLog[]> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('workouts')
  
  // Obtenemos los documentos y los mapeamos al tipo WorkoutLog
  const documents = await collection.find({ userId }).sort({ date: -1 }).toArray()
  
  return documents.map(doc => ({
    id: doc.id || doc._id.toString(),
    date: doc.date,
    type: doc.type,
    bodyWeight: doc.bodyWeight,
    exercises: doc.exercises,
    userId: doc.userId
  })) as WorkoutLog[]
}

export async function addWorkout(userId: string, workout: WorkoutLog): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('workouts')
  await collection.insertOne({
    ...workout,
    userId,
    createdAt: new Date()
  })
}

export async function updateWorkout(workoutId: string, workout: Partial<WorkoutLog>): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('workouts')
  await collection.updateOne(
    { id: workoutId },
    { $set: workout }
  )
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('workouts')
  await collection.deleteOne({ id: workoutId })
} 