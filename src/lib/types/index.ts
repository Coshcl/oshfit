export type UserType = 'Rosch' | 'Cosh' | 'Maquin' | 'Flosh' | 'Custom';

export type WorkoutType = 'Push' | 'Pull' | 'Legs';

export interface Exercise {
  id: string;
  name: string;
  type: 'Push' | 'Pull' | 'Legs';
  emoji: string;
  alternative: {
    id: string;
    name: string;
    emoji: string;
  };
  weight: number;
  weightUnit: 'kg' | 'lb';
  barWeight?: number;
  sets: number;
  reps: number;
  effort: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  time: string;
  type: 'Push' | 'Pull' | 'Legs';
  bodyWeight?: number;
  bodyWeightUnit?: 'kg' | 'lb';
  exercises: Exercise[];
  notes?: string;
  duration?: number;
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