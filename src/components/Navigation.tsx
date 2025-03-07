'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/lib/contexts/UserContext'

export function Navigation() {
  const pathname = usePathname()
  const { user } = useUser()
  
  if (!user) return null

  const userId = user.id.toLowerCase()
  
  const tabs = [
    { name: 'Perfil', href: `/dashboard/${userId}`, icon: '👤' },
    { name: 'Logs', href: `/dashboard/${userId}/logs`, icon: '📋' },
  ]

  return (
    <nav className="bg-white border-b relative">
      <div className="flex justify-between items-center h-14 px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 h-full flex items-center justify-center text-sm font-medium
                ${isActive 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* Botón flotante para nuevo entrenamiento */}
      <Link
        href={`/dashboard/${userId}/new`}
        className="absolute -bottom-16 right-4 w-12 h-12 bg-blue-600 rounded-full
                 flex items-center justify-center text-white text-2xl shadow-lg
                 hover:bg-blue-700 transition-colors duration-200
                 animate-bounce"
      >
        +
      </Link>
    </nav>
  )
} 