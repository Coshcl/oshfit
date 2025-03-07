import { WorkoutLog, Achievement, UserProfile, WorkoutType, Exercise } from '@/lib/types'
import { exercises } from '@/lib/config/exercises'

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

// Función para calcular el progreso de un logro (0 a 1)
export function getAchievementProgress(achievementId: string, logs: WorkoutLog[], user: UserProfile): number {
  switch (achievementId) {
    case 'seven_days':
      const weekStreak = calculateCurrentStreak(logs)
      return Math.min(weekStreak / 7, 1)
      
    case 'consistency':
      const monthStreak = calculateCurrentStreak(logs)
      return Math.min(monthStreak / 30, 1)
      
    case 'weight_increase':
      return calculateWeightProgressPercentage(logs)
      
    case 'triple_crown':
      return calculateTripleCrownProgress(logs)
      
    case 'consistency_artist':
      return calculateConsistencyArtistProgress(logs)
      
    case 'volume_master':
      return calculateVolumeProgress(logs)
      
    case 'multifaceted':
      if (logs.length === 0) return 0
      const maxExercises = logs.reduce((max, log) => 
        Math.max(max, log.exercises.length), 0)
      return Math.min(maxExercises / 8, 1)
      
    case 'experimenter':
      return calculateExperimenterProgress(logs)
      
    case 'personal_best':
      return calculatePersonalBestProgress(logs)
      
    default:
      return 0
  }
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
      return logs.some(log => log.exercises.every(ex => 
        ex.perceivedEffort > 0 && ex.weight > 0 && ex.sets > 0 && ex.repsPerSet > 0))
      
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
      
    // Nuevos logros
    case 'early_bird':
      return logs.some(log => {
        if (!log.startTime) return false
        const time = new Date(log.startTime)
        return time.getHours() < 8
      })
      
    case 'night_owl':
      return logs.some(log => {
        if (!log.startTime) return false
        const time = new Date(log.startTime)
        return time.getHours() >= 21
      })
      
    case 'iron_marathon':
      return logs.some(log => log.duration && log.duration > 90)
      
    case 'extreme_efficiency':
      return logs.some(log => {
        if (!log.duration || log.duration >= 45) return false
        const avgEffort = log.exercises.reduce((sum, ex) => sum + ex.perceivedEffort, 0) / log.exercises.length
        return avgEffort > 8
      })
      
    case 'triple_crown':
      return hasTripleCrownInWeek(logs)
      
    case 'consistency_artist':
      return hasConsistentDayOfWeek(logs, 4)
      
    case 'volume_master':
      return logs.some(log => {
        const totalVolume = log.exercises.reduce((sum, ex) => {
          const totalWeight = ex.includeBarWeight && ex.barWeight 
            ? ex.weight + ex.barWeight 
            : ex.weight
          return sum + (totalWeight * ex.sets * ex.repsPerSet)
        }, 0)
        
        // Convertir libras a kg si es necesario
        const totalVolumeKg = log.exercises.reduce((sum, ex) => {
          if (ex.weightUnit === 'lb') {
            const weightInKg = ex.weight * 0.45359237
            const barWeightInKg = ex.includeBarWeight && ex.barWeight 
              ? ex.barWeight * 0.45359237
              : 0
            return sum + ((weightInKg + barWeightInKg) * ex.sets * ex.repsPerSet)
          }
          return sum
        }, totalVolume)
        
        return totalVolumeKg >= 10000
      })
      
    case 'multifaceted':
      return logs.some(log => {
        const uniqueExercises = new Set(log.exercises.map(ex => ex.exerciseName))
        return uniqueExercises.size >= 8
      })
      
    case 'experimenter':
      return hasUsedAllAlternatives(logs)
      
    case 'personal_best':
      return hasConsecutiveWeightIncrease(logs, 5)
      
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
  let currentDate = new Date(sortedLogs[0].date)
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const nextDate = new Date(sortedLogs[i].date)
    
    // Formato YYYY-MM-DD para comparar solo fechas
    const currDateStr = currentDate.toISOString().split('T')[0]
    const nextDateStr = nextDate.toISOString().split('T')[0]
    
    if (currDateStr === nextDateStr) {
      // Mismo día, ignorar
      continue
    }
    
    // Calcular diferencia en días
    const diffTime = nextDate.getTime() - currentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      // Día consecutivo
      consecutiveDays++
      if (consecutiveDays >= days) return true
    } else {
      // Secuencia rota
      consecutiveDays = 1
    }
    
    currentDate = nextDate
  }
  
  return false
}

// Calcula racha actual para barras de progreso
function calculateCurrentStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Ordenar logs por fecha, más reciente primero
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Verificar si el último log es de hoy o ayer
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastLogDate = new Date(sortedLogs[0].date)
  const lastLogDay = new Date(lastLogDate.getFullYear(), lastLogDate.getMonth(), lastLogDate.getDate())
  
  const timeDiff = today.getTime() - lastLogDay.getTime()
  const dayDiff = timeDiff / (1000 * 3600 * 24)
  
  if (dayDiff > 1) {
    // El último log es de hace más de 1 día, no hay racha activa
    return 0
  }
  
  // Contar días consecutivos hacia atrás
  let streak = 1
  let currentDate = lastLogDay
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date)
    const logDay = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())
    
    // Esperamos que sea el día anterior
    const expectedPrevDate = new Date(currentDate)
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)
    
    if (logDay.getTime() === expectedPrevDate.getTime()) {
      streak++
      currentDate = logDay
    } else {
      break
    }
  }
  
  return streak
}

// Función para verificar incremento de peso
function hasWeightIncrease(logs: WorkoutLog[], percentageThreshold: number): boolean {
  // Necesitamos al menos 2 logs para comparar
  if (logs.length < 2) return false
  
  // Organizar logs por tipo de ejercicio
  const exerciseLogs: Record<string, { weight: number, weightUnit: string, date: string }[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      if (!exerciseLogs[exercise.exerciseName]) {
        exerciseLogs[exercise.exerciseName] = []
      }
      
      exerciseLogs[exercise.exerciseName].push({
        weight: exercise.weight,
        weightUnit: exercise.weightUnit || 'kg',
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
      const first = exerciseData[0]
      const last = exerciseData[exerciseData.length - 1]
      
      // Convertir a kg si es necesario para comparación
      const firstWeightKg = first.weightUnit === 'lb' ? first.weight * 0.45359237 : first.weight
      const lastWeightKg = last.weightUnit === 'lb' ? last.weight * 0.45359237 : last.weight
      
      const percentageIncrease = ((lastWeightKg - firstWeightKg) / firstWeightKg) * 100
      
      if (percentageIncrease >= percentageThreshold) {
        return true
      }
    }
  }
  
  return false
}

// Función para calcular el progreso del incremento de peso
function calculateWeightProgressPercentage(logs: WorkoutLog[]): number {
  if (logs.length < 2) return 0
  
  // Usar la misma lógica para calcular el aumento máximo
  let maxIncrease = 0
  
  // Organizar logs por tipo de ejercicio
  const exerciseLogs: Record<string, { weight: number, weightUnit: string, date: string }[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      if (!exerciseLogs[exercise.exerciseName]) {
        exerciseLogs[exercise.exerciseName] = []
      }
      
      exerciseLogs[exercise.exerciseName].push({
        weight: exercise.weight,
        weightUnit: exercise.weightUnit || 'kg',
        date: log.date
      })
    })
  })
  
  // Calcular el máximo incremento entre cualquier ejercicio
  for (const exerciseName in exerciseLogs) {
    const exerciseData = exerciseLogs[exerciseName]
    
    // Ordenar por fecha
    exerciseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    if (exerciseData.length >= 2) {
      const first = exerciseData[0]
      const last = exerciseData[exerciseData.length - 1]
      
      // Convertir a kg si es necesario para comparación
      const firstWeightKg = first.weightUnit === 'lb' ? first.weight * 0.45359237 : first.weight
      const lastWeightKg = last.weightUnit === 'lb' ? last.weight * 0.45359237 : last.weight
      
      const percentageIncrease = ((lastWeightKg - firstWeightKg) / firstWeightKg) * 100
      
      maxIncrease = Math.max(maxIncrease, percentageIncrease)
    }
  }
  
  // Normalizar a un valor entre 0 y 1, considerando 5% como el objetivo
  return Math.min(maxIncrease / 5, 1)
}

// Función para verificar mejora en el Oshfit Score
function hasScoreImprovement(logs: WorkoutLog[]): boolean {
  if (logs.length < 2) return false
  
  // Calcular score para cada log
  const scores = logs.map(log => {
    // Cálculo simplificado del score alineado con el componente OshfitScore
    return log.exercises.reduce((acc, ex) => {
      const weightScore = (ex.weight / 100) * 60
      const effortScore = (ex.perceivedEffort / 10) * 25
      const volumeScore = ((ex.weight * ex.sets * ex.repsPerSet) / 1000) * 15
      return acc + weightScore + effortScore + volumeScore
    }, 0) / log.exercises.length
  })
  
  // Verificar si el último score es mayor que el anterior
  return scores[scores.length - 1] > scores[scores.length - 2]
}

// Función para verificar Triple Crown (Push, Pull, Legs en una semana)
function hasTripleCrownInWeek(logs: WorkoutLog[]): boolean {
  if (logs.length < 3) return false
  
  // Agrupar logs por semana
  const weekLogs: Record<string, Set<WorkoutType>> = {}
  
  logs.forEach(log => {
    const date = new Date(log.date)
    // Obtener el lunes de esa semana
    const day = date.getDay() || 7 // 0 = domingo, 1-6 = lunes-sábado, convertimos 0 a 7
    const monday = new Date(date)
    monday.setDate(date.getDate() - day + 1) // Retroceder al lunes
    
    const weekKey = monday.toISOString().split('T')[0]
    
    if (!weekLogs[weekKey]) {
      weekLogs[weekKey] = new Set()
    }
    
    weekLogs[weekKey].add(log.type)
  })
  
  // Verificar si alguna semana tiene los tres tipos
  return Object.values(weekLogs).some(types => 
    types.has('Push') && types.has('Pull') && types.has('Legs'))
}

// Función para calcular progreso de Triple Crown
function calculateTripleCrownProgress(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Limitamos a la semana actual o última semana con registros
  const now = new Date()
  // Obtener el lunes de esta semana
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1)
  const mondayStr = monday.toISOString().split('T')[0]
  
  // Filtrar logs de esta semana
  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= monday
  })
  
  // Si no hay logs esta semana, buscar la última semana con logs
  if (thisWeekLogs.length === 0) {
    // No tenemos logs de esta semana, calculamos el mejor progreso histórico
    const types = new Set(logs.map(log => log.type))
    return types.size / 3
  }
  
  // Contar tipos únicos esta semana
  const typesThisWeek = new Set(thisWeekLogs.map(log => log.type))
  return typesThisWeek.size / 3
}

// Función para verificar consistencia en el día de la semana
function hasConsistentDayOfWeek(logs: WorkoutLog[], weeksRequired: number): boolean {
  if (logs.length < weeksRequired) return false
  
  // Agrupar logs por día de la semana
  const dayOfWeekCounts: Record<number, string[]> = {}
  
  logs.forEach(log => {
    const date = new Date(log.date)
    const dayOfWeek = date.getDay()
    
    if (!dayOfWeekCounts[dayOfWeek]) {
      dayOfWeekCounts[dayOfWeek] = []
    }
    
    dayOfWeekCounts[dayOfWeek].push(log.date)
  })
  
  // Verificar si hay algún día de la semana con suficientes entradas consecutivas
  for (const dayOfWeek in dayOfWeekCounts) {
    const dates = dayOfWeekCounts[dayOfWeek]
    
    if (dates.length < weeksRequired) continue
    
    // Ordenar fechas
    dates.sort()
    
    // Verificar semanas consecutivas
    let consecutiveWeeks = 1
    let maxConsecutiveWeeks = 1
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1])
      const currDate = new Date(dates[i])
      
      // Verificar si son semanas consecutivas (7 días de diferencia)
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays >= 6 && diffDays <= 8) { // Permitimos un margen de error de ±1 día
        consecutiveWeeks++
        maxConsecutiveWeeks = Math.max(maxConsecutiveWeeks, consecutiveWeeks)
      } else {
        consecutiveWeeks = 1
      }
    }
    
    if (maxConsecutiveWeeks >= weeksRequired) {
      return true
    }
  }
  
  return false
}

// Función para calcular progreso de consistencia en día de la semana
function calculateConsistencyArtistProgress(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Agrupar logs por día de la semana
  const dayOfWeekLogs: Record<number, Date[]> = {}
  
  logs.forEach(log => {
    const date = new Date(log.date)
    const dayOfWeek = date.getDay()
    
    if (!dayOfWeekLogs[dayOfWeek]) {
      dayOfWeekLogs[dayOfWeek] = []
    }
    
    dayOfWeekLogs[dayOfWeek].push(date)
  })
  
  // Encontrar el día con más entradas consecutivas
  let maxConsecutiveWeeks = 0
  
  for (const dayOfWeek in dayOfWeekLogs) {
    const dates = dayOfWeekLogs[dayOfWeek]
    
    if (dates.length < 2) continue
    
    // Ordenar fechas
    dates.sort((a, b) => a.getTime() - b.getTime())
    
    // Verificar semanas consecutivas
    let consecutiveWeeks = 1
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i-1]
      const currDate = dates[i]
      
      // Verificar si son semanas consecutivas (7 días de diferencia)
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays >= 6 && diffDays <= 8) { // Permitimos un margen de error de ±1 día
        consecutiveWeeks++
      } else {
        // Si se rompe la secuencia, reiniciamos
        consecutiveWeeks = 1
      }
      
      maxConsecutiveWeeks = Math.max(maxConsecutiveWeeks, consecutiveWeeks)
    }
  }
  
  // Normalizar a un valor entre 0 y 1, considerando 4 semanas como objetivo
  return Math.min(maxConsecutiveWeeks / 4, 1)
}

// Función para calcular progreso del volumen
function calculateVolumeProgress(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Calcular el máximo volumen en kg en cualquier entrenamiento
  let maxVolume = 0
  
  logs.forEach(log => {
    let totalVolume = 0
    
    log.exercises.forEach(ex => {
      // Convertir libras a kg si es necesario
      const weightInKg = ex.weightUnit === 'lb' ? ex.weight * 0.45359237 : ex.weight
      const barWeightInKg = ex.includeBarWeight && ex.barWeight 
        ? (ex.weightUnit === 'lb' ? ex.barWeight * 0.45359237 : ex.barWeight)
        : 0
      
      totalVolume += (weightInKg + barWeightInKg) * ex.sets * ex.repsPerSet
    })
    
    maxVolume = Math.max(maxVolume, totalVolume)
  })
  
  // Normalizar a un valor entre 0 y 1, considerando 10.000 kg como objetivo
  return Math.min(maxVolume / 10000, 1)
}

// Función para verificar uso de todas las alternativas
function hasUsedAllAlternatives(logs: WorkoutLog[]): boolean {
  if (logs.length === 0) return false
  
  // Obtener todas las alternativas disponibles
  const allAlternatives = new Set<string>()
  
  Object.values(exercises).forEach(typeExercises => {
    typeExercises.forEach(exercise => {
      allAlternatives.add(exercise.alternative.name)
    })
  })
  
  // Verificar cuáles se han usado
  const usedExercises = new Set<string>()
  
  logs.forEach(log => {
    log.exercises.forEach(ex => {
      usedExercises.add(ex.exerciseName)
    })
  })
  
  // Verificar si se han usado todas las alternativas
  for (const alternative of allAlternatives) {
    if (!usedExercises.has(alternative)) {
      return false
    }
  }
  
  return true
}

// Función para calcular progreso de experimentador
function calculateExperimenterProgress(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  
  // Obtener todas las alternativas disponibles
  const allAlternatives = new Set<string>()
  
  Object.values(exercises).forEach(typeExercises => {
    typeExercises.forEach(exercise => {
      allAlternatives.add(exercise.alternative.name)
    })
  })
  
  // Verificar cuáles se han usado
  const usedExercises = new Set<string>()
  
  logs.forEach(log => {
    log.exercises.forEach(ex => {
      usedExercises.add(ex.exerciseName)
    })
  })
  
  // Contar cuántas alternativas se han usado
  let usedCount = 0
  
  for (const alternative of allAlternatives) {
    if (usedExercises.has(alternative)) {
      usedCount++
    }
  }
  
  // Normalizar a un valor entre 0 y 1
  return usedCount / allAlternatives.size
}

// Función para verificar aumento de peso 5 semanas consecutivas
function hasConsecutiveWeightIncrease(logs: WorkoutLog[], weeksRequired: number): boolean {
  if (logs.length < weeksRequired) return false
  
  // Agrupar logs por ejercicio
  const exerciseLogs: Record<string, {date: string, weight: number, weightUnit: string}[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(ex => {
      if (!exerciseLogs[ex.exerciseName]) {
        exerciseLogs[ex.exerciseName] = []
      }
      
      exerciseLogs[ex.exerciseName].push({
        date: log.date,
        weight: ex.weight,
        weightUnit: ex.weightUnit || 'kg'
      })
    })
  })
  
  // Verificar si hay algún ejercicio con weeksRequired aumentos consecutivos
  for (const exerciseName in exerciseLogs) {
    const exerciseEntries = exerciseLogs[exerciseName]
    
    // Ordenar por fecha
    exerciseEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Agrupar por semana
    const weeklyEntries: Record<string, {weight: number, weightUnit: string}[]> = {}
    
    exerciseEntries.forEach(entry => {
      const date = new Date(entry.date)
      // Obtener el lunes de la semana
      const day = date.getDay() || 7
      const monday = new Date(date)
      monday.setDate(date.getDate() - day + 1)
      
      const weekKey = monday.toISOString().split('T')[0]
      
      if (!weeklyEntries[weekKey]) {
        weeklyEntries[weekKey] = []
      }
      
      weeklyEntries[weekKey].push({
        weight: entry.weight,
        weightUnit: entry.weightUnit
      })
    })
    
    // Obtener el peso máximo por semana
    const weeklyMaxWeights: {week: string, weight: number}[] = []
    
    for (const week in weeklyEntries) {
      const entries = weeklyEntries[week]
      
      // Convertir todos los pesos a kg para comparación
      const weightsInKg = entries.map(entry => 
        entry.weightUnit === 'lb' ? entry.weight * 0.45359237 : entry.weight)
      
      const maxWeight = Math.max(...weightsInKg)
      
      weeklyMaxWeights.push({
        week,
        weight: maxWeight
      })
    }
    
    // Ordenar por semana
    weeklyMaxWeights.sort((a, b) => a.week.localeCompare(b.week))
    
    // Verificar aumentos consecutivos
    let consecutiveIncreases = 0
    let maxConsecutiveIncreases = 0
    
    for (let i = 1; i < weeklyMaxWeights.length; i++) {
      if (weeklyMaxWeights[i].weight > weeklyMaxWeights[i-1].weight) {
        consecutiveIncreases++
        maxConsecutiveIncreases = Math.max(maxConsecutiveIncreases, consecutiveIncreases)
      } else {
        consecutiveIncreases = 0
      }
    }
    
    if (maxConsecutiveIncreases + 1 >= weeksRequired) { // +1 porque contamos el primer peso como base
      return true
    }
  }
  
  return false
}

// Función para calcular progreso de superación personal
function calculatePersonalBestProgress(logs: WorkoutLog[]): number {
  if (logs.length < 2) return 0
  
  // Usar lógica similar a hasConsecutiveWeightIncrease
  // Agrupar logs por ejercicio
  const exerciseLogs: Record<string, {date: string, weight: number, weightUnit: string}[]> = {}
  
  logs.forEach(log => {
    log.exercises.forEach(ex => {
      if (!exerciseLogs[ex.exerciseName]) {
        exerciseLogs[ex.exerciseName] = []
      }
      
      exerciseLogs[ex.exerciseName].push({
        date: log.date,
        weight: ex.weight,
        weightUnit: ex.weightUnit || 'kg'
      })
    })
  })
  
  // Encontrar máximo de semanas consecutivas con aumento para cualquier ejercicio
  let maxConsecutiveIncreases = 0
  
  for (const exerciseName in exerciseLogs) {
    const exerciseEntries = exerciseLogs[exerciseName]
    
    // Ordenar por fecha
    exerciseEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Agrupar por semana
    const weeklyEntries: Record<string, {weight: number, weightUnit: string}[]> = {}
    
    exerciseEntries.forEach(entry => {
      const date = new Date(entry.date)
      // Obtener el lunes de la semana
      const day = date.getDay() || 7
      const monday = new Date(date)
      monday.setDate(date.getDate() - day + 1)
      
      const weekKey = monday.toISOString().split('T')[0]
      
      if (!weeklyEntries[weekKey]) {
        weeklyEntries[weekKey] = []
      }
      
      weeklyEntries[weekKey].push({
        weight: entry.weight,
        weightUnit: entry.weightUnit
      })
    })
    
    // Obtener el peso máximo por semana
    const weeklyMaxWeights: {week: string, weight: number}[] = []
    
    for (const week in weeklyEntries) {
      const entries = weeklyEntries[week]
      
      // Convertir todos los pesos a kg para comparación
      const weightsInKg = entries.map(entry => 
        entry.weightUnit === 'lb' ? entry.weight * 0.45359237 : entry.weight)
      
      const maxWeight = Math.max(...weightsInKg)
      
      weeklyMaxWeights.push({
        week,
        weight: maxWeight
      })
    }
    
    // Ordenar por semana
    weeklyMaxWeights.sort((a, b) => a.week.localeCompare(b.week))
    
    // Verificar aumentos consecutivos
    let consecutiveIncreases = 0
    
    for (let i = 1; i < weeklyMaxWeights.length; i++) {
      if (weeklyMaxWeights[i].weight > weeklyMaxWeights[i-1].weight) {
        consecutiveIncreases++
      } else {
        consecutiveIncreases = 0
      }
      
      maxConsecutiveIncreases = Math.max(maxConsecutiveIncreases, consecutiveIncreases)
    }
  }
  
  // Normalizar a un valor entre 0 y 1, considerando 5 semanas como objetivo
  return Math.min((maxConsecutiveIncreases + 1) / 5, 1) // +1 porque contamos el primer peso como base
} 