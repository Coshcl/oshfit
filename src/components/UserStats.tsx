'use client'

import { WorkoutLog, WorkoutType } from '@/lib/types'

interface UserStatsProps {
  logs: WorkoutLog[]
}

export function UserStats({ logs }: UserStatsProps) {
  const stats = calculateStats(logs)

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Entrenamientos"
          value={logs.length}
          icon="🏋️‍♂️"
        />
        <StatCard
          title="Días Consecutivos"
          value={stats.streak}
          icon="🔥"
        />
        <StatCard
          title="Push"
          value={stats.workoutTypes.Push}
          icon="💪"
        />
        <StatCard
          title="Pull"
          value={stats.workoutTypes.Pull}
          icon="🏋️"
        />
        <StatCard
          title="Legs"
          value={stats.workoutTypes.Legs}
          icon="🦵"
        />
        <StatCard
          title="Este Mes"
          value={stats.thisMonth}
          icon="📅"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function calculateStats(logs: WorkoutLog[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  // Ordenar logs por fecha, más reciente primero
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calcular racha actual
  let streak = 0
  let currentDate = today
  
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date)
    const normalizedLogDate = new Date(
      logDate.getFullYear(),
      logDate.getMonth(),
      logDate.getDate()
    )

    // Si es el primer log, verificar si es de hoy o ayer
    if (i === 0) {
      const diffTime = today.getTime() - normalizedLogDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      if (diffDays > 1) break // Si el último log es de hace más de un día, no hay racha
    }

    // Verificar si el log es del día esperado en la secuencia
    const expectedDate = new Date(currentDate)
    expectedDate.setDate(currentDate.getDate() - 1)

    if (normalizedLogDate.getTime() === expectedDate.getTime()) {
      streak++
      currentDate = expectedDate
    } else {
      break
    }
  }

  // Si hay un log de hoy, añadir un día a la racha
  const hasLogToday = sortedLogs.some(log => {
    const logDate = new Date(log.date)
    return logDate.getFullYear() === today.getFullYear() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getDate() === today.getDate()
  })
  
  if (hasLogToday) streak++

  return {
    streak,
    workoutTypes: {
      Push: logs.filter(log => log.type === 'Push').length,
      Pull: logs.filter(log => log.type === 'Pull').length,
      Legs: logs.filter(log => log.type === 'Legs').length,
    },
    thisMonth: logs.filter(log => {
      const logDate = new Date(log.date)
      return logDate.getMonth() === thisMonth && 
             logDate.getFullYear() === thisYear
    }).length,
  }
} 