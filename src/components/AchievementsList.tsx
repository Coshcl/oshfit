'use client'

import { Achievement } from '@/lib/types'
import { useState } from 'react'

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Logros</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl
              ${achievement.isUnlocked 
                ? 'bg-blue-100 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-400'}`}
          >
            {achievement.emoji}
          </button>
        ))}
      </div>

      {/* Modal de detalles del logro */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-4xl mb-4">{selectedAchievement.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{selectedAchievement.name}</h3>
            <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
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