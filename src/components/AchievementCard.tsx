import { Achievement } from '@/lib/types';
import { useState } from 'react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calcular porcentaje de progreso
  const progressPercentage = Math.min(
    Math.round((achievement.progress / achievement.requiredProgress) * 100),
    100
  );
  
  // Determinar color basado en estado
  const bgColor = achievement.unlocked 
    ? 'bg-green-100 border-green-300' 
    : 'bg-gray-100 border-gray-300';
  
  // Determinar color de la barra de progreso
  const progressColor = achievement.unlocked 
    ? 'bg-green-500' 
    : 'bg-blue-500';

  return (
    <div 
      className={`relative border rounded-lg p-3 ${bgColor} cursor-pointer`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{achievement.emoji}</span>
        <span className="font-medium">{achievement.name}</span>
        {achievement.unlocked && (
          <span className="ml-auto text-green-600 text-sm">✓</span>
        )}
      </div>
      
      {/* Barra de progreso */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${progressColor} transition-all duration-500`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="mt-1 text-xs text-right text-gray-600">
        {achievement.progress}/{achievement.requiredProgress}
      </div>
      
      {/* Panel de detalles */}
      {showDetails && (
        <div className="mt-3 text-sm">
          <p>{achievement.description}</p>
          {!achievement.unlocked && progressPercentage > 0 && (
            <p className="mt-1 text-blue-600">
              ¡Vas por buen camino! {progressPercentage}% completado
            </p>
          )}
        </div>
      )}
    </div>
  );
} 