'use client'

import { Achievement, UserProfile } from '@/lib/types'
import { getAchievementProgress } from '@/lib/utils/achievementUtils'

interface AchievementProgressProps {
  achievement: Achievement
  user: UserProfile
}

export function AchievementProgress({ achievement, user }: AchievementProgressProps) {
  if (!achievement.progressTrackable || achievement.isUnlocked) {
    return null
  }
  
  const progress = getAchievementProgress(achievement.id, user.logs, user)
  const percentage = Math.round(progress * 100)
  
  return (
    <div className="mt-1">
      <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-0.5 text-right">
        {percentage}%
      </div>
    </div>
  )
} 