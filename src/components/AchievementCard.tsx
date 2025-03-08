import React from 'react';
import { Achievement } from '@/lib/types';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

export function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const isUnlocked = achievement.isUnlocked;
  
  // Calcular porcentaje de progreso - asegurarnos de que los valores existan
  const progressPercentage = Math.min(
    Math.round(((achievement.progress || 0) * 100)),
    100
  );
  
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square rounded-lg flex items-center justify-center overflow-hidden
                 ${isUnlocked ? 'bg-blue-100' : 'bg-gray-100'}`}
    >
      {/* Barra de progreso para logros no desbloqueados */}
      {!isUnlocked && achievement.progress && achievement.progress > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-green-200 rounded-b-lg"
          style={{ 
            height: `${progressPercentage}%`,
            transition: 'height 0.3s ease-in-out'
          }}
        ></div>
      )}
      
      {/* Emoji del logro - mejorado el centrado */}
      <span className="relative z-10 flex items-center justify-center text-2xl w-full h-full">
        {achievement.emoji}
      </span>
      
      {/* Indicador de progreso numérico */}
      {!isUnlocked && achievement.currentCount !== undefined && achievement.requiredCount !== undefined && (
        <span className="absolute bottom-1 right-1 text-xs font-medium bg-white bg-opacity-70 rounded-full px-1 z-10">
          {achievement.currentCount}/{achievement.requiredCount}
        </span>
      )}
    </button>
  );
} 