import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oshfit - Seguimiento de Entrenamientos',
  description: 'Aplicación para seguimiento de rutinas de entrenamiento Push, Pull, Legs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100 text-gray-900 min-h-screen`}>
        <AuthProvider>
          <main className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
