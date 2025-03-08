import { NextResponse } from 'next/server'
import { clearDatabase } from '@/lib/db/mongodb'

export async function POST(request: Request) {
  try {
    // Verificar si estamos en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: 'Esta operación solo está permitida en entorno de desarrollo' },
        { status: 403 }
      )
    }

    // Verificar clave de seguridad en cabecera
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    await clearDatabase()
    
    return NextResponse.json(
      { success: true, message: 'Base de datos limpiada con éxito' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error clearing database:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: String(error) },
      { status: 500 }
    )
  }
} 