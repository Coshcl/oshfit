'use client'

import { WorkoutLog, ExerciseData } from '@/lib/types'
import { useState } from 'react'
import { WorkoutLogDetails } from './WorkoutLogDetails'
import { normalizeExerciseData, normalizeWorkoutLog, convertToKg } from '@/lib/utils/dataUtils'

interface WorkoutLogCardProps {
  log: WorkoutLog
  previousLog?: WorkoutLog
  onDelete?: (id: string) => void
}

export function WorkoutLogCard({ log, previousLog, onDelete }: WorkoutLogCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Normalizar logs para garantizar compatibilidad
  const normalizedLog = normalizeWorkoutLog(log)
  const normalizedPreviousLog = previousLog ? normalizeWorkoutLog(previousLog) : undefined

  // Función para determinar si hay progreso en cada ejercicio
  const getExerciseProgress = (exercise: ExerciseData) => {
    if (!normalizedPreviousLog) return null
    
    // Normalizar el ejercicio actual
    const normalizedExercise = normalizeExerciseData(exercise)

    // Buscar el mismo ejercicio en el log anterior
    const previousExercise = normalizedPreviousLog.exercises.find(
      ex => ex.exerciseName === normalizedExercise.exerciseName
    )

    if (!previousExercise) return null
    
    // Normalizar el ejercicio anterior
    const normalizedPreviousExercise = normalizeExerciseData(previousExercise)

    // Convertir pesos a kg para comparación
    const currentWeight = convertToKg(normalizedExercise.weight, normalizedExercise.weightUnit)
    const previousWeight = convertToKg(normalizedPreviousExercise.weight, normalizedPreviousExercise.weightUnit)

    // Comparar repeticiones totales
    const currentReps = normalizedExercise.sets * normalizedExercise.repsPerSet
    const previousReps = normalizedPreviousExercise.sets * normalizedPreviousExercise.repsPerSet

    if (currentWeight > previousWeight) {
      return {
        emoji: normalizedExercise.emoji,
        progress: true
      }
    } else {
      // Si el peso es igual, comparar repeticiones
      if (currentReps > previousReps) {
        return {
          emoji: normalizedExercise.emoji,
          progress: true
        }
      } else if (currentWeight < previousWeight || currentReps < previousReps) {
        return {
          emoji: normalizedExercise.emoji,
          progress: false
        }
      }
    }

    // Si todo es igual
    return {
      emoji: normalizedExercise.emoji,
      progress: null
    }
  }

  // Obtener la lista de progresos para cada ejercicio
  const exerciseProgress = normalizedLog.exercises.map(getExerciseProgress).filter(Boolean)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">
            {new Date(log.date).toLocaleDateString('es', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {log.type}
          </span>
        </div>

        {log.bodyWeight && (
          <p className="text-sm text-gray-500 mb-2">
            Peso: {log.bodyWeight} {log.bodyWeightUnit || 'kg'}
          </p>
        )}

        <div className="flex space-x-2 mt-3">
          {exerciseProgress.map((progress, index) => (
            <div 
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full
                ${progress?.progress === true ? 'bg-green-100' : 
                  progress?.progress === false ? 'bg-red-100' : 'bg-gray-100'}`}
            >
              <span>{progress?.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {showDetails && (
        <WorkoutLogDetails 
          log={log}
          onClose={() => setShowDetails(false)}
          onDelete={onDelete}
        />
      )}
    </div>
  )
} 