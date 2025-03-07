'use client'

import { useUser } from '@/lib/contexts/UserContext'
import { useState, useMemo } from 'react'
import { WorkoutLog, WorkoutType } from '@/lib/types'
import { WorkoutLogCard } from '@/components/WorkoutLogCard'
import { WorkoutLogDetails } from '@/components/WorkoutLogDetails'

export default function LogsPage() {
  const { user, deleteWorkoutLog } = useUser()
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [filter, setFilter] = useState<WorkoutType | 'all'>('all')

  // Logs filtrados por tipo
  const filteredLogs = useMemo(() => {
    if (!user) return []
    
    return user.logs
      .filter(log => filter === 'all' || log.type === filter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [user, filter])

  const handleDeleteLog = async (logId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
      await deleteWorkoutLog(logId)
      setSelectedLogId(null)
    }
  }

  // Encontrar el log seleccionado
  const selectedLog = selectedLogId 
    ? user?.logs.find(log => log.id === selectedLogId) 
    : null

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Entrenamientos</h1>
      
      {/* Filtros */}
      <div className="flex mb-6 bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('Push')}
          className={`flex-1 py-2 ${
            filter === 'Push' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Push
        </button>
        <button
          onClick={() => setFilter('Pull')}
          className={`flex-1 py-2 ${
            filter === 'Pull' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Pull
        </button>
        <button
          onClick={() => setFilter('Legs')}
          className={`flex-1 py-2 ${
            filter === 'Legs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Legs
        </button>
      </div>
      
      {/* Lista de logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No hay entrenamientos que mostrar</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <WorkoutLogCard
              key={log.id}
              log={log}
              previousLog={index < filteredLogs.length - 1 ? filteredLogs[index + 1] : undefined}
              onDelete={handleDeleteLog}
            />
          ))
        )}
      </div>
      
      {/* Modal de detalles (si es necesario) */}
      {selectedLog && (
        <WorkoutLogDetails
          log={selectedLog}
          onClose={() => setSelectedLogId(null)}
          onDelete={handleDeleteLog}
        />
      )}
    </div>
  )
} 