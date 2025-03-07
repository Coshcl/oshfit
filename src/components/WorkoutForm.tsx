'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/types'
import { ExerciseInput } from './ExerciseInput'
import { WorkoutLog } from '@/lib/types'
import { v4 as uuid } from 'uuid'

interface WorkoutFormProps {
  workoutType: 'Push' | 'Pull' | 'Legs'
  userId: string
  onComplete: (workoutLog: WorkoutLog) => void
}

export function WorkoutForm({ workoutType, userId, onComplete }: WorkoutFormProps) {
  const [bodyWeight, setBodyWeight] = useState<string>('')
  const [bodyWeightUnit, setBodyWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [notes, setNotes] = useState<string>('')
  const [duration, setDuration] = useState<number>(60)
  const [exercises, setExercises] = useState<Exercise[]>(
    getExercisesForType(workoutType).map(ex => ({
      ...ex,
      weight: 0,
      weightUnit: 'kg',
      barWeight: 0,
      sets: 3,
      reps: 10,
      effort: 7
    }))
  )

  const now = new Date()
  const formattedDate = now.toLocaleDateString()
  const formattedTime = now.toLocaleTimeString()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const workoutLog: WorkoutLog = {
      id: uuid(),
      date: formattedDate,
      time: formattedTime,
      type: workoutType,
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      bodyWeightUnit,
      exercises,
      notes: notes || undefined,
      duration
    }
    
    onComplete(workoutLog)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-100 p-3 rounded-lg text-center text-blue-800">
        <p className="font-semibold">{formattedDate} • {formattedTime}</p>
        <p className="text-sm">Entrenamiento de {workoutType}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Peso corporal (opcional)</label>
          <div className="flex">
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              className="w-full p-2 border rounded-l"
              placeholder="Peso"
              step="0.1"
            />
            <select 
              value={bodyWeightUnit}
              onChange={(e) => setBodyWeightUnit(e.target.value as 'kg' | 'lb')}
              className="bg-gray-100 border rounded-r px-2"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
        
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Duración (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {exercises.map((exercise, index) => (
          <ExerciseInput
            key={exercise.id}
            exercise={exercise}
            onChange={(updatedExercise) => {
              const updatedExercises = [...exercises]
              updatedExercises[index] = updatedExercise
              setExercises(updatedExercises)
            }}
          />
        ))}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Notas del entrenamiento</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Cómo te sentiste, observaciones, etc."
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
      >
        Finalizar entrenamiento
      </button>
    </form>
  )
} 