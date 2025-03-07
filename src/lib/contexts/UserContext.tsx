'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile, WorkoutLog, UserType, Achievement } from '../types'
import { achievements } from '../config/achievements'
import { checkAchievements } from '../utils/achievementUtils'

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  addWorkoutLog: (log: WorkoutLog) => Promise<Achievement[]>
  updateWorkoutLog: (logId: string, log: WorkoutLog) => Promise<void>
  deleteWorkoutLog: (logId: string) => Promise<void>
  isLoading: boolean
  showAchievementNotification: (achievements: Achievement[]) => void
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
  const [achievementNotification, setAchievementNotification] = useState<Achievement[]>([])

  // Mostrar notificación de logros
  const showAchievementNotification = (newAchievements: Achievement[]) => {
    setAchievementNotification(newAchievements)
    
    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
      setAchievementNotification([])
    }, 5000)
  }

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
              
              // Verificar si hay logros pendientes de desbloquear
              const { updatedUser, newlyUnlocked } = checkAchievements(userData)
              if (newlyUnlocked.length > 0) {
                console.log('Logros desbloqueados al cargar:', newlyUnlocked)
                
                // Actualizar usuario en BD con logros nuevos
                try {
                  await fetch(`/api/users/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      userId: updatedUser.id,
                      achievements: updatedUser.achievements
                    })
                  })
                } catch (error) {
                  console.error('Error actualizando logros:', error)
                }
                
                // Mostrar notificación
                showAchievementNotification(newlyUnlocked)
              }
              
              setUser(updatedUser)
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

  const addWorkoutLog = async (log: WorkoutLog): Promise<Achievement[]> => {
    if (!user) return []

    // Actualizar estado local inmediatamente para UI responsiva
    const updatedUser = {
      ...user,
      logs: [...user.logs, log]
    }
    
    // Verificar logros desbloqueados
    const { updatedUser: userWithAchievements, newlyUnlocked } = checkAchievements(updatedUser, log)
    
    // Actualizar estado con logros nuevos
    setUser(userWithAchievements)

    // Intentar guardar en MongoDB en segundo plano
    const success = await saveToMongoDB('workouts', 'POST', { 
      userId: user.id, 
      workout: log 
    })
    
    // Si hay logros nuevos, actualizar en BD
    if (newlyUnlocked.length > 0) {
      try {
        await fetch(`/api/users/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id,
            achievements: userWithAchievements.achievements
          })
        })
        
        // Mostrar notificación
        showAchievementNotification(newlyUnlocked)
      } catch (error) {
        console.error('Error actualizando logros:', error)
      }
    }
    
    if (!success) {
      console.warn('Guardado offline: Los datos se sincronizan localmente pero no en la base de datos')
    }
    
    return newlyUnlocked
  }

  const updateWorkoutLog = async (logId: string, updatedLog: WorkoutLog) => {
    if (!user) return

    // Actualizar estado local inmediatamente
    const updatedLogs = user.logs.map(log => 
      log.id === logId ? updatedLog : log
    )
    
    const updatedUser = {
      ...user,
      logs: updatedLogs
    }
    
    // Verificar logros
    const { updatedUser: userWithAchievements, newlyUnlocked } = checkAchievements(updatedUser)
    
    // Actualizar estado con logros nuevos
    setUser(userWithAchievements)

    // Intentar guardar en MongoDB en segundo plano
    await saveToMongoDB('workouts', 'PUT', { 
      workoutId: logId, 
      workout: updatedLog,
      userId: user.id // Añadir userId para facilitar la actualización en MongoDB
    })
    
    // Si hay logros nuevos, actualizar en BD
    if (newlyUnlocked.length > 0) {
      try {
        await fetch(`/api/users/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id,
            achievements: userWithAchievements.achievements
          })
        })
        
        // Mostrar notificación
        showAchievementNotification(newlyUnlocked)
      } catch (error) {
        console.error('Error actualizando logros:', error)
      }
    }
  }

  const deleteWorkoutLog = async (logId: string) => {
    if (!user) return

    // Actualizar estado local inmediatamente
    const updatedLogs = user.logs.filter(log => log.id !== logId)
    const updatedUser = {
      ...user,
      logs: updatedLogs
    }
    
    setUser(updatedUser)

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

  // Componente para mostrar la notificación de logros
  const AchievementNotification = () => {
    if (achievementNotification.length === 0) return null
    
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        {achievementNotification.map((achievement) => (
          <div 
            key={achievement.id}
            className="bg-green-100 border-l-4 border-green-500 p-4 mb-2 rounded shadow-md animate-fade-in"
          >
            <div className="flex items-center">
              <div className="text-3xl mr-3">{achievement.emoji}</div>
              <div>
                <h3 className="font-bold text-green-800">{achievement.name}</h3>
                <p className="text-sm text-green-700">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      addWorkoutLog,
      updateWorkoutLog,
      deleteWorkoutLog,
      isLoading,
      showAchievementNotification
    }}>
      {children}
      <AchievementNotification />
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