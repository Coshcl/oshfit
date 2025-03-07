'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await loginUser(formData.username, formData.password)
  }

  // Función para el login, reutilizada para el formulario y botones rápidos
  const loginUser = async (username: string, password: string = 'password123') => {
    setError('')
    setLoading(true)
    
    try {
      console.log(`Intentando iniciar sesión con: ${username}`)
      
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (result?.error) {
        console.error(`Error de inicio de sesión:`, result.error)
        setError('Usuario o contraseña incorrectos')
      } else {
        console.log(`Inicio de sesión exitoso para: ${username}`)
        // Redirigir al dashboard
        router.push(`/dashboard/${username.toLowerCase()}`)
      }
    } catch (err) {
      console.error(`Error general:`, err)
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Para inicio rápido con usuarios predefinidos
  const quickLogin = async (username: string) => {
    await loginUser(username, 'password123') // Contraseña por defecto para usuarios predefinidos
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Oshfit
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa con tus credenciales
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                         focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                         focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </div>
          
          <div className="text-center">
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-3">
            Usuarios predefinidos (inicio rápido):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['cosh', 'rosch', 'maquin', 'flosh'].map((user) => (
              <button
                key={user}
                onClick={() => quickLogin(user)}
                disabled={loading}
                className="py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 
                         rounded-md border border-gray-300 text-gray-700
                         disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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