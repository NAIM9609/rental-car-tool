'use client'

import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump, FaRoad } from 'react-icons/fa'
import { Car } from '../../../types/car'

export default function CarDetailsCard({ car, totalPrice }: { car: Car; totalPrice: number }) {
  return (
    <Card className="p-6">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4">
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-sm font-medium text-readable-medium">
              {car.brand} {car.model}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-readable-dark mb-2">
        {car.brand} {car.model}
      </h2>
      <p className="text-lg font-semibold text-blue-600 mb-4">€{car.pricePerDay}/giorno</p>

      {!car.available && car.nextAvailableDate && (
        <Message
          severity="error"
          className="mb-4"
          text={`Auto non disponibile. Disponibile dal ${new Date(car.nextAvailableDate).toLocaleDateString('it-IT')}`}
        />
      )}

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
          <FaRoad className="text-gray-600 text-sm mr-1" />
          <span className="text-gray-700">Consumo: {car.consumption}</span>
        </div>
      </div>

      {totalPrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-bold text-readable-dark mb-2">Totale Prenotazione</h3>
          <div className="text-2xl font-bold text-blue-600">€{totalPrice}</div>
        </div>
      )}
    </Card>
  )
}
