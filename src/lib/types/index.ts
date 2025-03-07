export type UserType = 'Cosh' | 'Rosch' | 'Maquin' | 'Flosh';

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
  time?: string;
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
  unlocked: boolean;
  progress: number;
  requiredProgress: number;
  criteria: {
    type: string;
    condition?: string;
    value: any;
  };
}

export interface UserProfile {
  id: UserType;
  name: string;
  password?: string;
  logs: WorkoutLog[];
  achievements: Achievement[];
  oshfitScore: number;
  createdAt?: Date;
  updatedAt?: Date;
} 