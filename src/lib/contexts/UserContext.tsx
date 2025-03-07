'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile, WorkoutLog, UserType } from '../types'
import { achievements } from '../config/achievements'

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  addWorkoutLog: (log: WorkoutLog) => Promise<void>
  updateWorkoutLog: (logId: string, log: WorkoutLog) => Promise<void>
  deleteWorkoutLog: (logId: string) => Promise<void>
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Lista de usuarios predefinidos para fallback si la BD falla
const predefinedUsers: Record<string, UserProfile> = {
  'cosh': { id: 'Cosh' as UserType, name: 'cosh', logs: [], achievements, oshfitScore: 0 },
  'rosch': { id: 'Rosch' as UserType, name: 'rosch', logs: [], achievements, oshfitScore: 0 },
  'maquin': { id: 'Maquin' as UserType, name: 'maquin', logs: [], achievements, oshfitScore: 0 },
  'flosh': { id: 'Flosh' as UserType, name: 'flosh', logs: [], achievements, oshfitScore: 0 },
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [syncError, setSyncError] = useState<Error | null>(null)

  // Cargar usuario desde MongoDB o usar predefinido como fallback
  useEffect(() => {
    const loadUser = async () => {
      if (!user && typeof window !== 'undefined') {
        const path = window.location.pathname
        const match = path.match(/\/dashboard\/([^\/]+)/)
        
        if (match) {
          const username = match[1].toLowerCase()
          setIsLoading(true)
          setSyncError(null)
          
          // Asegurarse de que sea un usuario válido
          if (!(username in predefinedUsers)) {
            console.error(`Usuario no válido: ${username}`)
            setIsLoading(false)
            return
          }
          
          try {
            // Intentar cargar desde MongoDB
            console.log(`Intentando cargar usuario desde MongoDB: ${username}`)
            const response = await fetch(`/api/users?username=${username}`)
            
            if (response.ok) {
              const userData: UserProfile = await response.json()
              console.log(`Usuario cargado desde MongoDB: ${username}`, userData)
              setUser(userData)
            } else {
              // Si falla, inicializar con datos predefinidos
              console.log(`Inicializando con datos predefinidos para: ${username}`)
              setUser(predefinedUsers[username])
              
              // Intentar crear el usuario en la base de datos
              try {
                await fetch('/api/users/initialize')
              } catch (initError) {
                console.error(`Error inicializando usuario en MongoDB: ${username}`, initError)
              }
            }
          } catch (error) {
            console.error(`Error cargando usuario: ${username}`, error)
            setSyncError(error as Error)
            // Fallback a predefinido
            setUser(predefinedUsers[username])
          } finally {
            setIsLoading(false)
          }
        } else {
          setIsLoading(false)
        }
      }
    }

    loadUser()
  }, [user])

  // Función para guardar en MongoDB con reintentos
  const saveToMongoDB = async (endpoint: string, method: string, data: any, retries = 2): Promise<boolean> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        
        if (response.ok) {
          return true
        }
        
        console.warn(`Intento ${attempt + 1}/${retries + 1} fallido para ${endpoint}`)
      } catch (error) {
        console.error(`Error en intento ${attempt + 1}/${retries + 1} para ${endpoint}:`, error)
        if (attempt === retries) {
          return false
        }
        
        // Esperar antes de reintentar (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
    
    return false
  }

  const addWorkoutLog = async (log: WorkoutLog) => {
    if (!user) return

    // Actualizar estado local inmediatamente para UI responsiva
    const updatedUser = {
      ...user,
      logs: [...user.logs, log]
    }
    setUser(updatedUser)

    // Intentar guardar en MongoDB en segundo plano
    const success = await saveToMongoDB('workouts', 'POST', { 
      userId: user.id, 
      workout: log 
    })
    
    if (!success) {
      console.warn('Guardado offline: Los datos se sincronizan localmente pero no en la base de datos')
    }
  }

  const updateWorkoutLog = async (logId: string, updatedLog: WorkoutLog) => {
    if (!user) return

    // Actualizar estado local inmediatamente
    const updatedLogs = user.logs.map(log => 
      log.id === logId ? updatedLog : log
    )
    
    setUser({
      ...user,
      logs: updatedLogs
    })

    // Intentar guardar en MongoDB en segundo plano
    await saveToMongoDB('workouts', 'PUT', { 
      workoutId: logId, 
      workout: updatedLog,
      userId: user.id // Añadir userId para facilitar la actualización en MongoDB
    })
  }

  const deleteWorkoutLog = async (logId: string) => {
    if (!user) return

    // Actualizar estado local inmediatamente
    const updatedLogs = user.logs.filter(log => log.id !== logId)
    setUser({
      ...user,
      logs: updatedLogs
    })

    // Intentar eliminar en MongoDB en segundo plano
    const queryParams = new URLSearchParams({ 
      workoutId: logId,
      userId: user.id // Añadir userId para facilitar la eliminación en MongoDB
    }).toString()
    
    try {
      await fetch(`/api/workouts?${queryParams}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error eliminando entrenamiento:', error)
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      addWorkoutLog,
      updateWorkoutLog,
      deleteWorkoutLog,
      isLoading
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