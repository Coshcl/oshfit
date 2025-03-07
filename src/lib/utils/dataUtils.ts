import { ExerciseData, WorkoutLog, WeightUnit } from '../types';

/**
 * Normaliza un objeto ExerciseData para garantizar que todos los campos necesarios estén presentes,
 * independientemente del formato de datos (antiguo o nuevo)
 */
export function normalizeExerciseData(exercise: ExerciseData): ExerciseData {
  // Si el ejercicio es undefined o null, devolver un objeto con valores por defecto
  if (!exercise) {
    return {
      exerciseName: 'Unknown',
      emoji: '❓',
      weight: 0,
      weightUnit: 'kg',
      sets: 1,
      repsPerSet: 0,
      reps: 0,
      perceivedEffort: 0
    };
  }

  // Establecer valores por defecto para campos opcionales
  const weightUnit = exercise.weightUnit || 'kg';
  const sets = typeof exercise.sets === 'number' ? exercise.sets : 1;
  const repsPerSet = typeof exercise.repsPerSet === 'number' ? exercise.repsPerSet : 0;

  // Calcular reps basado en sets y repsPerSet, o usar reps existente
  let reps = typeof exercise.reps === 'number' ? exercise.reps : 0;
  
  // Si no hay reps pero tenemos sets y repsPerSet, calcular reps
  if (reps === 0 && sets > 0 && repsPerSet > 0) {
    reps = sets * repsPerSet;
  }
  
  // Si hay reps pero no sets o repsPerSet, calcular valores predeterminados
  if (reps > 0 && (sets === 0 || repsPerSet === 0)) {
    if (sets === 0) sets = 1;
    if (repsPerSet === 0) repsPerSet = reps;
  }

  // Retornar objeto normalizado
  return {
    ...exercise,
    weightUnit,
    sets,
    repsPerSet,
    reps,
    barWeight: typeof exercise.barWeight === 'number' ? exercise.barWeight : 0,
    includeBarWeight: Boolean(exercise.includeBarWeight),
    perceivedEffort: typeof exercise.perceivedEffort === 'number' ? exercise.perceivedEffort : 0
  };
}

/**
 * Normaliza un objeto WorkoutLog para garantizar que todos los campos necesarios estén presentes
 */
export function normalizeWorkoutLog(log: WorkoutLog): WorkoutLog {
  if (!log) {
    throw new Error('Cannot normalize undefined workout log');
  }

  // Normalizar cada ejercicio en el log
  const normalizedExercises = (log.exercises || []).map(normalizeExerciseData);

  return {
    ...log,
    exercises: normalizedExercises,
    bodyWeightUnit: log.bodyWeightUnit || 'kg',
    date: log.date || new Date().toISOString(),
    startTime: log.startTime || log.date || new Date().toISOString(),
    duration: typeof log.duration === 'number' ? log.duration : 0
  };
}

/**
 * Convierte un peso a kilogramos para comparaciones consistentes
 */
export function convertToKg(weight: number, unit: WeightUnit = 'kg'): number {
  if (typeof weight !== 'number') return 0;
  return unit === 'lb' ? weight * 0.45359237 : weight;
}

/**
 * Calcula el volumen total de un ejercicio (peso × sets × reps)
 */
export function calculateVolume(exercise: ExerciseData): number {
  const normalized = normalizeExerciseData(exercise);
  
  // Calcular peso total incluyendo barra si corresponde
  let totalWeight = normalized.weight;
  if (normalized.includeBarWeight && normalized.barWeight) {
    totalWeight += normalized.barWeight;
  }
  
  // Convertir a kg si es necesario
  const weightInKg = normalized.weightUnit === 'lb' 
    ? convertToKg(totalWeight, 'lb') 
    : totalWeight;
  
  // Calcular volumen total
  return weightInKg * normalized.sets * normalized.repsPerSet;
}

/**
 * Obtiene el valor total de repeticiones (sets × repsPerSet o reps)
 */
export function getTotalReps(exercise: ExerciseData): number {
  const normalized = normalizeExerciseData(exercise);
  return normalized.sets * normalized.repsPerSet;
} 