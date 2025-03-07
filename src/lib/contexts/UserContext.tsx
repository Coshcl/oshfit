'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { UserProfile, UserType, WorkoutLog } from '../types'

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  addWorkoutLog: (log: WorkoutLog) => Promise<void>
  updateWorkoutLog: (logId: string, log: WorkoutLog) => Promise<void>
  deleteWorkoutLog: (logId: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  const addWorkoutLog = async (log: WorkoutLog) => {
    if (!user) return

    try {
      await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, workout: log })
      })

      const updatedUser = {
        ...user,
        logs: [...user.logs, log]
      }
      setUser(updatedUser)
    } catch (error) {
      console.error('Error adding workout:', error)
    }
  }

  const updateWorkoutLog = async (logId: string, updatedLog: WorkoutLog) => {
    if (!user) return

    try {
      await fetch('/api/workouts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId: logId, workout: updatedLog })
      })

      const updatedLogs = user.logs.map(log => 
        log.id === logId ? updatedLog : log
      )
      
      setUser({
        ...user,
        logs: updatedLogs
      })
    } catch (error) {
      console.error('Error updating workout:', error)
    }
  }

  const deleteWorkoutLog = async (logId: string) => {
    if (!user) return

    try {
      await fetch(`/api/workouts?workoutId=${logId}`, {
        method: 'DELETE'
      })

      const updatedLogs = user.logs.filter(log => log.id !== logId)
      setUser({
        ...user,
        logs: updatedLogs
      })
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

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