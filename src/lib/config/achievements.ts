import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_log',
    name: 'First Steps',
    description: 'Completed your first workout log',
    emoji: '🎯',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'first_push',
    name: 'Push Master',
    description: 'Completed your first Push workout',
    emoji: '💪',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'first_pull',
    name: 'Pull Expert',
    description: 'Completed your first Pull workout',
    emoji: '🏋️‍♂️',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'first_legs',
    name: 'Leg Day Champion',
    description: 'Completed your first Legs workout',
    emoji: '🦵',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'perfect_log',
    name: 'Perfectionist',
    description: 'Completed a perfect log with no errors',
    emoji: '✨',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'seven_days',
    name: 'Week Warrior',
    description: '7 consecutive days of logging',
    emoji: '📅',
    isUnlocked: false,
    progress: 0,
    requiredCount: 7,
    currentCount: 0
  },
  {
    id: 'weight_increase',
    name: 'Getting Stronger',
    description: '5% weight increase in any exercise',
    emoji: '📈',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'max_effort',
    name: 'All Out',
    description: 'Recorded a perceived effort of 10',
    emoji: '🔥',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'score_improvement',
    name: 'Score Chaser',
    description: 'Beat your previous Oshfit Score',
    emoji: '🏆',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    description: '30 days of consecutive logging',
    emoji: '👑',
    isUnlocked: false,
    progress: 0,
    requiredCount: 30,
    currentCount: 0
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a workout before 8:00 AM',
    emoji: '🌅',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a workout after 8:00 PM',
    emoji: '🌙',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'cardio_enthusiast',
    name: 'Cardio Enthusiast',
    description: 'Add cardio after your workout 5 times',
    emoji: '🏃',
    isUnlocked: false,
    progress: 0,
    requiredCount: 5,
    currentCount: 0
  },
  {
    id: 'endurance_master',
    name: 'Endurance Master',
    description: 'Complete a workout lasting more than 90 minutes',
    emoji: '⏱️',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Complete a high-intensity workout in less than 45 minutes',
    emoji: '⚡',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'balanced_athlete',
    name: 'Balanced Athlete',
    description: 'Complete all three workout types (Push, Pull, Legs) in a single week',
    emoji: '⚖️',
    isUnlocked: false,
    progress: 0,
    requiredCount: 3,
    currentCount: 0
  },
  {
    id: 'heavy_lifter',
    name: 'Heavy Lifter',
    description: 'Lift more than 100kg/220lb in any exercise',
    emoji: '🏋️',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'volume_king',
    name: 'Volume King',
    description: 'Complete a workout with more than 100 total reps',
    emoji: '📊',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete workouts on 4 consecutive weekends',
    emoji: '🗓️',
    isUnlocked: false,
    progress: 0,
    requiredCount: 4,
    currentCount: 0
  },
  {
    id: 'note_taker',
    name: 'Note Taker',
    description: 'Add detailed notes to 10 different workouts',
    emoji: '📝',
    isUnlocked: false,
    progress: 0,
    requiredCount: 10,
    currentCount: 0
  }
]; 