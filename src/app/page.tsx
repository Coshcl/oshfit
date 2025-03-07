'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de login
    router.push('/login')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold mb-4">Oshfit</h1>
      <p>Redirigiendo...</p>
    </div>
  )
}
