'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts/UserContext'
import { WorkoutForm } from '@/components/WorkoutForm'

export default function NewWorkoutPage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedType, setSelectedType] = useState<'Push' | 'Pull' | 'Legs' | null>(null)

  const handleTypeSelect = (type: 'Push' | 'Pull' | 'Legs') => {
    setSelectedType(type)
  }

  const handleWorkoutComplete = () => {
    // Redirigir al usuario a su dashboard después de completar el entrenamiento
    if (user) {
      router.push(`/dashboard/${user.name}`)
    }
  }

  if (!user) {
    return <div className="p-4 text-center">Cargando usuario...</div>
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Entrenamiento</h1>

      {!selectedType ? (
        <div className="space-y-4">
          <p className="text-lg mb-4">Selecciona el tipo de entrenamiento:</p>
          
          <button
            onClick={() => handleTypeSelect('Push')}
            className="w-full bg-blue-600 text-white p-4 rounded-lg mb-3"
          >
            Push (Empuje) 💪
          </button>
          
          <button
            onClick={() => handleTypeSelect('Pull')}
            className="w-full bg-blue-600 text-white p-4 rounded-lg mb-3"
          >
            Pull (Tirón) 🏋️
          </button>
          
          <button
            onClick={() => handleTypeSelect('Legs')}
            className="w-full bg-blue-600 text-white p-4 rounded-lg"
          >
            Legs (Piernas) 🦵
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedType(null)}
              className="mr-3 text-blue-600"
            >
              ← Volver
            </button>
            <h2 className="text-xl font-semibold">
              Entrenamiento de {selectedType}
            </h2>
          </div>
          
          <WorkoutForm
            workoutType={selectedType}
            userId={user.id}
            onComplete={handleWorkoutComplete}
          />
        </div>
      )}
    </div>
  );
} 