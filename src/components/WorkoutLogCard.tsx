'use client'

import { WorkoutLog, ExerciseData } from '@/lib/types'
import { useState } from 'react'
import { WorkoutLogDetails } from './WorkoutLogDetails'

interface WorkoutLogCardProps {
  log: WorkoutLog
  previousLog?: WorkoutLog
  onDelete?: (id: string) => void
}

export function WorkoutLogCard({ log, previousLog, onDelete }: WorkoutLogCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Función para determinar si hay progreso en cada ejercicio
  const getExerciseProgress = (exercise: ExerciseData) => {
    if (!previousLog) return null

    // Buscar el mismo ejercicio en el log anterior
    const previousExercise = previousLog.exercises.find(
      ex => ex.exerciseName === exercise.exerciseName
    )

    if (!previousExercise) return null

    // Convertir pesos a la misma unidad (kg) para comparación
    const currentWeight = exercise.weightUnit === 'lb' 
      ? exercise.weight * 0.45359237 
      : exercise.weight
      
    const previousWeight = previousExercise.weightUnit === 'lb'
      ? previousExercise.weight * 0.45359237
      : previousExercise.weight

    // Calcular repeticiones totales (sets * repsPerSet)
    const currentReps = (exercise.sets || 0) * (exercise.repsPerSet || 0)
    const previousReps = (previousExercise.sets || 0) * (previousExercise.repsPerSet || 0)

    if (currentWeight > previousWeight) {
      return {
        emoji: exercise.emoji,
        progress: true
      }
    } else {
      // Si el peso es igual, comparar repeticiones
      if (currentReps > previousReps) {
        return {
          emoji: exercise.emoji,
          progress: true
        }
      } else if (currentWeight < previousWeight || currentReps < previousReps) {
        return {
          emoji: exercise.emoji,
          progress: false
        }
      }
    }

    // Si todo es igual
    return {
      emoji: exercise.emoji,
      progress: null
    }
  }

  // Obtener la lista de progresos para cada ejercicio
  const exerciseProgress = log.exercises.map(getExerciseProgress).filter(Boolean)

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