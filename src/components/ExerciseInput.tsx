'use client'

import { Exercise, WeightUnit } from '@/lib/types'
import { useState } from 'react'

interface ExerciseInputProps {
  exercise: Exercise
  data: {
    weight: string
    weightUnit: WeightUnit
    barWeight: string
    sets: string
    reps: string
    effort: string
    notes: string
    useAlternative: boolean
  }
  onChange: (field: string, value: string | boolean | WeightUnit) => void
  userPreferredUnit?: WeightUnit
}

export function ExerciseInput({ exercise, data, onChange, userPreferredUnit = 'kg' }: ExerciseInputProps) {
  const currentExercise = data.useAlternative ? exercise.alternative : exercise
  const [showBarWeight, setShowBarWeight] = useState(false)

  // Función para abrir búsqueda en YouTube
  const openYouTubeSearch = () => {
    const query = encodeURIComponent(`como hacer ${currentExercise.name}`)
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentExercise.emoji}</span>
          <button 
            onClick={openYouTubeSearch}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            title="Buscar en YouTube"
          >
            {currentExercise.name}
          </button>
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
          <label className="block text-sm text-gray-600 mb-1">Peso</label>
          <div className="flex">
            <input
              type="number"
              step="0.5"
              value={data.weight}
              onChange={(e) => onChange('weight', e.target.value)}
              className="w-full p-2 border rounded-l-md"
              placeholder="0"
            />
            <select
              value={data.weightUnit}
              onChange={(e) => onChange('weightUnit', e.target.value as WeightUnit)}
              className="bg-gray-100 border border-l-0 rounded-r-md px-2"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm text-gray-600">Sets × Reps</label>
            <button
              type="button"
              onClick={() => setShowBarWeight(!showBarWeight)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showBarWeight ? 'Ocultar peso barra' : 'Añadir peso barra'}
            </button>
          </div>
          <div className="flex">
            <input
              type="number"
              value={data.sets}
              onChange={(e) => onChange('sets', e.target.value)}
              className="w-1/3 p-2 border rounded-l-md"
              placeholder="Sets"
            />
            <span className="flex items-center justify-center bg-gray-100 px-2 border-t border-b">×</span>
            <input
              type="number"
              value={data.reps}
              onChange={(e) => onChange('reps', e.target.value)}
              className="w-2/3 p-2 border rounded-r-md"
              placeholder="Reps"
            />
          </div>
        </div>
      </div>

      {/* Peso de la barra (opcional) */}
      {showBarWeight && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Peso de la barra ({data.weightUnit})
          </label>
          <input
            type="number"
            step="0.5"
            value={data.barWeight}
            onChange={(e) => onChange('barWeight', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder={`Peso de la barra (${data.weightUnit})`}
          />
        </div>
      )}

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