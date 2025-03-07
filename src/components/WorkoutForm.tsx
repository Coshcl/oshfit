'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/types'
import { ExerciseInput } from './ExerciseInput'

interface WorkoutFormProps {
  exercises: Exercise[]
  onSubmit: (data: {
    bodyWeight?: number
    exercises: {
      exerciseName: string
      emoji: string
      weight: number
      reps: number
      perceivedEffort: number
      notes?: string
    }[]
  }) => void
}

export function WorkoutForm({ exercises, onSubmit }: WorkoutFormProps) {
  const [bodyWeight, setBodyWeight] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      weight: string
      reps: string
      effort: string
      notes: string
      useAlternative: boolean
    }
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedData = {
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      exercises: exercises.map(exercise => {
        const data = exerciseData[exercise.name] || {
          weight: '0',
          reps: '0',
          effort: '0',
          notes: '',
          useAlternative: false
        }

        const exerciseInfo = data.useAlternative ? exercise.alternative : exercise

        return {
          exerciseName: exerciseInfo.name,
          emoji: exerciseInfo.emoji,
          weight: parseFloat(data.weight) || 0,
          reps: parseInt(data.reps) || 0,
          perceivedEffort: parseInt(data.effort) || 0,
          notes: data.notes || undefined
        }
      }).filter(ex => ex.weight > 0 || ex.reps > 0)
    }

    onSubmit(formattedData)
  }

  const updateExerciseData = (
    exerciseName: string,
    field: string,
    value: string | boolean
  ) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: value
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Peso corporal opcional */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Peso Corporal (opcional)
        </label>
        <input
          type="number"
          step="0.1"
          value={bodyWeight}
          onChange={(e) => setBodyWeight(e.target.value)}
          placeholder="Kg"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseInput
            key={exercise.name}
            exercise={exercise}
            data={exerciseData[exercise.name] || {
              weight: '',
              reps: '',
              effort: '',
              notes: '',
              useAlternative: false
            }}
            onChange={(field, value) => 
              updateExerciseData(exercise.name, field, value)
            }
          />
        ))}
      </div>

      {/* Botón de finalizar */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg
                   hover:bg-blue-700 transition-colors duration-200"
      >
        Finalizar Entrenamiento
      </button>
    </form>
  )
} 