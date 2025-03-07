import { WorkoutLog, Achievement, UserProfile, WeightUnit } from '@/lib/types'

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
    
    // Verificar si el logro debe desbloquearse y actualizar progreso
    const { shouldUnlock, progress, currentCount } = checkAchievementCondition(achievement.id, allLogs, user)
    
    if (shouldUnlock) {
      const unlockedAchievement = {
        ...achievement,
        isUnlocked: true,
        progress: 1, // 100%
        currentCount: achievement.requiredCount || 0,
        unlockedAt: new Date().toISOString()
      }
      unlocked.push(unlockedAchievement)
      return unlockedAchievement
    }
    
    // Actualizar progreso aunque no se haya desbloqueado
    return {
      ...achievement,
      progress: progress !== undefined ? progress : achievement.progress,
      currentCount: currentCount !== undefined ? currentCount : achievement.currentCount
    }
  })
  
  // Actualizar usuario con los logros actualizados
  const updatedUser = {
    ...user,
    achievements: updatedAchievements
  }
  
  return { updatedUser, newlyUnlocked: unlocked }
}

// Función para verificar condiciones específicas de cada logro
function checkAchievementCondition(achievementId: string, logs: WorkoutLog[], user: UserProfile): {
  shouldUnlock: boolean;
  progress?: number;
  currentCount?: number;
} {
  switch (achievementId) {
    case 'first_log':
      return { shouldUnlock: logs.length > 0, progress: logs.length > 0 ? 1 : 0 }
      
    case 'first_push':
      return { 
        shouldUnlock: logs.some(log => log.type === 'Push'),
        progress: logs.some(log => log.type === 'Push') ? 1 : 0
      }
      
    case 'first_pull':
      return { 
        shouldUnlock: logs.some(log => log.type === 'Pull'),
        progress: logs.some(log => log.type === 'Pull') ? 1 : 0
      }
      
    case 'first_legs':
      return { 
        shouldUnlock: logs.some(log => log.type === 'Legs'),
        progress: logs.some(log => log.type === 'Legs') ? 1 : 0
      }
      
    case 'perfect_log':
      return { 
        shouldUnlock: logs.some(log => 
          log.exercises.every(ex => ex.perceivedEffort > 0 && ex.weight > 0 && ex.reps > 0 && ex.sets > 0)
        ),
        progress: logs.some(log => 
          log.exercises.every(ex => ex.perceivedEffort > 0 && ex.weight > 0 && ex.reps > 0 && ex.sets > 0)
        ) ? 1 : 0
      }
      
    case 'seven_days': {
      const { consecutiveDays, progress } = getConsecutiveDaysInfo(logs, 7)
      return { 
        shouldUnlock: consecutiveDays >= 7,
        progress,
        currentCount: consecutiveDays
      }
    }
      
    case 'weight_increase':
      return { 
        shouldUnlock: hasWeightIncrease(logs, 5),
        progress: calculateWeightIncreaseProgress(logs, 5)
      }
      
    case 'max_effort':
      return { 
        shouldUnlock: logs.some(log => log.exercises.some(ex => ex.perceivedEffort === 10)),
        progress: logs.some(log => log.exercises.some(ex => ex.perceivedEffort === 10)) ? 1 : 
                 logs.some(log => log.exercises.some(ex => ex.perceivedEffort >= 9)) ? 0.9 :
                 logs.some(log => log.exercises.some(ex => ex.perceivedEffort >= 8)) ? 0.8 : 0.5
      }
      
    case 'score_improvement':
      return { 
        shouldUnlock: hasScoreImprovement(logs),
        progress: calculateScoreImprovementProgress(logs)
      }
      
    case 'consistency': {
      const { consecutiveDays, progress } = getConsecutiveDaysInfo(logs, 30)
      return { 
        shouldUnlock: consecutiveDays >= 30,
        progress,
        currentCount: consecutiveDays
      }
    }
    
    // Nuevos logros
    case 'early_bird':
      return { 
        shouldUnlock: logs.some(log => {
          const date = new Date(log.date)
          return date.getHours() < 8
        }),
        progress: logs.some(log => {
          const date = new Date(log.date)
          return date.getHours() < 8
        }) ? 1 : 0
      }
      
    case 'night_owl':
      return { 
        shouldUnlock: logs.some(log => {
          const date = new Date(log.date)
          return date.getHours() >= 20
        }),
        progress: logs.some(log => {
          const date = new Date(log.date)
          return date.getHours() >= 20
        }) ? 1 : 0
      }
      
    case 'cardio_enthusiast': {
      const cardioCount = logs.filter(log => log.cardioAfter).length
      return { 
        shouldUnlock: cardioCount >= 5,
        progress: Math.min(cardioCount / 5, 1),
        currentCount: cardioCount
      }
    }
      
    case 'endurance_master':
      return { 
        shouldUnlock: logs.some(log => (log.duration || 0) > 90),
        progress: logs.some(log => (log.duration || 0) > 90) ? 1 :
                 logs.some(log => (log.duration || 0) > 75) ? 0.8 :
                 logs.some(log => (log.duration || 0) > 60) ? 0.6 : 0.3
      }
      
    case 'efficiency_expert': {
      const highIntensityShortWorkout = logs.some(log => {
        const isHighIntensity = log.exercises.some(ex => ex.perceivedEffort >= 8)
        const isShort = (log.duration || 0) < 45
        return isHighIntensity && isShort
      })
      
      return { 
        shouldUnlock: highIntensityShortWorkout,
        progress: highIntensityShortWorkout ? 1 : 0.5
      }
    }
      
    case 'balanced_athlete': {
      const lastWeekLogs = getLogsFromLastWeek(logs)
      const workoutTypes = new Set(lastWeekLogs.map(log => log.type))
      const typesCount = workoutTypes.size
      
      return { 
        shouldUnlock: typesCount >= 3,
        progress: typesCount / 3,
        currentCount: typesCount
      }
    }
      
    case 'heavy_lifter': {
      const hasHeavyLift = logs.some(log => 
        log.exercises.some(ex => {
          const weightInKg = ex.weightUnit === 'lb' ? ex.weight / 2.20462 : ex.weight
          return weightInKg >= 100
        })
      )
      
      // Calcular progreso basado en el peso máximo levantado
      let maxWeightInKg = 0
      logs.forEach(log => {
        log.exercises.forEach(ex => {
          const weightInKg = ex.weightUnit === 'lb' ? ex.weight / 2.20462 : ex.weight
          if (weightInKg > maxWeightInKg) {
            maxWeightInKg = weightInKg
          }
        })
      })
      
      return { 
        shouldUnlock: hasHeavyLift,
        progress: Math.min(maxWeightInKg / 100, 1)
      }
    }
      
    case 'volume_king': {
      const hasHighVolume = logs.some(log => {
        const totalReps = log.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0)
        return totalReps > 100
      })
      
      // Calcular progreso basado en el volumen máximo
      let maxVolume = 0
      logs.forEach(log => {
        const totalReps = log.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0)
        if (totalReps > maxVolume) {
          maxVolume = totalReps
        }
      })
      
      return { 
        shouldUnlock: hasHighVolume,
        progress: Math.min(maxVolume / 100, 1)
      }
    }
      
    case 'weekend_warrior': {
      const weekendCount = countConsecutiveWeekends(logs)
      return { 
        shouldUnlock: weekendCount >= 4,
        progress: Math.min(weekendCount / 4, 1),
        currentCount: weekendCount
      }
    }
      
    case 'note_taker': {
      const logsWithNotes = logs.filter(log => log.notes && log.notes.trim().length > 0)
      const uniqueDates = new Set(logsWithNotes.map(log => log.date.split('T')[0]))
      const notesCount = uniqueDates.size
      
      return { 
        shouldUnlock: notesCount >= 10,
        progress: Math.min(notesCount / 10, 1),
        currentCount: notesCount
      }
    }
      
    default:
      return { shouldUnlock: false, progress: 0 }
  }
}

// Función para verificar días consecutivos y calcular progreso
function getConsecutiveDaysInfo(logs: WorkoutLog[], requiredDays: number): {
  consecutiveDays: number;
  progress: number;
} {
  if (logs.length < 1) return { consecutiveDays: 0, progress: 0 }
  
  // Ordenar logs por fecha
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  // Verificar secuencia de días
  let consecutiveDays = 1
  let maxConsecutiveDays = 1
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const prevDate = new Date(sortedLogs[i-1].date)
    const currDate = new Date(sortedLogs[i].date)
    
    // Normalizar fechas a medianoche para comparar solo días
    const prevDay = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate())
    const currDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
    
    // Calcular diferencia en días
    const diffTime = currDay.getTime() - prevDay.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    
    // Si es el día siguiente, incrementar contador
    if (diffDays === 1) {
      consecutiveDays++
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays)
    } 
    // Si es el mismo día, continuar
    else if (diffDays === 0) {
      continue
    } 
    // Si no es día consecutivo, reiniciar contador
    else {
      consecutiveDays = 1
    }
  }
  
  return { 
    consecutiveDays: maxConsecutiveDays,
    progress: Math.min(maxConsecutiveDays / requiredDays, 1)
  }
}

// Función para verificar incremento de peso
function hasWeightIncrease(logs: WorkoutLog[], percentageThreshold: number): boolean {
  // Necesitamos al menos 2 logs para comparar
  if (logs.length < 2) return false
  
  // Organizar logs por tipo de ejercicio
  const exerciseLogs: Record<string, { weight: number, weightUnit: WeightUnit, date: string }[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      if (!exerciseLogs[exercise.exerciseName]) {
        exerciseLogs[exercise.exerciseName] = []
      }
      
      exerciseLogs[exercise.exerciseName].push({
        weight: exercise.weight,
        weightUnit: exercise.weightUnit,
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
      const firstEntry = exerciseData[0]
      const lastEntry = exerciseData[exerciseData.length - 1]
      
      // Convertir a kg para comparación si es necesario
      const firstWeight = firstEntry.weightUnit === 'lb' ? firstEntry.weight / 2.20462 : firstEntry.weight
      const lastWeight = lastEntry.weightUnit === 'lb' ? lastEntry.weight / 2.20462 : lastEntry.weight
      
      const percentageIncrease = ((lastWeight - firstWeight) / firstWeight) * 100
      
      if (percentageIncrease >= percentageThreshold) {
        return true
      }
    }
  }
  
  return false
}

// Calcular progreso de incremento de peso
function calculateWeightIncreaseProgress(logs: WorkoutLog[], percentageThreshold: number): number {
  if (logs.length < 2) return 0
  
  let maxPercentageIncrease = 0
  
  // Organizar logs por tipo de ejercicio
  const exerciseLogs: Record<string, { weight: number, weightUnit: WeightUnit, date: string }[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      if (!exerciseLogs[exercise.exerciseName]) {
        exerciseLogs[exercise.exerciseName] = []
      }
      
      exerciseLogs[exercise.exerciseName].push({
        weight: exercise.weight,
        weightUnit: exercise.weightUnit,
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
      const firstEntry = exerciseData[0]
      const lastEntry = exerciseData[exerciseData.length - 1]
      
      // Convertir a kg para comparación si es necesario
      const firstWeight = firstEntry.weightUnit === 'lb' ? firstEntry.weight / 2.20462 : firstEntry.weight
      const lastWeight = lastEntry.weightUnit === 'lb' ? lastEntry.weight / 2.20462 : lastEntry.weight
      
      const percentageIncrease = ((lastWeight - firstWeight) / firstWeight) * 100
      
      if (percentageIncrease > maxPercentageIncrease) {
        maxPercentageIncrease = percentageIncrease
      }
    }
  }
  
  return Math.min(maxPercentageIncrease / percentageThreshold, 1)
}

// Función para verificar mejora en el Oshfit Score
function hasScoreImprovement(logs: WorkoutLog[]): boolean {
  if (logs.length < 2) return false
  
  // Calcular score para cada log
  const scores = logs.map(log => {
    // Cálculo simplificado del score
    return log.exercises.reduce((acc, ex) => {
      return acc + (ex.weight * 0.6) + (ex.perceivedEffort * 0.25) + ((ex.weight * ex.reps * ex.sets) * 0.0015)
    }, 0) / log.exercises.length
  })
  
  // Verificar si el último score es mayor que el anterior
  return scores[scores.length - 1] > scores[scores.length - 2]
}

// Calcular progreso de mejora de score
function calculateScoreImprovementProgress(logs: WorkoutLog[]): number {
  if (logs.length < 2) return 0
  
  // Calcular score para cada log
  const scores = logs.map(log => {
    // Cálculo simplificado del score
    return log.exercises.reduce((acc, ex) => {
      return acc + (ex.weight * 0.6) + (ex.perceivedEffort * 0.25) + ((ex.weight * ex.reps * ex.sets) * 0.0015)
    }, 0) / log.exercises.length
  })
  
  // Si el último score es menor o igual al anterior, no hay progreso
  if (scores[scores.length - 1] <= scores[scores.length - 2]) {
    return 0
  }
  
  // Calcular porcentaje de mejora
  const improvement = (scores[scores.length - 1] - scores[scores.length - 2]) / scores[scores.length - 2]
  
  // Considerar una mejora del 10% como progreso completo
  return Math.min(improvement * 10, 1)
}

// Obtener logs de la última semana
function getLogsFromLastWeek(logs: WorkoutLog[]): WorkoutLog[] {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return logs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= oneWeekAgo && logDate <= now
  })
}

// Contar fines de semana consecutivos con entrenamientos
function countConsecutiveWeekends(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Agrupar logs por fin de semana
  const weekendLogs: Record<string, boolean> = {}
  
  logs.forEach(log => {
    const date = new Date(log.date)
    const day = date.getDay()
    
    // 0 = Domingo, 6 = Sábado
    if (day === 0 || day === 6) {
      // Obtener el número de semana del año
      const weekNumber = getWeekNumber(date)
      const yearWeek = `${date.getFullYear()}-${weekNumber}`
      
      weekendLogs[yearWeek] = true
    }
  })
  
  // Convertir a array y ordenar
  const weekends = Object.keys(weekendLogs).sort()
  
  // Contar fines de semana consecutivos
  let consecutiveWeekends = 1
  let maxConsecutiveWeekends = 1
  
  for (let i = 1; i < weekends.length; i++) {
    const [prevYear, prevWeek] = weekends[i-1].split('-').map(Number)
    const [currYear, currWeek] = weekends[i].split('-').map(Number)
    
    // Si es la semana siguiente o la primera semana del año siguiente
    if ((currYear === prevYear && currWeek === prevWeek + 1) ||
        (currYear === prevYear + 1 && prevWeek >= 52 && currWeek === 1)) {
      consecutiveWeekends++
      maxConsecutiveWeekends = Math.max(maxConsecutiveWeekends, consecutiveWeekends)
    } else {
      consecutiveWeekends = 1
    }
  }
  
  return maxConsecutiveWeekends
}

// Función auxiliar para obtener el número de semana del año
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
} 