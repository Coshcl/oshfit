import { WorkoutLog, Achievement, UserProfile } from '@/lib/types'

// Función principal para verificar logros desbloqueados
export function checkAchievements(user: UserProfile, newLog?: WorkoutLog): { 
  updatedUser: UserProfile; 
  newlyUnlocked: Achievement[] 
} {
  const { achievements, logs } = user
  const allLogs = newLog ? [...logs, newLog] : logs
  const unlocked: Achievement[] = []
  
  // Actualizar estado de cada logro
  const updatedAchievements = achievements.map(achievement => {
    // Si ya está desbloqueado, no hacer nada
    if (achievement.isUnlocked) {
      return achievement
    }
    
    // Verificar si el logro debe desbloquearse
    const shouldUnlock = checkAchievementCondition(achievement.id, allLogs, user)
    
    if (shouldUnlock) {
      const unlockedAchievement = {
        ...achievement,
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      }
      unlocked.push(unlockedAchievement)
      return unlockedAchievement
    }
    
    return achievement
  })
  
  // Actualizar usuario con los logros actualizados
  const updatedUser = {
    ...user,
    achievements: updatedAchievements
  }
  
  return { updatedUser, newlyUnlocked: unlocked }
}

// Función para verificar condiciones específicas de cada logro
function checkAchievementCondition(achievementId: string, logs: WorkoutLog[], user: UserProfile): boolean {
  switch (achievementId) {
    case 'first_log':
      return logs.length > 0
      
    case 'first_push':
      return logs.some(log => log.type === 'Push')
      
    case 'first_pull':
      return logs.some(log => log.type === 'Pull')
      
    case 'first_legs':
      return logs.some(log => log.type === 'Legs')
      
    case 'perfect_log':
      return logs.some(log => log.exercises.every(ex => ex.perceivedEffort > 0 && ex.weight > 0 && ex.reps > 0))
      
    case 'seven_days':
      return hasConsecutiveDays(logs, 7)
      
    case 'weight_increase':
      return hasWeightIncrease(logs, 5) // 5% de incremento
      
    case 'max_effort':
      return logs.some(log => log.exercises.some(ex => ex.perceivedEffort === 10))
      
    case 'score_improvement':
      return hasScoreImprovement(logs)
      
    case 'consistency':
      return hasConsecutiveDays(logs, 30)
      
    default:
      return false
  }
}

// Función para verificar días consecutivos
function hasConsecutiveDays(logs: WorkoutLog[], days: number): boolean {
  if (logs.length < days) return false
  
  // Ordenar logs por fecha
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  // Verificar secuencia de días
  let consecutiveDays = 1
  for (let i = 1; i < sortedLogs.length; i++) {
    const prevDate = new Date(sortedLogs[i-1].date)
    const currDate = new Date(sortedLogs[i].date)
    
    // Si es el día siguiente, incrementar contador
    if (
      currDate.getDate() - prevDate.getDate() === 1 &&
      currDate.getMonth() === prevDate.getMonth() &&
      currDate.getFullYear() === prevDate.getFullYear()
    ) {
      consecutiveDays++
      if (consecutiveDays >= days) return true
    } 
    // Si es el mismo día, continuar
    else if (
      currDate.getDate() === prevDate.getDate() &&
      currDate.getMonth() === prevDate.getMonth() &&
      currDate.getFullYear() === prevDate.getFullYear()
    ) {
      continue
    } 
    // Si no es día consecutivo, reiniciar contador
    else {
      consecutiveDays = 1
    }
  }
  
  return false
}

// Función para verificar incremento de peso
function hasWeightIncrease(logs: WorkoutLog[], percentageThreshold: number): boolean {
  // Necesitamos al menos 2 logs para comparar
  if (logs.length < 2) return false
  
  // Organizar logs por tipo de ejercicio
  const exerciseLogs: Record<string, { weight: number, date: string }[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      if (!exerciseLogs[exercise.exerciseName]) {
        exerciseLogs[exercise.exerciseName] = []
      }
      
      exerciseLogs[exercise.exerciseName].push({
        weight: exercise.weight,
        date: log.date
      })
    })
  })
  
  // Verificar incremento para cada ejercicio
  for (const exerciseName in exerciseLogs) {
    const exerciseData = exerciseLogs[exerciseName]
    
    // Ordenar por fecha
    exerciseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Verificar incremento entre primer y último registro
    if (exerciseData.length >= 2) {
      const firstWeight = exerciseData[0].weight
      const lastWeight = exerciseData[exerciseData.length - 1].weight
      
      const percentageIncrease = ((lastWeight - firstWeight) / firstWeight) * 100
      
      if (percentageIncrease >= percentageThreshold) {
        return true
      }
    }
  }
  
  return false
}

// Función para verificar mejora en el Oshfit Score
function hasScoreImprovement(logs: WorkoutLog[]): boolean {
  if (logs.length < 2) return false
  
  // Calcular score para cada log
  const scores = logs.map(log => {
    // Cálculo simplificado del score
    return log.exercises.reduce((acc, ex) => {
      return acc + (ex.weight * 0.6) + (ex.perceivedEffort * 0.25) + ((ex.weight * ex.reps) * 0.0015)
    }, 0) / log.exercises.length
  })
  
  // Verificar si el último score es mayor que el anterior
  return scores[scores.length - 1] > scores[scores.length - 2]
} 