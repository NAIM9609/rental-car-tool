'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Car, CarExtra, Location } from '../../types/car'
import { FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump, FaRoad, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

export default function BookingPage() {
  const params = useParams()
  const carId = params.id as string
  
  const [car, setCar] = useState<Car | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<CarExtra[]>([])
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [dropoffTime, setDropoffTime] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  const availableExtras: CarExtra[] = [
    { id: '1', name: '1 seggiolino', price: 10, type: 'per_day' },
    { id: '2', name: '2 seggiolini', price: 15, type: 'per_day' },
    { id: '3', name: 'Assicurazione KASKO - Franchigia zero danni, zero furto e incendio', price: 20, type: 'per_day' },
    { id: '4', name: 'Catene da neve', price: 5, type: 'per_day' },
    { id: '5', name: 'Navigatore satellitare Tom Tom', price: 10, type: 'per_day' },
    { id: '6', name: 'Neo patentato (inferiore a 3 anni)', price: 10, type: 'per_day' },
    { id: '7', name: 'Ritiro e consegna presso la nostra sede domenica e giorni festivi', price: 30, type: 'one_time' },
    { id: '8', name: 'Secondo guidatore', price: 10, type: 'per_day' },
    { id: '9', name: 'Wi-Fi portatile', price: 5, type: 'per_day' }
  ]

  const locations: Location[] = [
    {
      id: '1',
      name: 'Aeroporto Falcone e Borsellino (Palermo)',
      address: 'Aeroporto Palermo',
      isAirport: true,
      timeSlots: [
        { fromHour: '00:00', toHour: '08:59', cost: 180 },
        { fromHour: '09:00', toHour: '20:30', cost: 180 },
        { fromHour: '20:31', toHour: '23:59', cost: 180 }
      ]
    },
    {
      id: '2',
      name: 'Aeroporto Fontanarossa (Catania)',
      address: 'Aeroporto Catania',
      isAirport: true,
      timeSlots: [
        { fromHour: '00:00', toHour: '07:59', cost: 30 },
        { fromHour: '08:00', toHour: '20:00', cost: 20 },
        { fromHour: '20:01', toHour: '23:59', cost: 30 }
      ]
    },
    {
      id: '3',
      name: 'Nostra sede (via Garibaldi, 35)',
      address: 'Via Garibaldi, 35',
      isAirport: false,
      timeSlots: [
        { fromHour: '20:02', toHour: '23:59', cost: 30 },
        { fromHour: '00:00', toHour: '07:59', cost: 30 },
        { fromHour: '08:00', toHour: '20:01', cost: 0 }
      ]
    }
  ]

  useEffect(() => {
    fetchCar()
  }, [carId])

  useEffect(() => {
    calculateTotalPrice()
  }, [car, selectedExtras, pickupDate, dropoffDate])

  const fetchCar = async () => {
    try {
      // Mock data - in produzione fare chiamata API
      const mockCar: Car = {
        id: carId,
        brand: 'Opel',
        model: 'Meriva 1300',
        year: 2023,
        fuelType: 'Diesel',
        seats: 5,
        doors: 5,
        luggage: 5,
        transmission: 'Manuale',
        consumption: '5.8L/100Km',
        engine: 'Diesel',
        pricePerDay: 50,
        monthlyPrices: [
          { month: 'Gennaio', price: 50 },
          { month: 'Febbraio', price: 50 },
          { month: 'Marzo', price: 50 },
          { month: 'Aprile', price: 50 },
          { month: 'Maggio', price: 50 },
          { month: 'Giugno', price: 50 },
          { month: 'Luglio', price: 50 },
          { month: 'Agosto', price: 50 },
          { month: 'Settembre', price: 50 },
          { month: 'Ottobre', price: 50 },
          { month: 'Novembre', price: 50 },
          { month: 'Dicembre', price: 50 }
        ],
        imageUrl: '/images/opel-meriva.jpg',
        available: true,
        category: 'Economia'
      }
      setCar(mockCar)
    } catch (error) {
      console.error('Errore nel caricamento dell\'auto:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!car || !pickupDate || !dropoffDate) return

    const pickup = new Date(pickupDate)
    const dropoff = new Date(dropoffDate)
    const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 3600 * 24)))

    let total = car.pricePerDay * days

    // Aggiungi costi extra
    selectedExtras.forEach(extra => {
      if (extra.type === 'per_day') {
        total += extra.price * days
      } else {
        total += extra.price
      }
    })

    setTotalPrice(total)
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logica di prenotazione
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-readable-dark mb-4">Auto non trovata</h1>
          <a href="/" className="text-blue-600 hover:underline">Torna alla home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:underline font-medium">← Torna alle auto</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dettagli Auto */}
          <div className="bg-card-white rounded-xl shadow-card p-6 border border-gray-200">
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6">
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-lg font-medium text-readable-medium">{car.brand} {car.model}</p>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-readable-dark mb-2">
              {car.brand} {car.model} (o segmento simile)
            </h1>
            <p className="text-xl font-semibold text-blue-600 mb-6">€{car.pricePerDay},00</p>

            {/* Attributi dell'auto */}
            <div className="car-attributes mb-6">
              <div className="car-attribute-item">
                <FaCar className="car-attribute-icon" />
                <span className="car-attribute-name">Porte</span>
                <span className="car-attribute-value">{car.doors}</span>
              </div>
              
              <div className="car-attribute-item">
                <FaUsers className="car-attribute-icon" />
                <span className="car-attribute-name">Posti</span>
                <span className="car-attribute-value">{car.seats}</span>
              </div>
              
              <div className="car-attribute-item">
                <FaSuitcase className="car-attribute-icon" />
                <span className="car-attribute-name">Bagagli</span>
                <span className="car-attribute-value">{car.luggage}</span>
              </div>
              
              <div className="car-attribute-item">
                <FaCog className="car-attribute-icon" />
                <span className="car-attribute-name">Cambio</span>
                <span className="car-attribute-value">{car.transmission}</span>
              </div>
              
              <div className="car-attribute-item">
                <FaRoad className="car-attribute-icon" />
                <span className="car-attribute-name">Consumo medio</span>
                <span className="car-attribute-value">{car.consumption}</span>
              </div>
              
              <div className="car-attribute-item">
                <FaGasPump className="car-attribute-icon" />
                <span className="car-attribute-name">Motore</span>
                <span className="car-attribute-value">{car.fuelType}</span>
              </div>
            </div>

            {/* Prezzi mensili */}
            <div className="monthly-pricing">
              <h3>Prezzi mensili</h3>
              <div className="grid grid-cols-2 gap-2">
                {car.monthlyPrices.map((monthPrice) => (
                  <div key={monthPrice.month} className="month-price-item">
                    <span className="month-name">{monthPrice.month}</span>
                    <span className="month-price">€{monthPrice.price},00</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form di prenotazione */}
          <div className="bg-card-white rounded-xl shadow-card p-6 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Luoghi di ritiro e consegna */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-readable-dark mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Luogo di ritiro
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                    required
                  >
                    <option value="">Seleziona luogo di ritiro</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-readable-dark mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Luogo di consegna
                  </label>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                    required
                  >
                    <option value="">Seleziona luogo di consegna</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date e orari */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-readable-dark mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Data e ora di ritiro
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                      required
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-readable-dark mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Data e ora di consegna
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                      required
                    />
                    <input
                      type="time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-readable-dark"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Opzioni extra */}
              <div className="extras-section">
                <h5>Opzioni aggiuntive</h5>
                <div className="space-y-2">
                  {availableExtras.map(extra => (
                    <div key={extra.id} className="extra-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedExtras.some(e => e.id === extra.id)}
                          onChange={() => handleExtraToggle(extra)}
                        />
                        {extra.name}
                      </label>
                      <span className="extra-price">
                        €{extra.price},00 {extra.type === 'per_day' ? 'al giorno' : 'una tantum'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Riepilogo costi */}
              {totalPrice > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-readable-dark mb-2">
                    Costi totali
                    <span className="float-right text-2xl text-blue-600">€{totalPrice},00</span>
                  </h3>
                </div>
              )}

              {/* Pulsante prenotazione */}
              <button
                type="submit"
                disabled={!pickupDate || !dropoffDate || !pickupLocation || !dropoffLocation}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prenota Subito
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
