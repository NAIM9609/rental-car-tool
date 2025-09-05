'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Car, CarExtra, Location } from '../../types/car'
import { FaChevronLeft } from 'react-icons/fa'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { parseDateString, parseTimeString, formatDate, formatTime } from './dateUtils'
import Stepper, { type StepDef } from './components/Stepper'
import CarDetailsCard from './components/CarDetailsCard'
import StepDatesLocations from './components/StepDatesLocations'
import StepExtras from './components/StepExtras'
import StepSummary from './components/StepSummary'

// Data sources will be fetched from backend

export default function BookingPage() {
  const params = useParams()
  const carId = params.id as string
  
  const [car, setCar] = useState<Car | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<CarExtra[]>([])
  const [availableExtras, setAvailableExtras] = useState<CarExtra[]>([])
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [dropoffTime, setDropoffTime] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [additionalFees, setAdditionalFees] = useState({
    holidayFee: 0,
    outOfHoursFee: 0,
    airportFee: 0,
    holidayDates: [] as string[],
    outOfHoursDetails: [] as { date: string, time: string, type: string, reason: string }[],
    airportDetails: [] as string[],
    totalAdditionalFees: 0
  })

  // date/time helpers now imported from './dateUtils'

  const steps: StepDef[] = [
    { number: 1, title: 'Date e Luoghi', description: 'Seleziona quando e dove' },
    { number: 2, title: 'Opzioni Extra', description: 'Aggiungi servizi aggiuntivi' },
    { number: 3, title: 'Riepilogo', description: 'Conferma la prenotazione' }
  ]

  // Funzione per verificare se una data è domenica o festivo
  const isHolidayOrSunday = useCallback((date: Date) => {
    const dayOfWeek = date.getDay()
    
    // Domenica
    if (dayOfWeek === 0) return true
    
    // Festivi italiani (esempio - in produzione usare una libreria completa)
    const holidays = [
      '2025-01-01', '2025-01-06', '2025-04-21', '2025-04-25', 
      '2025-05-01', '2025-06-02', '2025-08-15', '2025-11-01', 
      '2025-12-08', '2025-12-25', '2025-12-26'
    ]
    
    const dateString = date.toISOString().split('T')[0]
    return holidays.includes(dateString)
  }, [])

  // Calcola automaticamente i costi aggiuntivi per festivi/fuori orario
  const calculateAdditionalFees = useCallback((startDate: Date, endDate: Date, startTime: string, endTime: string, pickupLoc: string, dropoffLoc: string) => {
    let holidayFee = 0
    let outOfHoursFee = 0
    let airportFee = 0
    const holidayDates: string[] = []
    const outOfHoursDetails: { date: string, time: string, type: string, reason: string }[] = []
    const airportDetails: string[] = []

    // Controlla SOLO le date specifiche di ritiro e consegna per festivi
    const isPickupHoliday = isHolidayOrSunday(startDate)
    const isDropoffHoliday = isHolidayOrSunday(endDate)

    if (isPickupHoliday) {
      holidayFee += 30
      holidayDates.push(`${startDate.toISOString().split('T')[0]} (ritiro)`)
    }

    if (isDropoffHoliday) {
      holidayFee += 30
      holidayDates.push(`${endDate.toISOString().split('T')[0]} (consegna)`)
    }

    // Controlla orari fuori standard (prima delle 8:00 o dopo le 18:00)
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    const isOutOfHours = (timeStr: string) => {
      const minutes = parseTime(timeStr)
      return minutes < 8 * 60 || minutes >= 18 * 60 // Prima delle 8:00 o dopo le 18:00
    }

    // MODIFICA: Ritiro - NON applica sovrapprezzo fuori orario se è già festivo
    if (isOutOfHours(startTime)) {
      if (!isPickupHoliday) {
        // Solo se NON è festivo, applica il sovrapprezzo fuori orario
        outOfHoursFee += 30
        outOfHoursDetails.push({
          date: startDate.toISOString().split('T')[0],
          time: startTime,
          type: 'ritiro',
          reason: 'fuori orario lavorativo'
        })
      } else {
        // Se è festivo, non applica sovrapprezzo fuori orario (solo informativo)
        outOfHoursDetails.push({
          date: startDate.toISOString().split('T')[0],
          time: startTime,
          type: 'ritiro',
          reason: 'festivo (orario fuori standard non addebitato)'
        })
      }
    } else if (isPickupHoliday) {
      outOfHoursDetails.push({
        date: startDate.toISOString().split('T')[0],
        time: startTime,
        type: 'ritiro',
        reason: 'festivo'
      })
    }

    // MODIFICA: Consegna - NON applica sovrapprezzo fuori orario se è già festivo
    if (isOutOfHours(endTime)) {
      if (!isDropoffHoliday) {
        // Solo se NON è festivo, applica il sovrapprezzo fuori orario
        outOfHoursFee += 30
        outOfHoursDetails.push({
          date: endDate.toISOString().split('T')[0],
          time: endTime,
          type: 'consegna',
          reason: 'fuori orario lavorativo'
        })
      } else {
        // Se è festivo, non applica sovrapprezzo fuori orario (solo informativo)
        outOfHoursDetails.push({
          date: endDate.toISOString().split('T')[0],
          time: endTime,
          type: 'consegna',
          reason: 'festivo (orario fuori standard non addebitato)'
        })
      }
    } else if (isDropoffHoliday) {
      outOfHoursDetails.push({
        date: endDate.toISOString().split('T')[0],
        time: endTime,
        type: 'consegna',
        reason: 'festivo'
      })
    }

    // Calcola costi aeroporto
  const pickupLocation = locations.find(loc => loc.name === pickupLoc)
  const dropoffLocation = locations.find(loc => loc.name === dropoffLoc)

    if (pickupLocation?.isAirport) {
      const timeSlot = pickupLocation.timeSlots.find(slot => {
        const startMinutes = parseTime(slot.fromHour)
        const endMinutes = parseTime(slot.toHour)
        const pickupMinutes = parseTime(startTime)
        return pickupMinutes >= startMinutes && pickupMinutes <= endMinutes
      })
      if (timeSlot) {
        airportFee += timeSlot.cost
        airportDetails.push(`Ritiro aeroporto: €${timeSlot.cost}`)
      }
    }

    if (dropoffLocation?.isAirport) {
      const timeSlot = dropoffLocation.timeSlots.find(slot => {
        const startMinutes = parseTime(slot.fromHour)
        const endMinutes = parseTime(slot.toHour)
        const dropoffMinutes = parseTime(endTime)
        return dropoffMinutes >= startMinutes && dropoffMinutes <= endMinutes
      })
      if (timeSlot) {
        airportFee += timeSlot.cost
        airportDetails.push(`Consegna aeroporto: €${timeSlot.cost}`)
      }
    }

    return { 
      holidayFee, 
      outOfHoursFee,
      airportFee,
      holidayDates, 
      outOfHoursDetails,
      airportDetails,
      totalAdditionalFees: holidayFee + outOfHoursFee + airportFee 
    }
  }, [isHolidayOrSunday, locations])

  const calculateTotalPrice = useCallback(() => {
    if (!car || !pickupDate || !dropoffDate) return

    const pickup = new Date(pickupDate)
    const dropoff = new Date(dropoffDate)
    // MODIFICA: Calcolo giorni corretto - inizia dalla data di ritiro, dopo 24 ore scatta la tariffa successiva
    const days = Math.max(1, Math.floor((dropoff.getTime() - pickup.getTime()) / (1000 * 3600 * 24)))

    let total = car.pricePerDay * days

    // Calcola le tariffe aggiuntive se abbiamo gli orari e le location
    if (pickupTime && dropoffTime && pickupLocation && dropoffLocation) {
      const fees = calculateAdditionalFees(pickup, dropoff, pickupTime, dropoffTime, pickupLocation, dropoffLocation)
      setAdditionalFees(fees)
      total += fees.totalAdditionalFees
    }

    // Aggiungi costi extra
    selectedExtras.forEach(extra => {
      if (extra.type === 'per_day') {
        total += extra.price * days
      } else {
        total += extra.price
      }
    })

    setTotalPrice(total)
  }, [car, selectedExtras, pickupDate, dropoffDate, pickupTime, dropoffTime, pickupLocation, dropoffLocation, calculateAdditionalFees])

  const fetchCar = useCallback(async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
      const res = await fetch(`${base}/api/cars/${carId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const mapped: Car = {
        id: data.id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        fuelType: data.fuelType,
        seats: data.seats,
        doors: data.doors,
        luggage: data.luggage,
        transmission: data.transmission,
        consumption: data.consumption || '',
        engine: data.engine || '',
        pricePerDay: data.pricePerDay,
        monthlyPrices: data.monthlyPrices || [],
        imageUrl: data.imageUrl || '',
        available: data.available,
        nextAvailableDate: data.nextAvailableDate ? new Date(data.nextAvailableDate).toISOString() : undefined,
        category: data.category || ''
      }
      setCar(mapped)
    } catch (error) {
      console.error('Errore nel caricamento dell\'auto:', error)
    } finally {
      setLoading(false)
    }
  }, [carId])

  useEffect(() => {
    fetchCar()
  }, [fetchCar])

  // Parse URL parameters for pre-populating the form
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      
      const pickupDateParam = urlParams.get('pickup_date')
      const dropoffDateParam = urlParams.get('dropoff_date')
      const pickupLocationParam = urlParams.get('pickup_location')
      const dropoffLocationParam = urlParams.get('dropoff_location')
      
      // Pre-populate dates if provided
      if (pickupDateParam) {
        const date = new Date(pickupDateParam)
        setPickupDate(date.toISOString().split('T')[0])
        // Set default time if not provided
        if (!urlParams.get('pickup_time')) {
          setPickupTime('10:00')
        }
      }
      
      if (dropoffDateParam) {
        const date = new Date(dropoffDateParam)
        setDropoffDate(date.toISOString().split('T')[0])
        // Set default time if not provided
        if (!urlParams.get('dropoff_time')) {
          setDropoffTime('17:00')
        }
      }
      
      // Pre-populate locations if provided
      if (pickupLocationParam) {
        setPickupLocation(pickupLocationParam)
      }
      
      if (dropoffLocationParam) {
        setDropoffLocation(dropoffLocationParam)
      }
      
      // Handle extras array from URL (extras[0]=14&extras[1]=18)
      const extrasParams: string[] = []
      
      // Check for both formats: extras[0]=14 and extras[]=14
      urlParams.forEach((value, key) => {
        if (key.startsWith('extras[') && key.endsWith(']')) {
          extrasParams.push(value)
        }
      })
      
      if (extrasParams.length > 0) {
        // Set a timeout to allow availableExtras to load first
        setTimeout(() => {
          setSelectedExtras(prev => {
            const newExtras = availableExtras.filter(extra => 
              extrasParams.includes(extra.id)
            )
            return [...prev, ...newExtras]
          })
        }, 500)
      }
    }
  }, [availableExtras])

  useEffect(() => {
    // fetch locations and extras from backend
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    const fetchAll = async () => {
      try {
        const [locRes, extRes] = await Promise.all([
          fetch(`${base}/api/locations`),
          fetch(`${base}/api/extras`)
        ])
        if (locRes.ok) {
          const locs = await locRes.json()
          setLocations(locs)
        }
        if (extRes.ok) {
          const exts = await extRes.json()
          // map backend ExtraOption to CarExtra shape if needed
          const mapped = exts.map((e: any) => ({ id: e.id, name: e.name, price: e.price, type: e.type }))
          setAvailableExtras(mapped)
        }
      } catch (e) {
        console.error('Errore caricamento locations/extras', e)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    calculateTotalPrice()
  }, [calculateTotalPrice])

  const handleExtraToggle = (extra: CarExtra) => {
    setSelectedExtras(prev => {
      const isSelected = prev.find(e => e.id === extra.id)
      if (isSelected) {
        return prev.filter(e => e.id !== extra.id)
      } else {
        return [...prev, extra]
      }
    })
  }

  const canProceedToNextStep = () => {
    // Controlla sempre se l'auto è disponibile
    if (car && !car.available) {
      return false
    }
    
    switch (currentStep) {
      case 1:
        // Validazione date: dropoff deve essere >= pickup
        const isValidDates = pickupDate && dropoffDate && new Date(dropoffDate) >= new Date(pickupDate)
        
        // Validazione disponibilità auto per la data di ritiro
        let isCarAvailableOnDate = true
        if (car?.nextAvailableDate && pickupDate) {
          isCarAvailableOnDate = new Date(pickupDate) >= new Date(car.nextAvailableDate)
        }
        
        // Validazione orari: se le date sono uguali, l'orario di consegna deve essere dopo quello di ritiro
        let isValidTimes = true
        if (pickupDate && dropoffDate && pickupTime && dropoffTime) {
          if (pickupDate === dropoffDate) {
            const pickupMinutes = pickupTime.split(':').map(Number)
            const dropoffMinutes = dropoffTime.split(':').map(Number)
            const pickupTotalMinutes = pickupMinutes[0] * 60 + pickupMinutes[1]
            const dropoffTotalMinutes = dropoffMinutes[0] * 60 + dropoffMinutes[1]
            isValidTimes = dropoffTotalMinutes > pickupTotalMinutes
          }
        }
        
        return isValidDates && isValidTimes && isCarAvailableOnDate && pickupTime && dropoffTime && pickupLocation && dropoffLocation
      case 2:
        return true // Gli extra sono opzionali
      case 3:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Prenotazione:', {
      car,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
      selectedExtras,
      totalPrice
    })
    alert('Prenotazione inviata! Ti contatteremo presto.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ProgressSpinner style={{ width: '3rem', height: '3rem' }} strokeWidth="4" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <i className="pi pi-exclamation-triangle text-3xl text-orange-500 mb-3 block" />
          <h1 className="text-xl font-bold mb-2">Auto non trovata</h1>
          <Button label="Torna alla home" icon="pi pi-home" onClick={() => (window.location.href = '/')} />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button label="Torna alle auto" icon="pi pi-arrow-left" text onClick={() => (window.location.href = '/')} />
        </div>

  <Stepper currentStep={currentStep} steps={steps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CarDetailsCard car={car} totalPrice={totalPrice} />

          {/* Contenuto degli step */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              
              {currentStep === 1 && (
                <StepDatesLocations
                  car={car}
                  locations={locations}
                  pickupLocation={pickupLocation}
                  setPickupLocation={setPickupLocation}
                  dropoffLocation={dropoffLocation}
                  setDropoffLocation={setDropoffLocation}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  dropoffDate={dropoffDate}
                  setDropoffDate={setDropoffDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  dropoffTime={dropoffTime}
                  setDropoffTime={setDropoffTime}
                  additionalFees={additionalFees}
                />
              )}

              {currentStep === 2 && (
                <StepExtras availableExtras={availableExtras} selectedExtras={selectedExtras} onToggle={handleExtraToggle} />
              )}

              {currentStep === 3 && (
                <StepSummary
                  car={car}
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                  pickupDate={pickupDate}
                  dropoffDate={dropoffDate}
                  pickupTime={pickupTime}
                  dropoffTime={dropoffTime}
                  selectedExtras={selectedExtras}
                  additionalFees={additionalFees}
                  totalPrice={totalPrice}
                />
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  label="Indietro"
                  icon="pi pi-arrow-left"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  outlined
                />

                {currentStep < 3 ? (
                  <Button
                    label="Avanti"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToNextStep()}
                  />
                ) : (
                  <Button
                    label="Conferma Prenotazione"
                    icon="pi pi-check"
                    onClick={handleSubmit}
                    disabled={!canProceedToNextStep()}
                    severity="success"
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
