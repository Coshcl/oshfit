'use client'

import { useState } from 'react'
import { WorkoutLog } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { normalizeWorkoutLog, normalizeExerciseData } from '@/lib/utils/dataUtils'

interface OshfitScoreProps {
  score: number
  logs: WorkoutLog[]
}

export function OshfitScore({ score, logs }: OshfitScoreProps) {
  const [showInfo, setShowInfo] = useState(false)

  // Preparar datos para el gráfico
  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short'
    }),
    score: calculateDailyScore(log)
  }))

  return (
    <div className="bg-white rounded-lg p-4 shadow relative">
      <button
        onClick={() => setShowInfo(true)}
        className="flex items-center space-x-2"
      >
        <h2 className="text-lg font-semibold mb-2">Oshfit Score</h2>
        <span className="text-gray-400 text-sm">ℹ️</span>
      </button>
      
      <div className="text-3xl font-bold text-blue-600 mb-4">
        {score.toFixed(1)}
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modal de información */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">¿Qué es el Oshfit Score?</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                El Oshfit Score es una medida de tu progreso general en el gimnasio,
                calculada usando varios factores:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Progresión de Peso (60%):</strong> El incremento en el peso
                  levantado comparado con tu sesión anterior.
                </li>
                <li>
                  <strong>Esfuerzo Percibido (25%):</strong> Tu evaluación subjetiva
                  del esfuerzo en cada ejercicio.
                </li>
                <li>
                  <strong>Volumen Total (15%):</strong> La combinación de peso y
                  repeticiones en todos tus ejercicios.
                </li>
              </ul>
              <p>
                Un score por encima de 80 indica un excelente progreso, mientras que
                uno por debajo de 50 sugiere que podrías aumentar la intensidad.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg
                       hover:bg-blue-700 transition-colors duration-200"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function calculateDailyScore(log: WorkoutLog): number {
  // Normalizar el log para asegurar compatibilidad
  const normalizedLog = normalizeWorkoutLog(log)
  
  const baseScore = normalizedLog.exercises.reduce((acc, exercise) => {
    // Usar ejercicio normalizado
    const normalized = normalizeExerciseData(exercise)
    
    // Calcular peso total (incluyendo barra si corresponde)
    let totalWeight = normalized.weight
    
    if (normalized.includeBarWeight && normalized.barWeight) {
      totalWeight += normalized.barWeight
    }
    
    // Convertir a kg si está en libras
    if (normalized.weightUnit === 'lb') {
      totalWeight = totalWeight * 0.45359237
    }
    
    // Calcular volumen
    const volume = totalWeight * normalized.sets * normalized.repsPerSet
    
    // Calcular componentes del score
    const weightScore = (totalWeight / 100) * 60
    const effortScore = (normalized.perceivedEffort / 10) * 25
    const volumeScore = (volume / 1000) * 15
    
    return acc + weightScore + effortScore + volumeScore
  }, 0) / normalizedLog.exercises.length

  // Redondear a un decimal
  return Math.round(baseScore * 10) / 10
} 