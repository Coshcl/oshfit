'use client'

import { Achievement } from '@/lib/types'
import { useState } from 'react'

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  // Ordenar logros: primero desbloqueados, luego por progreso
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1
    if (!a.isUnlocked && b.isUnlocked) return 1
    if (!a.isUnlocked && !b.isUnlocked) return (b.progress || 0) - (a.progress || 0)
    return 0
  })

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Logros</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {sortedAchievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className="relative aspect-square rounded-lg flex items-center justify-center text-2xl"
          >
            {/* Fondo base */}
            <div className={`absolute inset-0 rounded-lg ${
              achievement.isUnlocked 
                ? 'bg-blue-100' 
                : 'bg-gray-100'
            }`}></div>
            
            {/* Barra de progreso para logros no desbloqueados */}
            {!achievement.isUnlocked && achievement.progress && achievement.progress > 0 && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-green-200 rounded-b-lg"
                style={{ 
                  height: `${achievement.progress * 100}%`,
                  transition: 'height 0.3s ease-in-out'
                }}
              ></div>
            )}
            
            {/* Emoji del logro */}
            <span className="relative z-10">{achievement.emoji}</span>
            
            {/* Indicador de progreso numérico */}
            {!achievement.isUnlocked && achievement.currentCount !== undefined && achievement.requiredCount !== undefined && (
              <span className="absolute bottom-1 right-1 text-xs font-medium bg-white bg-opacity-70 rounded-full px-1 z-10">
                {achievement.currentCount}/{achievement.requiredCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Modal de detalles del logro */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-4xl mb-4">{selectedAchievement.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{selectedAchievement.name}</h3>
            <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
            
            {/* Mostrar progreso para logros no desbloqueados */}
            {!selectedAchievement.isUnlocked && selectedAchievement.progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progreso</span>
                  <span>{Math.round(selectedAchievement.progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${selectedAchievement.progress * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Mostrar contador para logros con requisitos numéricos */}
            {selectedAchievement.currentCount !== undefined && selectedAchievement.requiredCount !== undefined && (
              <p className="text-sm text-gray-500 mb-4">
                Progreso: {selectedAchievement.currentCount} de {selectedAchievement.requiredCount} 
                {selectedAchievement.isUnlocked ? ' (Completado)' : ''}
              </p>
            )}
            
            {selectedAchievement.unlockedAt && (
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