import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { UserProfile } from '@/lib/types'

export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    const user = await collection.findOne({ id: userId })
    
    if (!user) return null
    
    return {
      id: user.id,
      name: user.name,
      logs: user.logs || [],
      achievements: user.achievements || [],
      oshfitScore: user.oshfitScore || 0
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    
    const user = await collection.findOne({ name: username.toLowerCase() })
    
    if (!user) return null
    
    return {
      id: user.id,
      name: user.name,
      logs: user.logs || [],
      achievements: user.achievements || [],
      oshfitScore: user.oshfitScore || 0
    }
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function updateUser(userId: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    await collection.updateOne(
      { id: userId },
      { $set: data }
    )
  } catch (error) {
    console.error("Error updating user:", error)
  }
}

export async function createUser(userData: UserProfile): Promise<void> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    await collection.insertOne(userData)
  } catch (error) {
    console.error("Error creating user:", error)
  }
} 