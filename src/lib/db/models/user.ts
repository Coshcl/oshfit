import { ObjectId } from 'mongodb'
import clientPromise from '../mongodb'
import { UserProfile } from '@/lib/types'

export async function getUserById(userId: string): Promise<(UserProfile & { password?: string }) | null> {
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
      oshfitScore: user.oshfitScore || 0,
      password: user.password
    }
  } catch (error) {
    console.error("Error en getUserById:", error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<(UserProfile & { password?: string }) | null> {
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
      oshfitScore: user.oshfitScore || 0,
      password: user.password
    }
  } catch (error) {
    console.error("Error en getUserByUsername:", error);
    return null;
  }
}

export async function updateUser(userId: string, data: Partial<UserProfile & { password?: string }>): Promise<void> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    await collection.updateOne(
      { id: userId },
      { $set: data },
      { upsert: true }
    )
  } catch (error) {
    console.error("Error en updateUser:", error);
  }
}

export async function createUser(userData: UserProfile & { password?: string }): Promise<void> {
  try {
    const client = await clientPromise
    const collection = client.db('oshfit').collection('users')
    await collection.insertOne(userData)
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
}

export async function validateUserCredentials(username: string, password: string): Promise<boolean> {
  try {
    console.log(`Validando credenciales para: ${username}`);
    
    // Para usuarios predefinidos, aceptar cualquier contraseña
    const predefinedUsers = ['cosh', 'rosch', 'maquin', 'flosh'];
    if (predefinedUsers.includes(username.toLowerCase())) {
      console.log(`Usuario predefinido encontrado: ${username}`);
      return true;
    }
    
    // Para usuarios personalizados, verificar contraseña
    const user = await getUserByUsername(username);
    if (!user) {
      console.log(`Usuario no encontrado: ${username}`);
      return false;
    }
    
    console.log(`Usuario encontrado: ${user.name}, verificando contraseña`);
    return user.password === password;
  } catch (error) {
    console.error("Error en validateUserCredentials:", error);
    return false;
  }
} 