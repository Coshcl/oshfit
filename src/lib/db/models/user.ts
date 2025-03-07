import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { UserProfile } from '@/lib/types'

export async function getUserById(userId: string): Promise<(UserProfile & { password?: string }) | null> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  
  const user = await collection.findOne({ id: userId })
  
  if (!user) return null
  
  return {
    id: user.id,
    name: user.name,
    logs: user.logs || [],
    achievements: user.achievements || [],
    oshfitScore: user.oshfitScore || 0,
    password: user.password
  }
}

export async function getUserByUsername(username: string): Promise<(UserProfile & { password?: string }) | null> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  
  const user = await collection.findOne({ name: username.toLowerCase() })
  
  if (!user) return null
  
  return {
    id: user.id,
    name: user.name,
    logs: user.logs || [],
    achievements: user.achievements || [],
    oshfitScore: user.oshfitScore || 0,
    password: user.password
  }
}

export async function updateUser(userId: string, data: Partial<UserProfile & { password?: string }>): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  await collection.updateOne(
    { id: userId },
    { $set: data },
    { upsert: true }
  )
}

export async function createUser(userData: UserProfile & { password?: string }): Promise<void> {
  const client = await clientPromise
  const collection = client.db('oshfit').collection('users')
  await collection.insertOne(userData)
}

export async function validateUserCredentials(username: string, password: string): Promise<boolean> {
  // Para usuarios predefinidos, permitir acceso con cualquier contraseña (temporal)
  const predefinedUsers = ['cosh', 'rosch', 'maquin', 'flosh']
  if (predefinedUsers.includes(username.toLowerCase())) {
    return true
  }
  
  // Para usuarios regulares, verificar contraseña
  const user = await getUserByUsername(username)
  if (!user || !user.password) return false
  
  // En producción, aquí se debería comparar la contraseña hasheada
  return user.password === password
} 