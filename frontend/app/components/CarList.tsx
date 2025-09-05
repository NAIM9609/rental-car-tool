'use client'

import { useState, useEffect } from 'react'
import CarCard from './CarCard'
import { Car } from '../types/car'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataView } from 'primereact/dataview'
import { Message } from 'primereact/message'

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/cars`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error('Errore nel caricamento delle auto:', error)
      setError('Impossibile caricare le auto dal server. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner style={{ width: '3rem', height: '3rem' }} strokeWidth="4" />
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-4">
          <Message severity="error" text={error} />
        </div>
      )}
      <DataView
        value={cars}
        layout="grid"
        emptyMessage="Nessuna auto disponibile al momento."
        itemTemplate={(car: Car) => (
          <div className="p-2 w-full md:w-6 lg:w-4">
            <CarCard car={car} />
          </div>
        )}
      />
    </>
  )
}
