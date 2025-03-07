'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string

    const result = await signIn('credentials', {
      username: username,
      password: 'default-password', // Por ahora usamos una contraseña fija
      redirect: false
    })

    if (result?.error) {
      setError('Usuario no válido')
    } else {
      router.push(`/dashboard/${username.toLowerCase()}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="max-w-sm w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Oshfit
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa con tu nombre de usuario
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border
                       border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                       focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 