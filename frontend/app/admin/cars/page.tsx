'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaImages, FaCalendarTimes,
  FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump, FaEuroSign
} from 'react-icons/fa'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  engine: string
  pricePerDay: number
  doors: number
  seats: number
  luggage: number
  transmission: string
  fuelType: string
  consumption: string
  images: string[]
  available: boolean
  nextAvailableDate?: string
}

export default function CarsManagement() {
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      brand: 'Fiat',
      model: '500',
      year: 2023,
      engine: '1.2 FireFly',
      pricePerDay: 35,
      doors: 3,
      seats: 4,
      luggage: 2,
      transmission: 'Manuale',
      fuelType: 'Benzina',
      consumption: '5.2L/100Km',
      images: ['/api/placeholder/400/300'],
      available: true
    },
    {
      id: '2',
      brand: 'BMW',
      model: 'Serie 3',
      year: 2024,
      engine: '2.0 TwinPower',
      pricePerDay: 85,
      doors: 4,
      seats: 5,
      luggage: 3,
      transmission: 'Automatico',
      fuelType: 'Diesel',
      consumption: '4.8L/100Km',
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      available: false,
      nextAvailableDate: '2025-09-01'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterAvailable, setFilterAvailable] = useState('all')

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAvailable === 'all' || 
                         (filterAvailable === 'available' && car.available) ||
                         (filterAvailable === 'unavailable' && !car.available)
    return matchesSearch && matchesFilter
  })

  const handleDeleteCar = (carId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa auto?')) {
      setCars(cars.filter(car => car.id !== carId))
    }
  }

  const toggleAvailability = (carId: string) => {
    setCars(cars.map(car => 
      car.id === carId ? { ...car, available: !car.available } : car
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Auto</h1>
          <p className="text-gray-600 mt-2">Gestisci il parco auto disponibile per il noleggio</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Aggiungi Auto
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca Auto
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per marca o modello..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per Disponibilità
            </label>
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutte</option>
              <option value="available">Disponibili</option>
              <option value="unavailable">Non Disponibili</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <strong>{filteredCars.length}</strong> auto trovate
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Car Image */}
            <div className="relative h-48 bg-gray-200">
              {car.images.length > 0 ? (
                <Image 
                  src={car.images[0]} 
                  alt={`${car.brand} ${car.model}`}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaCar className="text-gray-400 text-4xl" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                car.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {car.available ? 'Disponibile' : 'Non Disponibile'}
              </div>

              {/* Images Count */}
              {car.images.length > 1 && (
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaImages className="mr-1" />
                  {car.images.length}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-600">
                  Anno {car.year} - {car.engine}
                </p>
              </div>

              {/* Car Specs */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="flex items-center">
                  <FaCar className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">Porte: {car.doors}</span>
                </div>
                
                <div className="flex items-center">
                  <FaUsers className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">Posti: {car.seats}</span>
                </div>
                
                <div className="flex items-center">
                  <FaSuitcase className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">Bagagli: {car.luggage}</span>
                </div>
                
                <div className="flex items-center">
                  <FaCog className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">Cambio: {car.transmission}</span>
                </div>
                
                <div className="flex items-center">
                  <FaGasPump className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">Motore: {car.fuelType}</span>
                </div>
                
                <div className="flex items-center">
                  <FaEuroSign className="text-gray-600 text-sm mr-1" />
                  <span className="text-gray-700">€{car.pricePerDay}/giorno</span>
                </div>
              </div>

              {/* Next Available Date */}
              {!car.available && car.nextAvailableDate && (
                <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                  <span className="text-orange-700">
                    Disponibile dal: {new Date(car.nextAvailableDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  href={`/admin/cars/${car.id}/edit`}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <FaEdit className="mr-1" />
                  Modifica
                </Link>
                
                <Link
                  href={`/admin/cars/${car.id}/availability`}
                  className="flex-1 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors flex items-center justify-center"
                >
                  <FaCalendarTimes className="mr-1" />
                  Disponibilità
                </Link>
                
                <button
                  onClick={() => toggleAvailability(car.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                    car.available
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  <FaEye className="mr-1" />
                  {car.available ? 'Disabilita' : 'Abilita'}
                </button>
                
                <button
                  onClick={() => handleDeleteCar(car.id)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <FaCar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nessuna auto trovata</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterAvailable !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo la tua prima auto'
            }
          </p>
          {!searchTerm && filterAvailable === 'all' && (
            <div className="mt-6">
              <Link
                href="/admin/cars/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Aggiungi Prima Auto
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
