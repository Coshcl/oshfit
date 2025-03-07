import { ExerciseData, WeightUnit } from '../types';

/**
 * Normaliza un objeto ExerciseData para asegurar compatibilidad entre formatos antiguos y nuevos
 */
export function normalizeExerciseData(exercise: ExerciseData): ExerciseData {
  // Asegurar que todos los campos existan
  return {
    ...exercise,
    weightUnit: exercise.weightUnit || 'kg',
    sets: exercise.sets || 1,
    repsPerSet: exercise.repsPerSet || exercise.reps || 0,
    // Mantener el campo reps para compatibilidad
    reps: exercise.reps || (exercise.sets && exercise.repsPerSet 
      ? exercise.sets * exercise.repsPerSet 
      : 0)
  };
}

/**
 * Convierte un peso a kilogramos
 */
export function convertToKg(weight: number, unit: WeightUnit = 'kg'): number {
  return unit === 'lb' ? weight * 0.45359237 : weight;
}

/**
 * Calcula el volumen total (peso × sets × reps)
 */
export function calculateVolume(exercise: ExerciseData): number {
  const normalizedEx = normalizeExerciseData(exercise);
  
  // Calcular peso total
  let totalWeight = normalizedEx.weight;
  
  // Añadir peso de barra si corresponde
  if (normalizedEx.includeBarWeight && normalizedEx.barWeight) {
    totalWeight += normalizedEx.barWeight;
  }
  
  // Convertir a kg si es necesario
  if (normalizedEx.weightUnit === 'lb') {
    totalWeight = convertToKg(totalWeight, 'lb');
  }
  
  return totalWeight * normalizedEx.sets * normalizedEx.repsPerSet;
} 