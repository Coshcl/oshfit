'use client'

import { Exercise } from '@/lib/types'

interface ExerciseInputProps {
  exercise: Exercise
  data: {
    weight: string
    reps: string
    effort: string
    notes: string
    useAlternative: boolean
  }
  onChange: (field: string, value: string | boolean) => void
}

export function ExerciseInput({ exercise, data, onChange }: ExerciseInputProps) {
  const currentExercise = data.useAlternative ? exercise.alternative : exercise

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentExercise.emoji}</span>
          <span className="font-medium">{currentExercise.name}</span>
        </div>
        
        <button
          type="button"
          onClick={() => onChange('useAlternative', !data.useAlternative)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {data.useAlternative ? 'Usar Principal' : 'Usar Alternativa'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
          <input
            type="number"
            step="0.5"
            value={data.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Repeticiones</label>
          <input
            type="number"
            value={data.reps}
            onChange={(e) => onChange('reps', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Esfuerzo Percibido (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={data.effort || '1'}
          onChange={(e) => onChange('effort', e.target.value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Notas (opcional)
        </label>
        <input
          type="text"
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Ej: Aumenté el peso en la última serie"
        />
      </div>
    </div>
  )
} 