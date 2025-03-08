'use client'

import { useState, useEffect } from 'react'
import { WorkoutLog, WeightUnit } from '@/lib/types'
import { useUser } from '@/lib/contexts/UserContext'

interface EditWorkoutLogModalProps {
  log: WorkoutLog
  isOpen: boolean
  onClose: () => void
  onSave: (updatedLog: WorkoutLog) => void
}

export function EditWorkoutLogModal({ 
  log, 
  isOpen, 
  onClose, 
  onSave 
}: EditWorkoutLogModalProps) {
  const { user } = useUser()
  
  const [editedLog, setEditedLog] = useState<WorkoutLog>({ ...log })
  const [notes, setNotes] = useState(log.notes || '')
  const [duration, setDuration] = useState(log.duration.toString())
  const [cardioMinutes, setCardioMinutes] = useState((log.cardioMinutes || '0').toString())
  
  useEffect(() => {
    // Actualizar el estado cuando cambia el log
    setEditedLog({ ...log })
    setNotes(log.notes || '')
    setDuration(log.duration.toString())
    setCardioMinutes((log.cardioMinutes || '0').toString())
  }, [log])
  
  const handleSave = () => {
    const updatedLog: WorkoutLog = {
      ...editedLog,
      notes,
      duration: parseInt(duration),
      cardioMinutes: parseInt(cardioMinutes) || undefined,
      updatedAt: new Date()
    }
    
    onSave(updatedLog)
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Editar entrenamiento</h2>
          
          <div className="space-y-4">
            {/* Fecha (no editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <div className="bg-gray-100 p-2 rounded">
                {new Date(log.date).toLocaleDateString('es', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración del entrenamiento (minutos)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Cardio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutos de cardio (0 si no hiciste)
              </label>
              <input
                type="number"
                value={cardioMinutes}
                onChange={(e) => setCardioMinutes(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded h-32"
              />
            </div>
            
            {/* Nota: No permitimos editar ejercicios específicos para mantener la integridad de los datos */}
            <p className="text-sm text-gray-500 italic">
              Los ejercicios individuales no se pueden editar. Si necesitas hacer cambios importantes, 
              considera eliminar este log y crear uno nuevo.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 rounded shadow-sm text-white hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 