'use client'

import { useState, useEffect } from 'react'
import CarCard from './CarCard'
import { Car } from '../types/car'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataView } from 'primereact/dataview'
import { Message } from 'primereact/message'
import { SearchParams } from './SearchForm'

interface CarListProps {
  searchParams?: SearchParams
}

export default function CarList({ searchParams }: CarListProps) {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCars()
  }, [searchParams])

  const fetchCars = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/cars`
      
      // Add search parameters if provided
      if (searchParams) {
        const params = new URLSearchParams()
        params.set('pickup_date', searchParams.pickupDate)
        params.set('dropoff_date', searchParams.dropoffDate)
        params.set('pickup_location', searchParams.pickupLocation)
        params.set('dropoff_location', searchParams.dropoffLocation)
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      
      // Handle both old format (array) and new format (object with cars array)
      if (Array.isArray(data)) {
        setCars(data)
      } else if (data.cars && Array.isArray(data.cars)) {
        setCars(data.cars)
      } else {
        setCars([])
      }
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
      
      {searchParams && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Auto disponibili</h2>
          <p className="text-color-secondary">
            Dal {new Date(searchParams.pickupDate).toLocaleDateString('it-IT')} al{' '}
            {new Date(searchParams.dropoffDate).toLocaleDateString('it-IT')} 
            {searchParams.pickupLocation && ` - Ritiro: ${searchParams.pickupLocation}`}
            {searchParams.dropoffLocation && ` - Consegna: ${searchParams.dropoffLocation}`}
          </p>
        </div>
      )}

      <DataView
        value={cars}
        layout="grid"
        emptyMessage={searchParams ? "Nessuna auto disponibile per i criteri selezionati." : "Nessuna auto disponibile al momento."}
        itemTemplate={(car: Car) => (
          <div className="p-2 w-full md:w-6 lg:w-4">
            <CarCard car={car} searchParams={searchParams} />
          </div>
        )}
      />
    </>
  )
}
