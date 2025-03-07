import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_log',
    name: 'First Steps',
    description: 'Completaste tu primer entrenamiento',
    emoji: '🎯',
    isUnlocked: false
  },
  {
    id: 'first_push',
    name: 'Push Master',
    description: 'Completaste tu primer entrenamiento Push',
    emoji: '💪',
    isUnlocked: false
  },
  {
    id: 'first_pull',
    name: 'Pull Expert',
    description: 'Completaste tu primer entrenamiento Pull',
    emoji: '🏋️‍♂️',
    isUnlocked: false
  },
  {
    id: 'first_legs',
    name: 'Leg Day Champion',
    description: 'Completaste tu primer entrenamiento Legs',
    emoji: '🦵',
    isUnlocked: false
  },
  {
    id: 'perfect_log',
    name: 'Perfectionist',
    description: 'Completaste un log perfecto sin errores',
    emoji: '✨',
    isUnlocked: false
  },
  {
    id: 'seven_days',
    name: 'Week Warrior',
    description: '7 días consecutivos de entrenamiento',
    emoji: '📅',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'weight_increase',
    name: 'Getting Stronger',
    description: 'Incremento del 5% en peso en cualquier ejercicio',
    emoji: '📈',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'max_effort',
    name: 'All Out',
    description: 'Esfuerzo percibido de 10 en un ejercicio',
    emoji: '🔥',
    isUnlocked: false
  },
  {
    id: 'score_improvement',
    name: 'Score Chaser',
    description: 'Superaste tu Oshfit Score anterior',
    emoji: '🏆',
    isUnlocked: false
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    description: '30 días de entrenamiento consecutivo',
    emoji: '👑',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Completar un entrenamiento antes de las 8 AM',
    emoji: '🌅',
    isUnlocked: false
  },
  {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Completar un entrenamiento después de las 9 PM',
    emoji: '🦉',
    isUnlocked: false
  },
  {
    id: 'iron_marathon',
    name: 'Maratonista de Hierro',
    description: 'Entrenamiento de más de 90 minutos',
    emoji: '⏱️',
    isUnlocked: false
  },
  {
    id: 'extreme_efficiency',
    name: 'Eficiencia Extrema',
    description: 'Entrenamiento de alta calidad en menos de 45 minutos',
    emoji: '⚡',
    isUnlocked: false
  },
  {
    id: 'triple_crown',
    name: 'Triple Corona',
    description: 'Push, Pull y Legs en una misma semana',
    emoji: '👑',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'consistency_artist',
    name: 'Artista de la Consistencia',
    description: 'Mismo día de la semana durante 4 semanas consecutivas',
    emoji: '🎨',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'volume_master',
    name: 'Maestro del Volumen',
    description: '10.000 kg de volumen total en un entrenamiento',
    emoji: '📊',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'multifaceted',
    name: 'Multifacético',
    description: 'Al menos 8 ejercicios diferentes en un entrenamiento',
    emoji: '🔄',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'experimenter',
    name: 'Experimentador',
    description: 'Usar todas las alternativas de ejercicios al menos una vez',
    emoji: '🧪',
    isUnlocked: false,
    progressTrackable: true
  },
  {
    id: 'personal_best',
    name: 'Superación Personal',
    description: 'Aumentar peso en un ejercicio 5 semanas consecutivas',
    emoji: '🚀',
    isUnlocked: false,
    progressTrackable: true
  }
]; 