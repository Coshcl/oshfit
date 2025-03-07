'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { achievements } from '@/lib/config/achievements'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    // Validar formulario
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    // Validar que el nombre de usuario no sea uno de los predefinidos
    const reservedUsernames = ['cosh', 'rosch', 'maquin', 'flosh']
    if (reservedUsernames.includes(formData.username.toLowerCase())) {
      setError('Este nombre de usuario no está disponible')
      return
    }
    
    setLoading(true)
    
    try {
      // Crear nuevo usuario
      const userId = formData.username.charAt(0).toUpperCase() + formData.username.slice(1).toLowerCase()
      
      const newUser = {
        id: userId,
        name: formData.username.toLowerCase(),
        password: formData.password, // En producción esto debería estar hasheado
        logs: [],
        achievements: achievements,
        oshfitScore: 0
      }
      
      // Enviar a la API
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }
      
      // Iniciar sesión automáticamente
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false
      })
      
      if (result?.error) {
        throw new Error('Error al iniciar sesión tras registro')
      }
      
      // Redirigir al dashboard
      router.push(`/dashboard/${formData.username.toLowerCase()}`)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al registrar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para comenzar a usar Oshfit
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
                placeholder="Elige un nombre de usuario"
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
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                         focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Repite tu contraseña"
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
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </div>
          
          <div className="text-center">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 