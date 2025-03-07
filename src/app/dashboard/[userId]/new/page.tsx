'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts/UserContext'
import { WorkoutType } from '@/lib/types'
import { exercises } from '@/lib/config/exercises'
import { WorkoutForm } from '@/components/WorkoutForm'
import { ExerciseList } from '@/components/ExerciseList'

export default function NewWorkoutPage() {
  const router = useRouter()
  const { user, addWorkoutLog } = useUser()
  const [selectedType, setSelectedType] = useState<WorkoutType | null>(null)

  if (!user) return null

  const handleWorkoutSubmit = (workoutData: any) => {
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedType!,
      ...workoutData
    }
    
    addWorkoutLog(newLog)
    router.push(`/dashboard/${user.id.toLowerCase()}/logs`)
  }

  const workoutTypes: { type: WorkoutType; icon: string }[] = [
    { type: 'Push', icon: '💪' },
    { type: 'Pull', icon: '🏋️' },
    { type: 'Legs', icon: '🦵' },
  ]

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Nuevo Entrenamiento</h1>
      
      {!selectedType ? (
        <div className="grid grid-cols-3 gap-4">
          {workoutTypes.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="aspect-square bg-white rounded-lg shadow hover:shadow-md
                       flex flex-col items-center justify-center space-y-2
                       transition-shadow duration-200"
            >
              <span className="text-3xl">{icon}</span>
              <span className="font-medium">{type}</span>
            </button>
          ))}
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
          />
        </div>
      )}
    </div>
  )
} 