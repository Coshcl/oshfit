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

export interface ExerciseLog {
  exerciseName: string;
  emoji: string;
  weight: number;
  weightUnit: WeightUnit;
  barWeight?: number; // Peso adicional de la barra
  sets: number;
  reps: number;
  perceivedEffort: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string
  type: WorkoutType;
  bodyWeight?: number;
  bodyWeightUnit?: WeightUnit;
  exercises: ExerciseLog[];
  notes?: string; // Notas generales para todo el entrenamiento
  duration?: number; // Duración en minutos
  cardioAfter?: boolean; // Si se hizo cardio después
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: number; // Progreso de 0 a 1 (0% a 100%)
  requiredCount?: number; // Para logros que requieren acumular algo
  currentCount?: number; // Contador actual
}

export interface UserProfile {
  id: UserType;
  name: string;
  logs: WorkoutLog[];
  achievements: Achievement[];
  oshfitScore: number;
  preferredWeightUnit?: WeightUnit;
} 