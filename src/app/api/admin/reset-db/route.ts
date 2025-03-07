import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { achievements } from '@/lib/config/achievements';
import { UserType } from '@/lib/types';

// Lista de usuarios predefinidos
const predefinedUsers = {
  cosh: { 
    id: 'Cosh' as UserType, 
    name: 'cosh', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0,
    createdAt: new Date()
  },
  rosch: { 
    id: 'Rosch' as UserType, 
    name: 'rosch', 
    password: 'trucha',
    logs: [], 
    achievements, 
    oshfitScore: 0,
    createdAt: new Date()
  },
  maquin: { 
    id: 'Maquin' as UserType, 
    name: 'maquin', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0,
    createdAt: new Date()
  },
  flosh: { 
    id: 'Flosh' as UserType, 
    name: 'flosh', 
    password: 'celular10',
    logs: [], 
    achievements, 
    oshfitScore: 0,
    createdAt: new Date()
  },
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('oshfit');
    
    // Eliminar colecciones existentes
    await db.collection('users').drop().catch(() => console.log('No users collection to drop'));
    await db.collection('workouts').drop().catch(() => console.log('No workouts collection to drop'));
    
    // Recrear colecciones
    await db.createCollection('users');
    await db.createCollection('workouts');
    
    // Insertar usuarios predefinidos
    await db.collection('users').insertMany(Object.values(predefinedUsers));
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos reiniciada correctamente con usuarios predefinidos'
    });
  } catch (error) {
    console.error('Error reiniciando la base de datos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error reiniciando la base de datos',
      details: String(error)
    }, { status: 500 });
  }
} 