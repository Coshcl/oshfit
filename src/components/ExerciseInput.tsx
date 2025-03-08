'use client'

import { Exercise, WeightUnit } from '@/lib/types'
import { useState } from 'react'

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
  onChange: (field: string, value: string | boolean | WeightUnit) => void
  userPreferredUnit: WeightUnit
}

export function ExerciseInput({ 
  exercise, 
  data, 
  onChange, 
  userPreferredUnit 
}: ExerciseInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showVideo, setShowVideo] = useState<string | null>(null)
  
  // Función para obtener URL de YouTube basada en el nombre del ejercicio
  const getYoutubeUrl = (exerciseName: string) => {
    // En un caso real, estas URLs vendrían de una base de datos o API
    // Esto es solo para demostración
    const searchQuery = encodeURIComponent(`${exerciseName} exercise form`)
    return `https://www.youtube.com/results?search_query=${searchQuery}`
  }
  
  // Función para manejar el clic en el nombre del ejercicio
  const handleExerciseNameClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation() // Evitar que se expanda/colapse
    window.open(getYoutubeUrl(name), '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cabecera del ejercicio */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="text-xl mr-2">{exercise.emoji}</span>
          <h3 
            className="font-medium text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => handleExerciseNameClick(e, exercise.name)}
          >
            {exercise.name}
          </h3>
        </div>
        <button
          type="button"
          className="text-gray-500"
          aria-label={isExpanded ? "Colapsar" : "Expandir"}
        >
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100">
          {/* Ejercicio alternativo si existe */}
          {exercise.alternativeExercise && (
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={data.useAlternative}
                  onChange={(e) => onChange('useAlternative', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">
                  Usar alternativa: 
                  <span 
                    className="text-blue-600 hover:underline cursor-pointer ml-1"
                    onClick={(e) => {
                      e.preventDefault()
                      handleExerciseNameClick(e, exercise.alternativeExercise || '')
                    }}
                  >
                    {exercise.alternativeExercise}
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Peso */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso
            </label>
            <div className="flex">
              <input
                type="number"
                value={data.weight}
                onChange={(e) => onChange('weight', e.target.value)}
                placeholder="Peso"
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

          {/* Sets y Reps - UI mejorada */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series y Repeticiones
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1 text-center">Series</div>
                <input
                  type="number"
                  value={data.sets}
                  onChange={(e) => onChange('sets', e.target.value)}
                  placeholder="Series"
                  className="w-full p-2 border rounded-md text-center"
                />
              </div>
              <div className="text-xl font-light text-gray-400">×</div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1 text-center">Repeticiones</div>
                <input
                  type="number"
                  value={data.reps}
                  onChange={(e) => onChange('reps', e.target.value)}
                  placeholder="Reps"
                  className="w-full p-2 border rounded-md text-center"
                />
              </div>
            </div>
          </div>

          {/* Esfuerzo percibido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Esfuerzo percibido (1-10)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                value={data.effort || "5"}
                onChange={(e) => onChange('effort', e.target.value)}
                className="w-full"
              />
              <span className="ml-2 min-w-[2rem] text-center">
                {data.effort || "5"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
              <span>Fácil</span>
              <span>Moderado</span>
              <span>Difícil</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 