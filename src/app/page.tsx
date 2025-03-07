'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

// Usuarios predefinidos
const users = [
  { id: 'cosh', name: 'Cosh', color: 'bg-blue-500' },
  { id: 'rosch', name: 'Rosch', color: 'bg-green-500' },
  { id: 'maquin', name: 'Maquin', color: 'bg-yellow-500' },
  { id: 'flosh', name: 'Flosh', color: 'bg-red-500' },
]

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Inicializar usuarios predefinidos al cargar la página
  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const response = await fetch('/api/users/initialize')
        const data = await response.json()
        console.log('Usuarios inicializados:', data)
      } catch (error) {
        console.error('Error inicializando usuarios:', error)
      } finally {
        setInitializing(false)
      }
    }

    initializeUsers()
  }, [])

  const handleSelectUser = async (username: string) => {
    setError('')
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        username,
        redirect: false
      })

      if (result?.error) {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
      } else {
        router.push(`/dashboard/${username.toLowerCase()}`)
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Inicializando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Oshfit</h1>
        <p className="text-center text-gray-600 mb-8">¿Quién entrena hoy?</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              disabled={loading}
              className={`${user.color} text-white py-8 px-4 rounded-lg shadow hover:shadow-lg 
                         transition-shadow duration-200 flex flex-col items-center justify-center
                         disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-3xl font-bold mb-2">{user.name.charAt(0).toUpperCase()}</span>
              <span className="text-lg">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
