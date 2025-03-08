export interface Exercise {
  name: string;
  category: string;
  emoji: string;
  description?: string;
  alternativeExercise?: string;
  alternative?: {
    name: string;
    emoji: string;
  };
}

export interface ExerciseData {
  weight: string;
  weightUnit: WeightUnit;
  sets: string;
  reps: string;
  effort: string;
  useAlternative: boolean;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  date: Date;
  duration: number;
  exercises: {
    [key: string]: ExerciseData;
  };
  notes?: string;
  cardioMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'other';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  progress?: number;
  currentCount?: number;
  requiredCount?: number;
  category: string;
}

export type WeightUnit = 'kg' | 'lbs';

export interface UserPreferences {
  preferredWeightUnit: WeightUnit;
  theme?: 'light' | 'dark';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  preferences: UserPreferences;
  achievements?: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para IDs de usuario predefinidos
export type UserType = 'Cosh' | 'Rosch' | 'Maquin' | 'Flosh'; 