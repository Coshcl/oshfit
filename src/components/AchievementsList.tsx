'use client'

import { Achievement, UserProfile } from '@/lib/types'
import { useState } from 'react'
import { AchievementProgress } from './AchievementProgress'

interface AchievementsListProps {
  achievements: Achievement[]
  user: UserProfile
}

export function AchievementsList({ achievements, user }: AchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showUnlocked, setShowUnlocked] = useState<boolean>(true) // Por defecto mostrar los desbloqueados

  // Contar logros desbloqueados
  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  // Filtrar logros según el estado seleccionado
  const filteredAchievements = showUnlocked 
    ? achievements 
    : achievements.filter(a => !a.isUnlocked)

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Logros ({unlockedCount}/{achievements.length})</h2>
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            onClick={() => setShowUnlocked(true)}
            className={`px-3 py-1 text-sm ${
              showUnlocked 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setShowUnlocked(false)}
            className={`px-3 py-1 text-sm ${
              !showUnlocked 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {filteredAchievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`rounded-lg flex flex-col items-center p-3
              ${achievement.isUnlocked 
                ? 'bg-blue-100 hover:bg-blue-200' 
                : 'bg-gray-100 hover:bg-gray-200'}
              transition-colors duration-200`}
          >
            <span className="text-2xl mb-1">{achievement.emoji}</span>
            <span className="text-xs font-medium text-center">{achievement.name}</span>
            
            {/* Mostrar barra de progreso para logros que lo permitan */}
            <AchievementProgress 
              achievement={achievement}
              user={user}
            />
          </button>
        ))}
      </div>

      {/* Modal de detalles del logro */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-4xl mb-4 text-center">{selectedAchievement.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{selectedAchievement.name}</h3>
            <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
            
            {/* Mostrar barra de progreso en el modal si corresponde */}
            {selectedAchievement.progressTrackable && !selectedAchievement.isUnlocked && (
              <div className="mb-4">
                <AchievementProgress 
                  achievement={selectedAchievement}
                  user={user}
                />
              </div>
            )}
            
            {selectedAchievement.isUnlocked && selectedAchievement.unlockedAt && (
              <p className="text-sm text-gray-500">
                Desbloqueado el {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={() => setSelectedAchievement(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 