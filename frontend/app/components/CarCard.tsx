'use client'

import { Car } from '../types/car'
import Link from 'next/link'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { SearchParams } from './SearchForm'

interface CarCardProps {
  car: Car
  searchParams?: SearchParams
}

export default function CarCard({ car, searchParams }: CarCardProps) {
  // Build booking URL with search parameters
  const buildBookingUrl = () => {
    let url = `/booking/${car.id}`
    
    if (searchParams) {
      const params = new URLSearchParams()
      params.set('pickup_date', searchParams.pickupDate)
      params.set('dropoff_date', searchParams.dropoffDate)
      params.set('pickup_location', searchParams.pickupLocation)
      params.set('dropoff_location', searchParams.dropoffLocation)
      params.set('car_id', car.id)
      
      url += `?${params.toString()}`
    }
    
    return url
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-surface-100 flex items-center justify-center">
        <i className="pi pi-car text-5xl text-color-secondary"></i>
        <div className="absolute top-3 left-3">
          <Tag value={car.category || 'Standard'} severity="info" />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-bold">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-color-secondary">
            Anno {car.year} - {car.engine}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-color-secondary">
          <div className="flex items-center gap-1">
            <i className="pi pi-window-maximize"></i>
            Porte: {car.doors || 5}
          </div>
          <div className="flex items-center gap-1">
            <i className="pi pi-users"></i>
            Posti: {car.seats}
          </div>
          <div className="flex items-center gap-1">
            <i className="pi pi-briefcase"></i>
            Bagagli: {car.luggage || 3}
          </div>
          <div className="flex items-center gap-1">
            <i className="pi pi-cog"></i>
            Cambio: {car.transmission}
          </div>
          <div className="flex items-center gap-1">
            <i className="pi pi-bolt"></i>
            Motore: {car.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <i className="pi pi-sliders-h"></i>
            Consumo: {car.consumption || '6.5L'}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-primary">€{car.pricePerDay}</div>
            <div className="text-xs text-color-secondary">al giorno</div>
          </div>
          {car.available ? (
            <Link href={buildBookingUrl()}>
              <Button label="Prenota Subito" icon="pi pi-arrow-right" />
            </Link>
          ) : (
            <Button label="Non disponibile" icon="pi pi-times" disabled />
          )}
        </div>

        <div className="mt-3 flex items-center justify-center text-xs">
          <i className={`pi ${car.available ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} mr-2`}></i>
          <span className={car.available ? 'text-green-600' : 'text-red-600'}>
            {car.available ? 'Disponibile' : car.nextAvailableDate ? `Disponibile dal ${new Date(car.nextAvailableDate).toLocaleDateString('it-IT')}` : 'Non disponibile'}
          </span>
        </div>
      </div>
    </Card>
  )
}
