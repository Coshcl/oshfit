'use client'

import { useState } from 'react'

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) {
  // Convertir fechas a strings para los inputs
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    
    // Formato YYYY-MM-DD para input type="date"
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }
  
  // Convertir strings de los inputs a objetos Date
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (!dateString) {
      onStartDateChange(null)
      return
    }
    
    const newDate = new Date(dateString)
    onStartDateChange(newDate)
    
    // Si la fecha de inicio es posterior a la fecha de fin, actualizamos la fecha de fin
    if (endDate && newDate > endDate) {
      onEndDateChange(newDate)
    }
  }
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (!dateString) {
      onEndDateChange(null)
      return
    }
    
    const newDate = new Date(dateString)
    onEndDateChange(newDate)
    
    // Si la fecha de fin es anterior a la fecha de inicio, actualizamos la fecha de inicio
    if (startDate && newDate < startDate) {
      onStartDateChange(newDate)
    }
  }
  
  // Botones para filtros rápidos
  const applyPresetFilter = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    
    onStartDateChange(start)
    onEndDateChange(end)
  }
  
  // Limpiar filtros
  const clearFilters = () => {
    onStartDateChange(null)
    onEndDateChange(null)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin
          </label>
          <input
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyPresetFilter(7)}
          className="px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
        >
          Última semana
        </button>
        <button
          type="button"
          onClick={() => applyPresetFilter(30)}
          className="px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
        >
          Último mes
        </button>
        <button
          type="button"
          onClick={() => applyPresetFilter(90)}
          className="px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
        >
          Últimos 3 meses
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 ml-auto"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
} 