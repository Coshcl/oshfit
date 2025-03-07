'use client'

import { WorkoutLog } from '@/lib/types'
import { useUser } from '@/lib/contexts/UserContext'

interface WorkoutLogDetailsProps {
  log: WorkoutLog
  onClose: () => void
}

export function WorkoutLogDetails({ log, onClose }: WorkoutLogDetailsProps) {
  const { deleteWorkoutLog } = useUser()

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      deleteWorkoutLog(log.id)
      onClose()
    }
  }

  const date = new Date(log.date)
  const formattedDate = date.toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{formattedDate}</h2>
            <p className="text-sm text-gray-500">Entrenamiento de {log.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Peso corporal */}
          {log.bodyWeight && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Peso Corporal</span>
              <span className="font-medium">{log.bodyWeight} kg</span>
            </div>
          )}

          {/* Ejercicios */}
          <div className="space-y-4">
            {log.exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{exercise.emoji}</span>
                  <span className="font-medium">{exercise.exerciseName}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Peso</p>
                    <p className="font-medium">{exercise.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reps</p>
                    <p className="font-medium">{exercise.reps}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Esfuerzo</p>
                    <p className="font-medium">{exercise.perceivedEffort}/10</p>
                  </div>
                </div>

                {exercise.notes && (
                  <p className="mt-2 text-sm text-gray-600">
                    {exercise.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Botón de eliminar */}
          <button
            onClick={handleDelete}
            className="w-full py-2 text-red-600 hover:text-red-800
                     border-t border-gray-200 mt-4"
          >
            Eliminar Entrenamiento
          </button>
        </div>
      </div>
    </div>
  )
} 