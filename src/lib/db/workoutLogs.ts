import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import { WorkoutLog, WeightUnit } from '@/lib/types';

export async function saveWorkoutLog(workoutData: {
  userId: string;
  date: Date;
  bodyWeight?: number;
  bodyWeightUnit?: WeightUnit;
  exercises: {
    exerciseName: string;
    emoji: string;
    weight: number;
    weightUnit: WeightUnit;
    sets: number;
    reps: number;
    perceivedEffort: number;
  }[];
  notes?: string;
  duration?: number;
  cardioAfter?: boolean;
  cardioMinutes?: number;
  type: string;
}) {
  const { db } = await connectToDatabase();
  
  // Formatear los datos para almacenar en la base de datos
  const exercisesObj: Record<string, any> = {};
  
  workoutData.exercises.forEach(exercise => {
    exercisesObj[exercise.exerciseName] = {
      weight: exercise.weight.toString(),
      weightUnit: exercise.weightUnit,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      effort: exercise.perceivedEffort.toString(),
    };
  });
  
  const now = new Date();
  
  const workoutLog = {
    userId: workoutData.userId,
    date: workoutData.date || now,
    bodyWeight: workoutData.bodyWeight,
    bodyWeightUnit: workoutData.bodyWeightUnit,
    exercises: exercisesObj,
    notes: workoutData.notes,
    duration: workoutData.duration,
    cardioAfter: workoutData.cardioAfter || false,
    cardioMinutes: workoutData.cardioMinutes,
    type: workoutData.type,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection('workoutLogs').insertOne(workoutLog);
  
  return {
    id: result.insertedId.toString(),
    ...workoutLog
  };
}

export async function getUserWorkoutLogs(userId: string) {
  const { db } = await connectToDatabase();
  
  const workoutLogs = await db
    .collection('workoutLogs')
    .find({ userId })
    .sort({ date: -1 })
    .toArray();
  
  return workoutLogs.map(log => ({
    ...log,
    id: log._id.toString()
  }));
}

export async function getWorkoutLogById(id: string) {
  const { db } = await connectToDatabase();
  
  try {
    const objectId = new ObjectId(id);
    const workoutLog = await db.collection('workoutLogs').findOne({ _id: objectId });
    
    if (!workoutLog) return null;
    
    return {
      ...workoutLog,
      id: workoutLog._id.toString()
    };
  } catch (error) {
    console.error('Error al convertir ID:', error);
    return null;
  }
}

export async function updateWorkoutLog(id: string, updateData: Partial<WorkoutLog>) {
  const { db } = await connectToDatabase();
  
  try {
    const objectId = new ObjectId(id);
    
    // Eliminar id si está presente en updateData
    if (updateData.id) {
      delete updateData.id;
    }
    
    // Actualizar timestamp
    updateData.updatedAt = new Date();
    
    const result = await db.collection('workoutLogs').updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return null;
    }
    
    // Obtener el documento actualizado
    const updatedLog = await db.collection('workoutLogs').findOne({ _id: objectId });
    
    return {
      ...updatedLog,
      id: updatedLog._id.toString()
    };
  } catch (error) {
    console.error('Error al actualizar log:', error);
    return null;
  }
}

export async function deleteWorkoutLog(id: string) {
  const { db } = await connectToDatabase();
  
  try {
    const objectId = new ObjectId(id);
    const result = await db.collection('workoutLogs').deleteOne({ _id: objectId });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error al eliminar log:', error);
    return false;
  }
}

// Función para limpiar todos los registros de entrenamiento (solo para desarrollo/pruebas)
export async function clearAllWorkoutLogs() {
  const { db } = await connectToDatabase();
  
  try {
    await db.collection('workoutLogs').deleteMany({});
    return true;
  } catch (error) {
    console.error('Error al limpiar logs:', error);
    return false;
  }
} 