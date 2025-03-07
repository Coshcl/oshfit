export function calculateOshfitScore(
  currentWorkout: Exercise[], 
  previousWorkout: Exercise[] | null
): number {
  // Si no hay entrenamiento anterior, el score se basa solo en el esfuerzo actual
  if (!previousWorkout || previousWorkout.length === 0) {
    const avgEffort = currentWorkout.reduce((sum, ex) => sum + ex.effort, 0) / currentWorkout.length;
    return Math.round(avgEffort * 10) / 10; // Redondear a 1 decimal
  }

  let totalScore = 0;
  
  // Para cada ejercicio en el entrenamiento actual
  currentWorkout.forEach(currentEx => {
    // Buscar el mismo ejercicio en el entrenamiento anterior
    const previousEx = previousWorkout.find(ex => ex.id === currentEx.id);
    
    if (!previousEx) {
      // Si es un ejercicio nuevo, considerar solo el esfuerzo
      totalScore += currentEx.effort;
      return;
    }
    
    // Calcular cambio en peso (convertir a misma unidad si es necesario)
    let currentWeight = currentEx.weight;
    let previousWeight = previousEx.weight;
    
    // Convertir libras a kg si es necesario
    if (currentEx.weightUnit === 'lb' && previousEx.weightUnit === 'kg') {
      currentWeight = currentWeight / 2.20462;
    } else if (currentEx.weightUnit === 'kg' && previousEx.weightUnit === 'lb') {
      previousWeight = previousWeight / 2.20462;
    }
    
    // Añadir peso de la barra si existe
    if (currentEx.barWeight) currentWeight += currentEx.barWeight;
    if (previousEx.barWeight) previousWeight += previousEx.barWeight;
    
    // Calcular cambio porcentual en peso
    const weightChange = previousWeight > 0 
      ? (currentWeight - previousWeight) / previousWeight 
      : 0;
    
    // Calcular cambio en volumen (sets * reps)
    const currentVolume = currentEx.sets * currentEx.reps;
    const previousVolume = previousEx.sets * previousEx.reps;
    const volumeChange = previousVolume > 0 
      ? (currentVolume - previousVolume) / previousVolume 
      : 0;
    
    // Nueva fórmula: El peso tiene más importancia que el esfuerzo
    // 50% peso, 30% volumen, 20% esfuerzo
    const exerciseScore = (
      (weightChange * 0.5) + 
      (volumeChange * 0.3) + 
      (currentEx.effort / 10 * 0.2)
    ) * 10;
    
    totalScore += exerciseScore > 0 ? exerciseScore : 0;
  });
  
  // Obtener promedio y redondear a 1 decimal
  const avgScore = totalScore / currentWorkout.length;
  return Math.round(avgScore * 10) / 10;
} 