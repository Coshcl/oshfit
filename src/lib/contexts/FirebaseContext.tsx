'use client'

import { createContext, useContext, ReactNode } from 'react'

interface FirebaseContextType {
  // Contexto vacío ya que no usamos Firebase
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Proveedor simplificado sin funcionalidad real
  return (
    <FirebaseContext.Provider value={{}}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
} 