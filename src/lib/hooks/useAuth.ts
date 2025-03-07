'use client'

// Hook simplificado que no hace nada
export function useAuth() {
  return {
    signInWithGoogle: () => {
      console.log('Esta función está desactivada')
    },
  }
}