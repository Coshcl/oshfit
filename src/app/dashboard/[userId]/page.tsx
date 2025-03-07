'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/lib/contexts/UserContext'
import { achievements } from '@/lib/config/achievements'
import { OshfitScore } from '@/components/OshfitScore'
import { AchievementsList } from '@/components/AchievementsList'
import { UserStats } from '@/components/UserStats'
import { UserType } from '@/lib/types'

export default function DashboardPage({
  params
}: {
  params: { userId: string }
}) {
  const router = useRouter()
  const { user, setUser, isLoading } = useUser()
  
  // Validar que el usuario sea válido
  useEffect(() => {
    const validUsers = ['cosh', 'rosch', 'maquin', 'flosh']
    if (!validUsers.includes(params.userId.toLowerCase())) {
      console.error(`Usuario no válido: ${params.userId}`)
      router.push('/') // Redirigir a la página principal
    }
  }, [params.userId, router])

  // Inicializar usuario si es necesario
  useEffect(() => {
    if (!user && !isLoading) {
      const username = params.userId.toLowerCase()
      // Solo inicializar para usuarios válidos
      if (['cosh', 'rosch', 'maquin', 'flosh'].includes(username)) {
        const userId = username.charAt(0).toUpperCase() + username.slice(1) as UserType
        setUser({
          id: userId,
          name: username,
          logs: [],
          achievements: achievements,
          oshfitScore: 0
        })
      }
    }
  }, [params.userId, user, setUser, isLoading])

  // Mostrar carga
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // Verificar que es el usuario correcto
  if (user.name.toLowerCase() !== params.userId.toLowerCase()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            Error: Usuario incorrecto
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // Encontrar la fecha del primer log o usar hoy
  const startDate = user.logs.length > 0 
    ? new Date(Math.min(...user.logs.map(log => new Date(log.date).getTime())))
    : new Date()

  const formattedStartDate = startDate.toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="p-4 space-y-6">
      {/* Cabecera del perfil */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold capitalize">{user.name}</h1>
          <p className="text-sm text-gray-500">Mejorando desde {formattedStartDate}</p>
        </div>
      </div>

      {/* Puntuación Oshfit */}
      <OshfitScore score={user.oshfitScore} logs={user.logs} />

      {/* Estadísticas del usuario */}
      <UserStats logs={user.logs} />

      {/* Lista de logros */}
      <AchievementsList achievements={user.achievements} />
    </div>
  )
} 