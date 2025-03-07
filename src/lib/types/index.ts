export type UserType = 'Rosch' | 'Cosh' | 'Maquin' | 'Flosh' | 'Custom';

export type WorkoutType = 'Push' | 'Pull' | 'Legs';

export type WeightUnit = 'kg' | 'lb';

export interface Exercise {
  name: string;
  emoji: string;
  alternative: {
    name: string;
    emoji: string;
  };
  muscleGroup: string;
}

export interface ExerciseData {
  exerciseName: string;
  emoji: string;
  weight: number;
  weightUnit?: WeightUnit;
  sets?: number;
  repsPerSet?: number;
  reps?: number;
  barWeight?: number;
  includeBarWeight?: boolean;
  perceivedEffort: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  startTime?: string;
  duration?: number;
  type: WorkoutType;
  bodyWeight?: number;
  bodyWeightUnit?: WeightUnit;
  exercises: ExerciseData[];
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progressTrackable?: boolean;
}

export interface UserProfile {
  id: UserType;
  name: string;
  logs: WorkoutLog[];
  achievements: Achievement[];
  oshfitScore: number;
} 