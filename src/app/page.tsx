'use client'

import { useRouter } from 'next/navigation'
import { UserType } from '@/lib/types'

const users: { id: UserType; name: string }[] = [
  { id: 'Rosch', name: 'rosch' },
  { id: 'Cosh', name: 'cosh' },
  { id: 'Maquin', name: 'maquin' },
  { id: 'Flosh', name: 'flosh' },
]

export default function Home() {
  const router = useRouter()

  const handleUserSelect = (userId: UserType) => {
    router.push(`/dashboard/${userId.toLowerCase()}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold mb-8">¡Bienvenido!</h1>
      <h2 className="text-xl mb-8">Selecciona tu usuario</h2>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user.id)}
            className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg 
                     flex items-center justify-center text-lg font-medium
                     hover:bg-white/20 transition-colors duration-200
                     border-2 border-white/30"
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  )
}
