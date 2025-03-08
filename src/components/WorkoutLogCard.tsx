'use client'

import { useState } from 'react'
import { WorkoutLog } from '@/lib/types'
import { EditWorkoutLogModal } from './EditWorkoutLogModal'

interface WorkoutLogCardProps {
  log: WorkoutLog
  onUpdate: (updatedLog: WorkoutLog) => void
  onDelete: (logId: string) => void
}

export function WorkoutLogCard({ log, onUpdate, onDelete }: WorkoutLogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Formatear fecha
  const formattedDate = new Date(log.date).toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Obtener número de ejercicios
  const exerciseCount = Object.keys(log.exercises || {}).length
  
  // Función para manejar el clic en el nombre del ejercicio
  const handleExerciseNameClick = (name: string) => {
    const searchQuery = encodeURIComponent(`${name} exercise form`)
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank')
  }
  
  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Cabecera */}
        <div className="p-4 bg-blue-50 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{formattedDate}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <span className="mr-4">{exerciseCount} ejercicios</span>
              <span>Duración: {log.duration} min</span>
              {log.cardioMinutes && log.cardioMinutes > 0 && (
                <span className="ml-4">Cardio: {log.cardioMinutes} min</span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              aria-label="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => log.id && onDelete(log.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              aria-label="Eliminar"
            >
              🗑️
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded"
              aria-label={isExpanded ? "Colapsar" : "Expandir"}
            >
              {isExpanded ? "▲" : "▼"}
            </button>
          </div>
        </div>
        
        {/* Contenido expandible */}
        {isExpanded && (
          <div className="p-4 border-t border-gray-100">
            {/* Ejercicios */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Ejercicios:</h4>
              {log.exercises && Object.entries(log.exercises).map(([name, data]) => (
                <div key={name} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">{data.emoji || '💪'}</span>
                    <span 
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleExerciseNameClick(name)}
                    >
                      {name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {data.weight && (
                      <span className="mr-3">{data.weight} {data.weightUnit}</span>
                    )}
                    <span>{data.sets} × {data.reps}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Notas */}
            {log.notes && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Notas:</h4>
                <p className="text-gray-600 mt-1 whitespace-pre-line">{log.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal de edición */}
      <EditWorkoutLogModal
        log={log}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdate}
      />
    </>
  )
} 