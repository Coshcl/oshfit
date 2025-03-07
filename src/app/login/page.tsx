'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleLogin(username)
  }

  const handleLogin = async (username: string) => {
    if (!username) return

    setError('')
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        username,
        password: 'dummypassword', // No se usa realmente
        redirect: false
      })

      if (result?.error) {
        setError('Usuario no válido. Usa uno de los usuarios predefinidos.')
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
            <p className="text-gray-600">Inicializando usuarios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Oshfit
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nombre de usuario
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 appearance-none rounded-lg w-full px-3 py-2 border
                       border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de usuario"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-3">
            Usuarios predefinidos:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['cosh', 'rosch', 'maquin', 'flosh'].map((user) => (
              <button
                key={user}
                onClick={() => handleLogin(user)}
                disabled={loading}
                className="py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 
                         rounded-md border border-gray-300 text-gray-700"
              >
                {user}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 