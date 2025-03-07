import { useState, useEffect } from 'react';
import { Achievement } from '@/lib/types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Mostrar con animación
    setTimeout(() => setIsVisible(true), 100);
    
    // Ocultar automáticamente después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Esperar a que termine la animación
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-xs transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex items-center">
        <span className="text-3xl mr-3">{achievement.emoji}</span>
        <div>
          <h3 className="font-bold">¡Logro desbloqueado!</h3>
          <p className="font-medium">{achievement.name}</p>
          <p className="text-sm text-blue-100 mt-1">{achievement.description}</p>
        </div>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 500);
        }}
        className="absolute top-2 right-2 text-blue-200 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
} 