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

    if (exercise.weight > previousExercise.weight) {
      return {
        emoji: exercise.emoji,
        progress: true // Verde
      }
    } else if (exercise.weight < previousExercise.weight) {
      return {
        emoji: exercise.emoji,
        progress: false // Rojo
      }
    } else {
      // Si el peso es igual, comparar repeticiones
      if (exercise.reps > previousExercise.reps) {
        return {
          emoji: exercise.emoji,
          progress: true
        }
      } else if (exercise.reps < previousExercise.reps) {
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
          <p className="text-sm text-gray-500">Entrenamiento de {log.type}</p>
        </div>
        {log.bodyWeight && (
          <div className="text-sm text-gray-500">
            {log.bodyWeight} kg
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {exerciseProgress.map((exercise, index) => (
          <div
            key={index}
            className={`w-1/5 aspect-square rounded-lg flex items-center justify-center
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