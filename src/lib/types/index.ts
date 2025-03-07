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
  weightUnit: WeightUnit;
  sets: number;
  repsPerSet: number;
  barWeight?: number;
  includeBarWeight?: boolean;
  perceivedEffort: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  startTime?: string; // ISO string for the start time
  duration?: number; // in minutes
  type: WorkoutType;
  bodyWeight?: number;
  bodyWeightUnit?: WeightUnit;
  exercises: ExerciseData[];
  notes?: string; // General notes for the entire workout
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progressTrackable?: boolean; // Indicates if we can track progress for this achievement
}

export interface UserProfile {
  id: UserType;
  name: string;
  logs: WorkoutLog[];
  achievements: Achievement[];
  oshfitScore: number;
} 