import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usamos una variable global para preservar la conexión
  // entre recargas de HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En producción, es mejor no usar variables globales
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Función para obtener la conexión a la base de datos
export default async function mongodb() {
  const client = await clientPromise
  const db = client.db('oshfit')
  return { client, db }
}

// Función auxiliar para limpiar la base de datos (solo en desarrollo)
export async function clearDatabase() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Esta función solo debe usarse en entorno de desarrollo')
  }

  const { db } = await mongodb()
  
  // Obtener todas las colecciones
  const collections = await db.listCollections().toArray()
  
  // Eliminar todos los documentos de cada colección
  for (const collection of collections) {
    await db.collection(collection.name).deleteMany({})
    console.log(`Colección ${collection.name} limpiada`)
  }
  
  console.log('Base de datos limpiada completamente')
  return true
} 