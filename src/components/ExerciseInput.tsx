'use client'

import { Exercise, WeightUnit } from '@/lib/types'

interface ExerciseInputProps {
  exercise: Exercise
  data: {
    weight: string
    weightUnit: WeightUnit
    sets: string
    reps: string
    effort: string
    useAlternative: boolean
  }
  onChange: (field: string, value: string | WeightUnit | boolean) => void
  userPreferredUnit: WeightUnit
}

export function ExerciseInput({
  exercise,
  data,
  onChange,
  userPreferredUnit
}: ExerciseInputProps) {
  // Si hay un ejercicio alternativo disponible
  const hasAlternative = !!exercise.alternativeExercise
  
  // Nombre del ejercicio a mostrar basado en si estamos usando la alternativa
  const displayName = data.useAlternative && exercise.alternativeExercise 
    ? exercise.alternativeExercise 
    : exercise.name

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-xl mr-2">{exercise.emoji || '💪'}</span>
          <h3 className="font-medium">{displayName}</h3>
        </div>
        
        {/* Opción para usar ejercicio alternativo */}
        {hasAlternative && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`alternative-${exercise.name}`}
              checked={data.useAlternative}
              onChange={(e) => onChange('useAlternative', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor={`alternative-${exercise.name}`} className="ml-1 text-xs text-gray-700">
              Usar alternativa
            </label>
          </div>
        )}
      </div>

      {/* Peso */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso
          </label>
          <div className="flex">
            <input
              type="number"
              step="0.5"
              value={data.weight}
              onChange={(e) => onChange('weight', e.target.value)}
              placeholder="0"
              className="w-full p-2 border rounded-l-md"
            />
            <select
              value={data.weightUnit}
              onChange={(e) => onChange('weightUnit', e.target.value as WeightUnit)}
              className="bg-gray-100 border border-l-0 rounded-r-md px-2"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        {/* Esfuerzo percibido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Esfuerzo (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={data.effort}
            onChange={(e) => onChange('effort', e.target.value)}
            placeholder="Nivel de esfuerzo"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Mejorada UI para Sets x Reps */}
      <div className="bg-gray-50 p-3 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Series y Repeticiones
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              Series
            </label>
            <input
              type="number"
              min="1"
              value={data.sets}
              onChange={(e) => onChange('sets', e.target.value)}
              placeholder="Series"
              className="w-full p-2 border rounded-md bg-white"
            />
          </div>
          
          <div className="text-lg font-bold text-gray-400">×</div>
          
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              Repeticiones
            </label>
            <input
              type="number"
              min="1"
              value={data.reps}
              onChange={(e) => onChange('reps', e.target.value)}
              placeholder="Reps"
              className="w-full p-2 border rounded-md bg-white"
            />
          </div>
        </div>
        
        <div className="mt-2 text-center text-sm text-gray-500">
          {data.sets && data.reps ? (
            <span>Total: {parseInt(data.sets) * parseInt(data.reps)} repeticiones</span>
          ) : (
            <span>Ingresa series y repeticiones</span>
          )}
        </div>
      </div>
    </div>
  )
} 