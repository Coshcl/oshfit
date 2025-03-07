'use client'

import { createContext, useContext, ReactNode } from 'react'

// Contexto vacío para evitar errores de importación
const FirebaseContext = createContext<any>({})

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <FirebaseContext.Provider value={{}}>{children}</FirebaseContext.Provider>
}

export function useFirebase() {
  return useContext(FirebaseContext)
} 