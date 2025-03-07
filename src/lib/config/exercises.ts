import { Exercise, WorkoutType } from '../types';

export const exercises: Record<WorkoutType, Exercise[]> = {
  Push: [
    {
      name: 'Bench Press',
      emoji: '🏋️',
      alternative: {
        name: 'Dumbbell Bench Press',
        emoji: '💪'
      },
      muscleGroup: 'Chest'
    },
    {
      name: 'Shoulder Press',
      emoji: '🏋️‍♂️',
      alternative: {
        name: 'Dumbbell Shoulder Press',
        emoji: '💪'
      },
      muscleGroup: 'Shoulders'
    },
    {
      name: 'Butterfly',
      emoji: '🦋',
      alternative: {
        name: 'Peck Deck',
        emoji: '🔄'
      },
      muscleGroup: 'Chest'
    },
    {
      name: 'Tricep Extensions',
      emoji: '💪',
      alternative: {
        name: 'French Press',
        emoji: '🏋️‍♂️'
      },
      muscleGroup: 'Triceps'
    },
    {
      name: 'Lateral Raises',
      emoji: '🏋️‍♀️',
      alternative: {
        name: 'Cable Lateral Raises',
        emoji: '🔄'
      },
      muscleGroup: 'Shoulders'
    }
  ],
  Pull: [
    {
      name: 'Deadlift',
      emoji: '🏋️‍♂️',
      alternative: {
        name: 'Sumo Deadlift',
        emoji: '🏋️'
      },
      muscleGroup: 'Back'
    },
    {
      name: 'Pull-ups',
      emoji: '🔝',
      alternative: {
        name: 'Lat Pulldown',
        emoji: '⬇️'
      },
      muscleGroup: 'Back'
    },
    {
      name: 'Cable Row',
      emoji: '🚣‍♂️',
      alternative: {
        name: 'Machine Row',
        emoji: '🔄'
      },
      muscleGroup: 'Back'
    },
    {
      name: 'Bicep Curl',
      emoji: '💪',
      alternative: {
        name: 'Dumbbell Curl',
        emoji: '🏋️‍♂️'
      },
      muscleGroup: 'Biceps'
    },
    {
      name: 'Hammer Curl',
      emoji: '🔨',
      alternative: {
        name: 'Cable Hammer Curl',
        emoji: '🔄'
      },
      muscleGroup: 'Biceps'
    }
  ],
  Legs: [
    {
      name: 'Squats',
      emoji: '🏋️‍♂️',
      alternative: {
        name: 'Front Squats',
        emoji: '🏋️'
      },
      muscleGroup: 'Quadriceps'
    },
    {
      name: 'Bulgarian Split Squats',
      emoji: '🇧🇬',
      alternative: {
        name: 'Lunges',
        emoji: '🚶‍♂️'
      },
      muscleGroup: 'Quadriceps'
    },
    {
      name: 'Leg Press',
      emoji: '🦵',
      alternative: {
        name: 'Hack Squat',
        emoji: '🏋️‍♂️'
      },
      muscleGroup: 'Quadriceps'
    },
    {
      name: 'Leg Extension',
      emoji: '🦿',
      alternative: {
        name: 'Sissy Squats',
        emoji: '🏋️‍♀️'
      },
      muscleGroup: 'Quadriceps'
    },
    {
      name: 'Leg Curl',
      emoji: '🦵',
      alternative: {
        name: 'Nordic Curl',
        emoji: '🧎‍♂️'
      },
      muscleGroup: 'Hamstrings'
    }
  ]
}; 