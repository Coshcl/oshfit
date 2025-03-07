'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts/UserContext'
import { WorkoutType } from '@/lib/types'
import { exercises } from '@/lib/config/exercises'
import { WorkoutForm } from '@/components/WorkoutForm'

export default function NewWorkoutPage() {
  const router = useRouter()
  const { user, addWorkoutLog } = useUser()
  const [selectedType, setSelectedType] = useState<WorkoutType | null>(null)

  if (!user) return null

  const handleWorkoutSubmit = async (workoutData: any) => {
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedType!,
      ...workoutData
    }
    
    const newAchievements = await addWorkoutLog(newLog)
    
    // Si hay nuevos logros, mostrar notificación
    if (newAchievements.length > 0) {
      console.log('¡Nuevos logros desbloqueados!', newAchievements)
    }
    
    router.push(`/dashboard/${user.id.toLowerCase()}/logs`)
  }

  const workoutTypes: { type: WorkoutType; icon: string; description: string }[] = [
    { type: 'Push', icon: '💪', description: 'Pecho, hombros, tríceps' },
    { type: 'Pull', icon: '🏋️', description: 'Espalda, bíceps, antebrazos' },
    { type: 'Legs', icon: '🦵', description: 'Cuádriceps, isquios, glúteos' },
  ]

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Nuevo Entrenamiento</h1>
      
      {!selectedType ? (
        <div className="space-y-4">
          <p className="text-gray-600">Selecciona el tipo de entrenamiento:</p>
          <div className="grid grid-cols-1 gap-4">
            {workoutTypes.map(({ type, icon, description }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="bg-white rounded-lg shadow hover:shadow-md
                         flex items-center p-4 space-x-4
                         transition-shadow duration-200"
              >
                <span className="text-3xl">{icon}</span>
                <div className="text-left">
                  <span className="font-medium">{type}</span>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Entrenamiento de {selectedType}
            </h2>
            <button
              onClick={() => setSelectedType(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Cambiar
            </button>
          </div>

          <WorkoutForm
            exercises={exercises[selectedType]}
            onSubmit={handleWorkoutSubmit}
            workoutType={selectedType}
          />
        </div>
      )}
    </div>
  )
} 