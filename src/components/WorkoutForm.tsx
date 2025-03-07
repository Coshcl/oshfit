'use client'

import { useState, useEffect } from 'react'
import { Exercise, WeightUnit, WorkoutType } from '@/lib/types'
import { ExerciseInput } from './ExerciseInput'
import { useUser } from '@/lib/contexts/UserContext'

interface WorkoutFormProps {
  exercises: Exercise[]
  onSubmit: (data: {
    bodyWeight?: number
    bodyWeightUnit?: WeightUnit
    exercises: {
      exerciseName: string
      emoji: string
      weight: number
      weightUnit: WeightUnit
      sets: number
      reps: number
      perceivedEffort: number
    }[]
    notes?: string
    duration?: number
    cardioAfter?: boolean
    cardioMinutes?: number
    type: WorkoutType
  }) => void
  workoutType: WorkoutType
}

export function WorkoutForm({ exercises, onSubmit, workoutType }: WorkoutFormProps) {
  const { user } = useUser()
  const preferredUnit = user?.preferredWeightUnit || 'kg'
  
  const [bodyWeight, setBodyWeight] = useState<string>('')
  const [bodyWeightUnit, setBodyWeightUnit] = useState<WeightUnit>(preferredUnit)
  const [notes, setNotes] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [cardioAfter, setCardioAfter] = useState<boolean>(false)
  const [cardioMinutes, setCardioMinutes] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      weight: string
      weightUnit: WeightUnit
      sets: string
      reps: string
      effort: string
      useAlternative: boolean
    }
  }>({})

  // Obtener la fecha y hora actual
  const now = new Date()
  const formattedDate = now.toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = now.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Reiniciar cardioMinutes cuando se desactiva el checkbox
  useEffect(() => {
    if (!cardioAfter) {
      setCardioMinutes('');
    }
  }, [cardioAfter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedData = {
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      bodyWeightUnit: bodyWeight ? bodyWeightUnit : undefined,
      exercises: exercises.map(exercise => {
        const data = exerciseData[exercise.name] || {
          weight: '0',
          weightUnit: preferredUnit,
          sets: '0',
          reps: '0',
          effort: '0',
          useAlternative: false
        }

        const exerciseInfo = data.useAlternative && exercise.alternativeExercise 
          ? { name: exercise.alternativeExercise, emoji: exercise.emoji } 
          : exercise

        return {
          exerciseName: exerciseInfo.name,
          emoji: exerciseInfo.emoji || '💪',
          weight: parseFloat(data.weight) || 0,
          weightUnit: data.weightUnit,
          sets: parseInt(data.sets) || 0,
          reps: parseInt(data.reps) || 0,
          perceivedEffort: parseInt(data.effort) || 0
        }
      }).filter(ex => ex.weight > 0 || ex.sets > 0 || ex.reps > 0),
      notes: notes || undefined,
      duration: duration ? parseInt(duration) : undefined,
      cardioAfter,
      cardioMinutes: cardioAfter && cardioMinutes ? parseInt(cardioMinutes) : undefined,
      type: workoutType
    }

    onSubmit(formattedData)
  }

  const updateExerciseData = (
    exerciseName: string,
    field: string,
    value: string | boolean | WeightUnit
  ) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: value
      }
    }))
  }

  const initializeExerciseData = (exerciseName: string) => {
    if (!exerciseData[exerciseName]) {
      setExerciseData(prev => ({
        ...prev,
        [exerciseName]: {
          weight: '',
          weightUnit: preferredUnit,
          sets: '',
          reps: '',
          effort: '',
          useAlternative: false
        }
      }))
    }
  }

  // Inicializar datos para todos los ejercicios
  exercises.forEach(exercise => {
    initializeExerciseData(exercise.name)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fecha y hora actual */}
      <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
        <p className="text-sm text-gray-500">Registrando entrenamiento</p>
        <p className="font-medium">{formattedDate}</p>
        <p className="text-sm text-gray-500">{formattedTime}</p>
      </div>

      {/* Peso corporal opcional */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Peso Corporal (opcional)
        </label>
        <div className="flex">
          <input
            type="number"
            step="0.1"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(e.target.value)}
            placeholder="Peso"
            className="w-full p-2 border rounded-l-md"
          />
          <select
            value={bodyWeightUnit}
            onChange={(e) => setBodyWeightUnit(e.target.value as WeightUnit)}
            className="bg-gray-100 border border-l-0 rounded-r-md px-2"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseInput
            key={exercise.name}
            exercise={exercise}
            data={exerciseData[exercise.name] || {
              weight: '',
              weightUnit: preferredUnit,
              sets: '',
              reps: '',
              effort: '',
              useAlternative: false
            }}
            onChange={(field, value) => 
              updateExerciseData(exercise.name, field, value)
            }
            userPreferredUnit={preferredUnit}
          />
        ))}
      </div>

      {/* Notas generales */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas del entrenamiento (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Añade notas sobre tu entrenamiento..."
          className="w-full p-2 border rounded-md h-24"
        />
      </div>

      {/* Duración y cardio */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración del entrenamiento (minutos)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duración en minutos"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cardioAfter"
              checked={cardioAfter}
              onChange={(e) => setCardioAfter(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="cardioAfter" className="ml-2 text-sm text-gray-700">
              También hice cardio durante este entrenamiento
            </label>
          </div>
          
          {cardioAfter && (
            <div className="pl-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Cuántos minutos de cardio?
              </label>
              <input
                type="number"
                value={cardioMinutes}
                onChange={(e) => setCardioMinutes(e.target.value)}
                placeholder="Minutos de cardio"
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
        </div>
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