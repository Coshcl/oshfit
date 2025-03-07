import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    // Solo verificamos si existen, no mostramos los valores reales por seguridad
    nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
    nextauth_url_exists: !!process.env.NEXTAUTH_URL,
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    env: process.env.NODE_ENV
  })
} 