'use client'

import { useState, useEffect } from 'react'
import { WorkoutLog } from '@/lib/types'
import { WorkoutLogCard } from '@/components/WorkoutLogCard'
import { useUser } from '@/lib/contexts/UserContext'
import { DateRangePicker } from '@/components/DateRangePicker'

export default function WorkoutLogsPage({ params }: { params: { userId: string } }) {
  const { user } = useUser()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  const userId = params.userId
  
  // Cargar logs de entrenamiento
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)
        // Construir la URL con parámetros de fecha si están presentes
        let url = `/api/workouts/${userId}`
        const params = new URLSearchParams()
        
        if (startDate) {
          params.append('startDate', startDate.toISOString())
        }
        
        if (endDate) {
          params.append('endDate', endDate.toISOString())
        }
        
        const queryString = params.toString()
        if (queryString) {
          url += `?${queryString}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.logs) {
          // Convertir fechas string a objetos Date
          const formattedLogs = data.logs.map((log: any) => ({
            ...log,
            date: new Date(log.date),
            createdAt: new Date(log.createdAt),
            updatedAt: new Date(log.updatedAt)
          }))
          
          // Ordenar por fecha, más reciente primero
          formattedLogs.sort((a: WorkoutLog, b: WorkoutLog) => 
            b.date.getTime() - a.date.getTime()
          )
          
          setLogs(formattedLogs)
        }
      } catch (error) {
        console.error('Error fetching workout logs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLogs()
  }, [userId, startDate, endDate])
  
  // Manejar actualización de log
  const handleUpdateLog = async (updatedLog: WorkoutLog) => {
    try {
      if (!updatedLog.id) return
      
      const response = await fetch(`/api/workouts/${userId}/${updatedLog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLog)
      })
      
      if (response.ok) {
        // Actualizar logs localmente
        setLogs(logs.map(log => 
          log.id === updatedLog.id ? updatedLog : log
        ))
      }
    } catch (error) {
      console.error('Error updating workout log:', error)
    }
  }
  
  // Manejar eliminación de log
  const handleDeleteLog = async (logId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/workouts/${userId}/${logId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Eliminar log localmente
        setLogs(logs.filter(log => log.id !== logId))
      }
    } catch (error) {
      console.error('Error deleting workout log:', error)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis entrenamientos</h1>
      
      {/* Filtro de fechas */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-3">Filtrar por fechas</h2>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      
      {/* Lista de logs */}
      {isLoading ? (
        <div className="text-center py-10">Cargando entrenamientos...</div>
      ) : logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map(log => (
            <WorkoutLogCard
              key={log.id}
              log={log}
              onUpdate={handleUpdateLog}
              onDelete={handleDeleteLog}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-600">No hay entrenamientos registrados.</p>
          <p className="mt-2">
            <a href={`/dashboard/${userId}/new`} className="text-blue-600 hover:underline">
              ¡Registra tu primer entrenamiento!
            </a>
          </p>
        </div>
      )}
    </div>
  )
} 