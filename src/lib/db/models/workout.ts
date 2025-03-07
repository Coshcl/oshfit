import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { WorkoutLog } from '@/lib/types'

export async function getWorkoutsByUserId(userId: string): Promise<WorkoutLog[]> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('workouts')
  return collection.find({ userId }).sort({ date: -1 }).toArray() as Promise<WorkoutLog[]>
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