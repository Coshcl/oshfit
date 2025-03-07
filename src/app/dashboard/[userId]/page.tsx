'use client'

import { useEffect } from 'react'
import { useUser } from '@/lib/contexts/UserContext'
import { achievements } from '@/lib/config/achievements'
import { OshfitScore } from '@/components/OshfitScore'
import { AchievementsList } from '@/components/AchievementsList'
import { UserStats } from '@/components/UserStats'
import { coshTestData } from '@/lib/config/testData'

export default function DashboardPage({
  params
}: {
  params: { userId: string }
}) {
  const { user, setUser } = useUser()

  useEffect(() => {
    if (!user) {
      // Si es Cosh, usar datos de prueba
      if (params.userId.toLowerCase() === 'cosh') {
        setUser(coshTestData)
      } else {
        setUser({
          id: params.userId as any,
          name: params.userId,
          logs: [],
          achievements: achievements,
          oshfitScore: 0
        })
      }
    }
  }, [params.userId, user, setUser])

  if (!user) return null

  // Encontrar la fecha del primer log
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
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
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