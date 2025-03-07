import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { UserProfile } from '@/lib/types'

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  return collection.findOne({ id: userId }) as Promise<UserProfile | null>
}

export async function updateUser(userId: string, data: Partial<UserProfile>): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  await collection.updateOne(
    { id: userId },
    { $set: data },
    { upsert: true }
  )
}

export async function createUser(userData: UserProfile): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  await collection.insertOne(userData)
} 