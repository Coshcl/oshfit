'use client'

import { useState } from 'react'
import { useUser } from '@/lib/contexts/UserContext'
import { WorkoutType } from '@/lib/types'
import { WorkoutLogCard } from '@/components/WorkoutLogCard'
import { WorkoutLogDetails } from '@/components/WorkoutLogDetails'

export default function LogsPage() {
  const { user } = useUser()
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<WorkoutType | 'all'>('all')

  if (!user) return null

  const sortedLogs = [...user.logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const filteredLogs = filterType === 'all' 
    ? sortedLogs 
    : sortedLogs.filter(log => log.type === filterType)

  const selectedLog = user.logs.find(log => log.id === selectedLogId)

  const workoutTypes: { type: WorkoutType | 'all'; label: string; icon: string }[] = [
    { type: 'all', label: 'Todos', icon: '📋' },
    { type: 'Push', label: 'Push', icon: '💪' },
    { type: 'Pull', label: 'Pull', icon: '🏋️' },
    { type: 'Legs', label: 'Legs', icon: '🦵' },
  ]

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Historial de Entrenamientos</h1>

      {/* Filtros */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {workoutTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full flex items-center space-x-2 whitespace-nowrap
              ${filterType === type 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Lista de entrenamientos */}
      <div className="space-y-4">
        {filteredLogs.map(log => (
          <WorkoutLogCard
            key={log.id}
            log={log}
            onClick={() => setSelectedLogId(log.id)}
          />
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedLog && (
        <WorkoutLogDetails
          log={selectedLog}
          onClose={() => setSelectedLogId(null)}
        />
      )}
    </div>
  )
} 