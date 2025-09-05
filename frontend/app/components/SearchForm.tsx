'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Location } from '../types/car'
import { useRouter } from 'next/navigation'
import { saveSearchSession, clearExpiredSessions } from '../utils/searchSession'

interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void
}

export interface SearchParams {
  pickupDate: string
  dropoffDate: string
  pickupLocation: string
  dropoffLocation: string
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null)
  const [pickupLocation, setPickupLocation] = useState<string>('')
  const [dropoffLocation, setDropoffLocation] = useState<string>('')
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    // Load locations from backend
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/locations`)
        if (response.ok) {
          const data = await response.json()
          setLocations(data)
        }
      } catch (error) {
        console.error('Error loading locations:', error)
      }
    }
    fetchLocations()
    
    // Clear expired search sessions
    clearExpiredSessions()
  }, [])

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    
    const pickupDateParam = urlParams.get('pickup_date')
    const dropoffDateParam = urlParams.get('dropoff_date')
    const pickupLocationParam = urlParams.get('pc') || urlParams.get('pickup_location')
    const dropoffLocationParam = urlParams.get('dc') || urlParams.get('dropoff_location')

    if (pickupDateParam) {
      setPickupDate(new Date(pickupDateParam))
    }
    if (dropoffDateParam) {
      setDropoffDate(new Date(dropoffDateParam))
    }
    if (pickupLocationParam) {
      setPickupLocation(pickupLocationParam)
    }
    if (dropoffLocationParam) {
      setDropoffLocation(dropoffLocationParam)
    }
  }, [])

  const locationOptions = locations.map(location => ({
    label: location.name,
    value: location.name
  }))

  const handleSearch = () => {
    if (!pickupDate || !dropoffDate || !pickupLocation || !dropoffLocation) {
      return // Validation - all fields required
    }

    const searchParams: SearchParams = {
      pickupDate: pickupDate.toISOString().split('T')[0],
      dropoffDate: dropoffDate.toISOString().split('T')[0],
      pickupLocation,
      dropoffLocation
    }

    // Save search session and get ID
    const searchId = saveSearchSession(searchParams)

    // Update URL with search parameters including search_id
    const params = new URLSearchParams()
    params.set('pickup_date', pickupDate.toISOString())
    params.set('dropoff_date', dropoffDate.toISOString())
    params.set('pc', pickupLocation)
    params.set('dc', dropoffLocation)
    params.set('search_id', searchId)
    
    router.push(`/?${params.toString()}`)
    
    // Call the onSearch callback
    onSearch(searchParams)
  }

  const isFormValid = pickupDate && dropoffDate && pickupLocation && dropoffLocation && 
    (dropoffDate >= pickupDate)

  return (
    <Card className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Cerca la tua auto</h2>
        <p className="text-color-secondary">
          Seleziona date e luoghi per trovare l&apos;auto perfetta per te
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="field">
          <label htmlFor="pickup-date" className="block text-sm font-medium mb-2">
            Data ritiro
          </label>
          <Calendar
            id="pickup-date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            minDate={new Date()}
            placeholder="Seleziona data"
            className="w-full"
            showIcon
          />
        </div>

        <div className="field">
          <label htmlFor="dropoff-date" className="block text-sm font-medium mb-2">
            Data consegna
          </label>
          <Calendar
            id="dropoff-date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            minDate={pickupDate || new Date()}
            placeholder="Seleziona data"
            className="w-full"
            showIcon
          />
        </div>

        <div className="field">
          <label htmlFor="pickup-location" className="block text-sm font-medium mb-2">
            Luogo ritiro
          </label>
          <Dropdown
            id="pickup-location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.value)}
            options={locationOptions}
            placeholder="Seleziona luogo"
            className="w-full"
            filter
          />
        </div>

        <div className="field">
          <label htmlFor="dropoff-location" className="block text-sm font-medium mb-2">
            Luogo consegna
          </label>
          <Dropdown
            id="dropoff-location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.value)}
            options={locationOptions}
            placeholder="Seleziona luogo"
            className="w-full"
            filter
          />
        </div>
      </div>

      <div className="text-center">
        <Button
          label="Cerca Auto"
          icon="pi pi-search"
          onClick={handleSearch}
          disabled={!isFormValid}
          size="large"
          className="px-8"
        />
      </div>
    </Card>
  )
}