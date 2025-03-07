export type UserType = 'Rosch' | 'Cosh' | 'Maquin' | 'Flosh' | 'Custom';

export type WorkoutType = 'Push' | 'Pull' | 'Legs';

export interface Exercise {
  name: string;
  emoji: string;
  alternative: {
    name: string;
    emoji: string;
  };
  muscleGroup: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: WorkoutType;
  bodyWeight?: number;
  exercises: {
    exerciseName: string;
    emoji: string;
    weight: number;
    reps: number;
    perceivedEffort: number;
    notes?: string;
  }[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserProfile {
  id: UserType;
  name: string;
  logs: WorkoutLog[];
  achievements: Achievement[];
  oshfitScore: number;
} 