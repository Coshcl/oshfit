'use client'

import { useState } from 'react'
import { WorkoutLog, Exercise } from '@/lib/types'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

interface OshfitScoreProps {
  score: number
  logs: WorkoutLog[]
}

export function OshfitScore({ score, logs }: OshfitScoreProps) {
  const [showInfo, setShowInfo] = useState(false);
  
  // Preparar datos para la gráfica
  const chartData = logs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10) // Mostrar solo los últimos 10 registros
    .map(log => ({
      date: formatDate(log.date),
      score: calculateScore(log)
    }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Oshfit Score
          </button>
        </h2>
        <div className="text-3xl font-bold text-blue-600">{score.toFixed(1)}</div>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm relative">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
          >
            ✕
          </button>
          <h3 className="font-bold mb-1">¿Qué es el Oshfit Score?</h3>
          <p>
            El Oshfit Score es una métrica que cuantifica tu progreso en el gimnasio combinando:
          </p>
          <ul className="list-disc pl-5 mt-1">
            <li><span className="font-medium">Peso (60%)</span>: El peso que levantas</li>
            <li><span className="font-medium">Esfuerzo (25%)</span>: Tu percepción del esfuerzo</li>
            <li><span className="font-medium">Volumen (15%)</span>: Combinación de peso y repeticiones</li>
          </ul>
          <p className="mt-1">
            Un mayor puntaje indica mejores entrenamientos y progresión continua.
          </p>
        </div>
      )}
      
      <div className="h-40 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickMargin={5}
            />
            <YAxis hide />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(1), 'Score']}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Función para formatear fechas
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

// Función simplificada para calcular puntaje
function calculateScore(log: WorkoutLog): number {
  // Si no hay ejercicios, devolver 0
  if (!log.exercises || log.exercises.length === 0) {
    return 0;
  }
  
  // Calcular puntaje para cada ejercicio y promediar
  return log.exercises.reduce((acc, exercise: Exercise) => {
    // Ahora el peso tiene más importancia (60%), 
    // y el esfuerzo percibido tiene menos (25%)
    const weightScore = (exercise.weight / 100) * 60 // 60% del peso (antes 25%)
    const effortScore = (exercise.effort / 10) * 25 // 25% del peso (antes 60%)
    const volumeScore = ((exercise.weight * exercise.reps) / 1000) * 15 // 15% del peso (sin cambios)
    return acc + weightScore + effortScore + volumeScore
  }, 0) / log.exercises.length;
} 