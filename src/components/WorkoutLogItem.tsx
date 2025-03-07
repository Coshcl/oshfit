import { WorkoutLog } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WorkoutLogItemProps {
  log: WorkoutLog;
  onClick: () => void;
}

export function WorkoutLogItem({ log, onClick }: WorkoutLogItemProps) {
  // Obtener la fecha y hora formateada
  const date = new Date(log.date);
  const formattedDate = date.toLocaleDateString('es', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = date.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Tiempo relativo
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: es });
  
  // Contar ejercicios
  const exerciseCount = Object.keys(log.exercises || {}).length;
  
  // Determinar emoji basado en tipo de entrenamiento
  let workoutEmoji = '💪';
  
  if (log.type === 'strength') workoutEmoji = '🏋️';
  if (log.type === 'cardio') workoutEmoji = '🏃';
  if (log.type === 'stretching') workoutEmoji = '🧘';
  
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{workoutEmoji}</span>
            <h3 className="font-medium">Entrenamiento</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
          <p className="text-gray-400 text-xs">{formattedTime}</p>
        </div>
        <div className="text-xs text-gray-400">{timeAgo}</div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {/* Contador de ejercicios */}
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {exerciseCount} ejercicio{exerciseCount !== 1 ? 's' : ''}
        </span>
        
        {/* Duración */}
        {log.duration && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {log.duration} min
          </span>
        )}
        
        {/* Cardio */}
        {log.cardioAfter && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            Cardio {log.cardioMinutes ? `(${log.cardioMinutes} min)` : ''}
          </span>
        )}
        
        {/* Peso corporal */}
        {log.bodyWeight && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {log.bodyWeight} {log.bodyWeightUnit}
          </span>
        )}
      </div>
    </div>
  );
} 