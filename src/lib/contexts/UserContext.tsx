'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile, WorkoutLog } from '../types'
import { achievements } from '../config/achievements'

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  addWorkoutLog: (log: WorkoutLog) => Promise<void>
  updateWorkoutLog: (logId: string, log: WorkoutLog) => Promise<void>
  deleteWorkoutLog: (logId: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Lista de usuarios predefinidos para tener datos iniciales
const predefinedUsers: Record<string, UserProfile> = {
  cosh: { id: 'Cosh', name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  rosch: { id: 'Rosch', name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  maquin: { id: 'Maquin', name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  flosh: { id: 'Flosh', name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  // Función para guardar en MongoDB (cuando sea posible)
  const saveToMongoDB = async (endpoint: string, method: string, data: any) => {
    try {
      await fetch(`/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return true
    } catch (error) {
      console.error(`Error en operación de MongoDB (${endpoint}):`, error)
      return false // Continuar con datos en memoria si falla MongoDB
    }
  }

  const addWorkoutLog = async (log: WorkoutLog) => {
    if (!user) return

    // Intentar guardar en MongoDB, pero continuar aunque falle
    await saveToMongoDB('workouts', 'POST', { userId: user.id, workout: log })

    // Actualizar estado local siempre
    const updatedUser = {
      ...user,
      logs: [...user.logs, log]
    }
    setUser(updatedUser)
  }

  const updateWorkoutLog = async (logId: string, updatedLog: WorkoutLog) => {
    if (!user) return

    // Intentar actualizar en MongoDB, pero continuar aunque falle
    await saveToMongoDB('workouts', 'PUT', { workoutId: logId, workout: updatedLog })

    // Actualizar estado local siempre
    const updatedLogs = user.logs.map(log => 
      log.id === logId ? updatedLog : log
    )
    
    setUser({
      ...user,
      logs: updatedLogs
    })
  }

  const deleteWorkoutLog = async (logId: string) => {
    if (!user) return

    // Intentar eliminar en MongoDB, pero continuar aunque falle
    try {
      await fetch(`/api/workouts?workoutId=${logId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error eliminando entrenamiento:', error)
    }

    // Actualizar estado local siempre
    const updatedLogs = user.logs.filter(log => log.id !== logId)
    setUser({
      ...user,
      logs: updatedLogs
    })
  }

  // Inicializar usuario desde predefinidos si está en la URL
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const path = window.location.pathname
      const match = path.match(/\/dashboard\/([^\/]+)/)
      if (match) {
        const username = match[1].toLowerCase()
        if (predefinedUsers[username]) {
          console.log(`Inicializando usuario predefinido: ${username}`)
          setUser(predefinedUsers[username])
        }
      }
    }
  }, [user])

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      addWorkoutLog,
      updateWorkoutLog,
      deleteWorkoutLog
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 