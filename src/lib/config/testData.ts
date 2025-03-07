import { UserProfile, WorkoutType } from '../types'
import { achievements } from './achievements'
import { exercises } from './exercises'

function generateTestLogs() {
  const logs = []
  const startDate = new Date('2024-02-01')
  const types: WorkoutType[] = ['Push', 'Pull', 'Legs']
  let currentWeight = 75 // Peso inicial
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Alternar entre tipos de entrenamiento
    const type = types[i % 3]
    
    // Variar el peso corporal ligeramente
    currentWeight += (Math.random() - 0.5) * 0.3
    
    const workoutExercises = exercises[type].map(exercise => {
      const baseWeight = type === 'Legs' ? 100 : 60
      const baseReps = 12
      
      // Generar progresión realista
      const progressFactor = 1 + (i / 60) // Incremento gradual
      const randomVariation = (Math.random() - 0.5) * 5

      return {
        exerciseName: exercise.name,
        emoji: exercise.emoji,
        weight: Math.round((baseWeight * progressFactor + randomVariation) * 2) / 2, // Redondear a 0.5
        reps: Math.floor(baseReps + (Math.random() - 0.5) * 4),
        perceivedEffort: Math.floor(7 + Math.random() * 4),
        notes: Math.random() > 0.7 ? 'Aumenté peso en la última serie' : undefined
      }
    })

    logs.push({
      id: date.toISOString(),
      date: date.toISOString(),
      type,
      bodyWeight: Math.round(currentWeight * 10) / 10,
      exercises: workoutExercises
    })
  }

  return logs
}

// Marcar algunos logros como desbloqueados aleatoriamente
const unlockedAchievements = achievements.map(achievement => ({
  ...achievement,
  isUnlocked: Math.random() > 0.6,
  unlockedAt: Math.random() > 0.6 ? new Date('2024-02-15').toISOString() : undefined
}))

export const coshTestData: UserProfile = {
  id: 'Cosh',
  name: 'cosh',
  logs: generateTestLogs(),
  achievements: unlockedAchievements,
  oshfitScore: 85.5
} 