'use client'

import { useState } from 'react'
import { WorkoutLog, WorkoutType } from '@/lib/types'

interface WorkoutCalendarProps {
  logs: WorkoutLog[]
  onSelectDate: (logId: string) => void
}

export function WorkoutCalendar({ logs, onSelectDate }: WorkoutCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const typeColors: Record<WorkoutType, string> = {
    Push: 'bg-blue-100 hover:bg-blue-200',
    Pull: 'bg-green-100 hover:bg-green-200',
    Legs: 'bg-purple-100 hover:bg-purple-200'
  }

  // Obtener primer día del mes y último día
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

  // Crear array de días del mes
  const days = []
  const startPadding = firstDay.getDay() // 0 = Domingo
  
  // Añadir padding inicial
  for (let i = 0; i < startPadding; i++) {
    days.push(null)
  }
  
  // Añadir días del mes
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const monthName = currentMonth.toLocaleString('es', { month: 'long' })

  const getLogForDate = (date: Date) => {
    return logs.find(log => {
      const logDate = new Date(log.date)
      return logDate.getDate() === date.getDate() &&
             logDate.getMonth() === date.getMonth() &&
             logDate.getFullYear() === date.getFullYear()
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        
        <h2 className="text-lg font-semibold capitalize">
          {monthName} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const log = getLogForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <button
              key={day.getTime()}
              onClick={() => log && onSelectDate(log.id)}
              className={`aspect-square p-1 rounded-lg relative
                ${log ? typeColors[log.type] : 'hover:bg-gray-50'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <span className="absolute top-1 left-1 text-xs">
                {day.getDate()}
              </span>
              {log && (
                <span className="absolute bottom-1 right-1 text-xs">
                  {log.type[0]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex justify-center gap-4 text-sm">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`} />
            <span>{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 