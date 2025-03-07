import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_log',
    name: 'First Steps',
    description: 'Completed your first workout log',
    emoji: '🎯',
    isUnlocked: false
  },
  {
    id: 'first_push',
    name: 'Push Master',
    description: 'Completed your first Push workout',
    emoji: '💪',
    isUnlocked: false
  },
  {
    id: 'first_pull',
    name: 'Pull Expert',
    description: 'Completed your first Pull workout',
    emoji: '🏋️‍♂️',
    isUnlocked: false
  },
  {
    id: 'first_legs',
    name: 'Leg Day Champion',
    description: 'Completed your first Legs workout',
    emoji: '🦵',
    isUnlocked: false
  },
  {
    id: 'perfect_log',
    name: 'Perfectionist',
    description: 'Completed a perfect log with no errors',
    emoji: '✨',
    isUnlocked: false
  },
  {
    id: 'seven_days',
    name: 'Week Warrior',
    description: '7 consecutive days of logging',
    emoji: '📅',
    isUnlocked: false
  },
  {
    id: 'weight_increase',
    name: 'Getting Stronger',
    description: '5% weight increase in any exercise',
    emoji: '📈',
    isUnlocked: false
  },
  {
    id: 'max_effort',
    name: 'All Out',
    description: 'Recorded a perceived effort of 10',
    emoji: '🔥',
    isUnlocked: false
  },
  {
    id: 'score_improvement',
    name: 'Score Chaser',
    description: 'Beat your previous Oshfit Score',
    emoji: '🏆',
    isUnlocked: false
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    description: '30 days of consecutive logging',
    emoji: '👑',
    isUnlocked: false
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Completar un entrenamiento antes de las 7:00 AM',
    emoji: '🌅',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'time',
      condition: 'before',
      value: '07:00'
    }
  },
  {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Completar un entrenamiento después de las 9:00 PM',
    emoji: '🦉',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'time',
      condition: 'after',
      value: '21:00'
    }
  },
  {
    id: 'marathon_session',
    name: 'Maratonista',
    description: 'Completar un entrenamiento de más de 90 minutos',
    emoji: '⏱️',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'duration',
      condition: 'more',
      value: 90
    }
  },
  {
    id: 'efficiency',
    name: 'Eficiencia Máxima',
    description: 'Completar un entrenamiento efectivo en menos de 45 minutos',
    emoji: '⚡',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'duration',
      condition: 'less',
      value: 45
    }
  },
  {
    id: 'heavy_lifter',
    name: 'Peso Pesado',
    description: 'Levantar más de 100kg/220lb en cualquier ejercicio',
    emoji: '🏋️',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'weight',
      condition: 'more',
      value: 100
    }
  },
  {
    id: 'balanced',
    name: 'Equilibrado',
    description: 'Realizar al menos 3 entrenamientos de cada tipo (Push, Pull, Legs) en un mes',
    emoji: '⚖️',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 9,
    criteria: {
      type: 'balance',
      value: 3
    }
  },
  {
    id: 'weekend_warrior',
    name: 'Guerrero de Fin de Semana',
    description: 'Completar entrenamientos en 4 fines de semana consecutivos',
    emoji: '🏆',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 4,
    criteria: {
      type: 'weekend',
      condition: 'consecutive',
      value: 4
    }
  },
  {
    id: 'high_volume',
    name: 'Alto Volumen',
    description: 'Realizar más de 100 repeticiones totales en un entrenamiento',
    emoji: '📊',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 1,
    criteria: {
      type: 'volume',
      condition: 'more',
      value: 100
    }
  },
  {
    id: 'notes_master',
    name: 'Maestro de Notas',
    description: 'Añadir notas detalladas a 10 entrenamientos consecutivos',
    emoji: '📝',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 10,
    criteria: {
      type: 'notes',
      condition: 'consecutive',
      value: 10
    }
  },
  {
    id: 'consistency_king',
    name: 'Rey de la Consistencia',
    description: 'Mantener una diferencia de menos de 5% en peso entre 5 sesiones del mismo ejercicio',
    emoji: '👑',
    isUnlocked: false,
    progress: 0,
    requiredProgress: 5,
    criteria: {
      type: 'consistency',
      condition: 'less',
      value: 5
    }
  }
]; 