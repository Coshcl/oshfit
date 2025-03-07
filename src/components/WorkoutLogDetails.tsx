'use client'

import { WorkoutLog } from '@/lib/types'
import { useUser } from '@/lib/contexts/UserContext'

interface WorkoutLogDetailsProps {
  log: WorkoutLog
  onClose: () => void
  onDelete?: (id: string) => void
}

export function WorkoutLogDetails({ log, onClose, onDelete }: WorkoutLogDetailsProps) {
  const { deleteWorkoutLog } = useUser()

  const handleDelete = () => {
    if (onDelete) {
      onDelete(log.id)
      onClose()
    } else {
      if (confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
        deleteWorkoutLog(log.id)
        onClose()
      }
    }
  }

  const date = new Date(log.date)
  const formattedDate = date.toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedDateTime = log.startTime 
    ? new Date(log.startTime).toLocaleString() 
    : new Date(log.date).toLocaleDateString()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold">{log.type} - {formattedDateTime}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="p-4">
          {/* Información general */}
          <div className="mb-4">
            {log.bodyWeight && (
              <p className="text-gray-600 mb-2">
                Peso corporal: {log.bodyWeight} {log.bodyWeightUnit || 'kg'}
              </p>
            )}
            
            {log.duration && (
              <p className="text-gray-600 mb-2">
                Duración: {log.duration} minutos
              </p>
            )}
            
            {log.notes && (
              <div className="bg-blue-50 p-3 rounded-lg mt-2">
                <p className="text-sm font-medium text-blue-800">Notas:</p>
                <p className="text-sm text-blue-700">{log.notes}</p>
              </div>
            )}
          </div>
          
          {/* Lista de ejercicios */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Ejercicios:</h3>
            
            {log.exercises.map((exercise, index) => {
              // Compatibilidad: obtener reps ya sea del antiguo o del nuevo formato
              const reps = exercise.reps || (exercise.sets && exercise.repsPerSet 
                ? exercise.sets * exercise.repsPerSet 
                : 0);
              
              // Para compatibilidad con formato antiguo
              const sets = exercise.sets || 1;
              const repsPerSet = exercise.repsPerSet || exercise.reps || 0;
              
              // Calcular peso total con barra si corresponde
              const totalWeight = (exercise.includeBarWeight && exercise.barWeight && exercise.barWeight > 0)
                ? exercise.weight + exercise.barWeight
                : exercise.weight;
                
              return (
                <div 
                  key={index} 
                  className="bg-gray-50 p-3 rounded-lg flex items-start"
                >
                  <div className="text-2xl mr-3">{exercise.emoji}</div>
                  <div>
                    <p className="font-medium">{exercise.exerciseName}</p>
                    <p className="text-sm text-gray-600">
                      {totalWeight} {exercise.weightUnit || 'kg'} × {sets} sets × {repsPerSet} reps
                    </p>
                    {exercise.includeBarWeight && exercise.barWeight && exercise.barWeight > 0 && (
                      <p className="text-xs text-gray-500">
                        (Incluye barra de {exercise.barWeight} {exercise.weightUnit || 'kg'})
                      </p>
                    )}
                    <div className="mt-1 flex items-center">
                      <div className="text-xs text-gray-500 mr-2">Esfuerzo:</div>
                      <div className="bg-blue-100 px-2 py-0.5 rounded text-xs font-medium text-blue-800">
                        {exercise.perceivedEffort}/10
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {onDelete && (
          <div className="p-4 border-t">
            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Eliminar entrenamiento
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 