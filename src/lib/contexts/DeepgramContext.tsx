"use client";

import { createContext, useContext, ReactNode } from 'react'

// Contexto vacío para evitar errores de importación
const DeepgramContext = createContext<any>({})

export function DeepgramProvider({ children }: { children: ReactNode }) {
  return <DeepgramContext.Provider value={{}}>{children}</DeepgramContext.Provider>
}

export function useDeepgram() {
  return useContext(DeepgramContext)
}
