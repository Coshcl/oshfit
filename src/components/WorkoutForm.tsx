'use client'

import { useState } from 'react'
import { Exercise, WeightUnit } from '@/lib/types'
import { ExerciseInput } from './ExerciseInput'

interface WorkoutFormProps {
  exercises: Exercise[]
  onSubmit: (data: {
    bodyWeight?: number
    bodyWeightUnit?: WeightUnit
    startTime: string
    duration?: number
    notes?: string
    exercises: {
      exerciseName: string
      emoji: string
      weight: number
      weightUnit: WeightUnit
      sets: number
      repsPerSet: number
      barWeight?: number
      includeBarWeight?: boolean
      perceivedEffort: number
    }[]
  }) => void
}

export function WorkoutForm({ exercises, onSubmit }: WorkoutFormProps) {
  const [bodyWeight, setBodyWeight] = useState<string>('')
  const [bodyWeightUnit, setBodyWeightUnit] = useState<WeightUnit>('kg')
  const [duration, setDuration] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      weight: string
      weightUnit: WeightUnit
      sets: string
      repsPerSet: string
      barWeight: string
      includeBarWeight: boolean
      effort: string
      notes: string
      useAlternative: boolean
    }
  }>({})

  // Configurar fecha/hora actual al cargar el formulario
  const [startTime, setStartTime] = useState<string>(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16) // Formato YYYY-MM-DDTHH:MM
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedData = {
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      bodyWeightUnit: bodyWeight ? bodyWeightUnit : undefined,
      startTime,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
      exercises: exercises.map(exercise => {
        const data = exerciseData[exercise.name] || {
          weight: '0',
          weightUnit: 'kg',
          sets: '0',
          repsPerSet: '0',
          barWeight: '0',
          includeBarWeight: false,
          effort: '0',
          notes: '',
          useAlternative: false
        }

        const exerciseInfo = data.useAlternative ? exercise.alternative : exercise

        return {
          exerciseName: exerciseInfo.name,
          emoji: exerciseInfo.emoji,
          weight: parseFloat(data.weight) || 0,
          weightUnit: data.weightUnit,
          sets: parseInt(data.sets) || 0,
          repsPerSet: parseInt(data.repsPerSet) || 0,
          barWeight: data.includeBarWeight ? parseFloat(data.barWeight) || 0 : undefined,
          includeBarWeight: data.includeBarWeight,
          perceivedEffort: parseInt(data.effort) || 0
        }
      }).filter(ex => ex.weight > 0 || ex.sets > 0 || ex.repsPerSet > 0)
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

  const getInitialExerciseData = (exercise: Exercise) => {
    return exerciseData[exercise.name] || {
      weight: '',
      weightUnit: 'kg',
      sets: '',
      repsPerSet: '',
      barWeight: '',
      includeBarWeight: false,
      effort: '',
      notes: '',
      useAlternative: false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fecha y hora */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha y hora del entrenamiento
        </label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Peso corporal opcional */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Peso Corporal (opcional)
        </label>
        <div className="flex items-center">
          <input
            type="number"
            step="0.1"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(e.target.value)}
            placeholder="0"
            className="w-full p-2 border rounded-md"
          />
          <div className="flex rounded-md overflow-hidden border border-gray-300 ml-2">
            <button
              type="button"
              onClick={() => setBodyWeightUnit('kg')}
              className={`px-3 py-2 text-sm ${
                bodyWeightUnit === 'kg' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setBodyWeightUnit('lb')}
              className={`px-3 py-2 text-sm ${
                bodyWeightUnit === 'lb' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              lb
            </button>
          </div>
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseInput
            key={exercise.name}
            exercise={exercise}
            data={getInitialExerciseData(exercise)}
            onChange={(field, value) => 
              updateExerciseData(exercise.name, field, value)
            }
          />
        ))}
      </div>
      
      {/* Duración del entrenamiento */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duración del entrenamiento (minutos)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="60"
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      {/* Notas generales */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas generales (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded-md"
          placeholder="Observaciones generales sobre el entrenamiento..."
        />
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