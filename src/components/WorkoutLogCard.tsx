'use client'

import { WorkoutLog } from '@/lib/types'
import { useUser } from '@/lib/contexts/UserContext'

interface WorkoutLogCardProps {
  log: WorkoutLog
  onClick: () => void
}

export function WorkoutLogCard({ log, onClick }: WorkoutLogCardProps) {
  const { user } = useUser()
  const date = new Date(log.date)
  const formattedDate = date.toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const formattedTime = date.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Encontrar el entrenamiento anterior del mismo tipo
  const previousLog = user?.logs
    .filter(l => l.type === log.type && new Date(l.date) < new Date(log.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  // Calcular progreso para cada ejercicio
  const exerciseProgress = log.exercises.map(exercise => {
    if (!previousLog) {
      return {
        emoji: exercise.emoji,
        progress: null // Primer entrenamiento, sin color
      }
    }

    const previousExercise = previousLog.exercises.find(
      e => e.exerciseName === exercise.exerciseName
    )

    if (!previousExercise) {
      return {
        emoji: exercise.emoji,
        progress: null // Primer ejercicio de este tipo, sin color
      }
    }

    // Convertir pesos a la misma unidad (kg) para comparación
    const currentWeightKg = exercise.weightUnit === 'lb' ? exercise.weight / 2.20462 : exercise.weight
    const previousWeightKg = previousExercise.weightUnit === 'lb' ? previousExercise.weight / 2.20462 : previousExercise.weight

    if (currentWeightKg > previousWeightKg) {
      return {
        emoji: exercise.emoji,
        progress: true // Verde
      }
    } else if (currentWeightKg < previousWeightKg) {
      return {
        emoji: exercise.emoji,
        progress: false // Rojo
      }
    } else {
      // Si el peso es igual, comparar repeticiones totales (sets * reps)
      const currentVolume = exercise.sets * exercise.reps
      const previousVolume = previousExercise.sets * previousExercise.reps
      
      if (currentVolume > previousVolume) {
        return {
          emoji: exercise.emoji,
          progress: true
        }
      } else if (currentVolume < previousVolume) {
        return {
          emoji: exercise.emoji,
          progress: false
        }
      } else {
        return {
          emoji: exercise.emoji,
          progress: null // Sin cambios, sin color
        }
      }
    }
  })

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow hover:shadow-md
                 transition-shadow duration-200 p-4 text-left"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{formattedDate}</h3>
          <p className="text-sm text-gray-500">
            {formattedTime} • {log.type}
            {log.duration && ` • ${log.duration} min`}
            {log.cardioAfter && ' • 🏃'}
          </p>
        </div>
        {log.bodyWeight && (
          <div className="text-sm text-gray-500">
            {log.bodyWeight} {log.bodyWeightUnit || 'kg'}
          </div>
        )}
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-1">
        {exerciseProgress.map((exercise, index) => (
          <div
            key={index}
            className={`min-w-[3rem] aspect-square rounded-lg flex items-center justify-center
              ${exercise.progress === true ? 'bg-green-100' : 
                exercise.progress === false ? 'bg-red-100' : 
                'bg-gray-50'}`}
          >
            <span className="text-xl">{exercise.emoji}</span>
          </div>
        ))}
      </div>
    </button>
  )
} 