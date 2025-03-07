'use client'

import { useState } from 'react'
import { Achievement } from '@/lib/types'
import { AchievementCard } from './AchievementCard'

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Logros</h2>
      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <div key={achievement.id}>
            <button
              type="button"
              onClick={() => setSelectedAchievement(achievement)}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl
                ${achievement.unlocked 
                  ? 'bg-blue-100 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-400'}`}
            >
              {achievement.emoji}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de detalles del logro */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{selectedAchievement.emoji}</span>
              <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
            </div>
            
            <p className="mb-4">{selectedAchievement.description}</p>
            
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${selectedAchievement.unlocked ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500`}
                  style={{ width: `${Math.min((selectedAchievement.progress / selectedAchievement.requiredProgress) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-right">
                {selectedAchievement.progress}/{selectedAchievement.requiredProgress}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 