'use client'

import { Exercise, WeightUnit } from '@/lib/types'

interface ExerciseInputProps {
  exercise: Exercise
  data: {
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
  onChange: (field: string, value: string | boolean) => void
}

export function ExerciseInput({ exercise, data, onChange }: ExerciseInputProps) {
  const currentExercise = data.useAlternative ? exercise.alternative : exercise

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

      {/* Selección de unidad de peso */}
      <div className="flex items-center mb-3">
        <span className="text-sm text-gray-600 mr-2">Unidad de peso:</span>
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => onChange('weightUnit', 'kg')}
            className={`px-3 py-1 text-sm ${
              data.weightUnit === 'kg' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            kg
          </button>
          <button
            type="button"
            onClick={() => onChange('weightUnit', 'lb')}
            className={`px-3 py-1 text-sm ${
              data.weightUnit === 'lb' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            lb
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Peso</label>
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
          <label className="block text-sm text-gray-600 mb-1">Sets</label>
          <input
            type="number"
            value={data.sets}
            onChange={(e) => onChange('sets', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Reps/Set</label>
          <input
            type="number"
            value={data.repsPerSet}
            onChange={(e) => onChange('repsPerSet', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0"
          />
        </div>
      </div>

      {/* Opción de peso de barra */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id={`includeBar-${currentExercise.name}`}
          checked={data.includeBarWeight}
          onChange={(e) => onChange('includeBarWeight', e.target.checked)}
          className="h-4 w-4 mr-2"
        />
        <label 
          htmlFor={`includeBar-${currentExercise.name}`}
          className="text-sm text-gray-600 mr-2"
        >
          Incluir peso de barra:
        </label>
        <input
          type="number"
          step="0.5"
          value={data.barWeight}
          onChange={(e) => onChange('barWeight', e.target.value)}
          className={`w-20 p-2 border rounded-md ${!data.includeBarWeight ? 'opacity-50' : ''}`}
          placeholder="0"
          disabled={!data.includeBarWeight}
        />
        <span className="ml-1 text-sm text-gray-500">{data.weightUnit}</span>
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