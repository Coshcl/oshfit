'use client'

import { Exercise } from '@/lib/types'
import { useState } from 'react'

interface ExerciseInputProps {
  exercise: Exercise
  onChange: (updatedExercise: Exercise) => void
}

export function ExerciseInput({ exercise, onChange }: ExerciseInputProps) {
  const [showAlternative, setShowAlternative] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(exercise)
  
  // Manejador para abrir búsqueda en YouTube
  const handleYouTubeSearch = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se active el toggle de alternativa
    
    const exerciseName = showAlternative 
      ? exercise.alternative.name 
      : exercise.name
    
    const searchQuery = `cómo hacer ${exerciseName} correctamente`
    const encodedQuery = encodeURIComponent(searchQuery)
    window.open(`https://www.youtube.com/results?search_query=${encodedQuery}`, '_blank')
  }

  const handleChange = (field: string, value: any) => {
    const updatedExercise = { ...currentExercise, [field]: value }
    setCurrentExercise(updatedExercise)
    onChange(updatedExercise)
  }

  const handleToggleAlternative = () => {
    setShowAlternative(!showAlternative)
    const newExercise = showAlternative
      ? { ...currentExercise, name: exercise.name, id: exercise.id, emoji: exercise.emoji }
      : { ...currentExercise, name: exercise.alternative.name, id: exercise.alternative.id, emoji: exercise.alternative.emoji }
    
    setCurrentExercise(newExercise)
    onChange(newExercise)
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">
            {showAlternative ? exercise.alternative.emoji : exercise.emoji}
          </span>
          <span 
            className="font-medium text-blue-600 underline cursor-pointer"
            onClick={handleYouTubeSearch}
          >
            {showAlternative ? exercise.alternative.name : exercise.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggleAlternative}
          className="text-xs bg-gray-100 px-2 py-1 rounded"
        >
          {showAlternative ? 'Usar principal' : 'Usar alternativa'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Peso</label>
            <div className="flex">
              <input
                type="number"
                value={currentExercise.weight}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded-l"
                min="0"
                step="0.5"
              />
              <select 
                value={currentExercise.weightUnit}
                onChange={(e) => handleChange('weightUnit', e.target.value)}
                className="bg-gray-100 border rounded-r px-2"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1">Peso de la barra</label>
          <div className="flex">
            <input
              type="number"
              value={currentExercise.barWeight || 0}
              onChange={(e) => handleChange('barWeight', parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-l"
              min="0"
              step="0.5"
            />
            <span className="bg-gray-100 border rounded-r px-2 flex items-center">
              {currentExercise.weightUnit}
            </span>
          </div>
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1">Series</label>
          <input
            type="number"
            value={currentExercise.sets}
            onChange={(e) => handleChange('sets', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1">Reps por serie</label>
          <input
            type="number"
            value={currentExercise.reps}
            onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
      </div>
      
      <div className="mt-3">
        <label className="text-xs font-medium mb-1">
          Esfuerzo percibido (1-10): {currentExercise.effort}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={currentExercise.effort}
          onChange={(e) => handleChange('effort', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Fácil</span>
          <span>Moderado</span>
          <span>Difícil</span>
        </div>
      </div>
    </div>
  )
} 