'use client'

import { useState } from 'react'
import { 
  FaCalendarTimes, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, 
  FaCar, FaCalendarAlt, FaClock, FaExclamationTriangle 
} from 'react-icons/fa'

interface UnavailabilityPeriod {
  id: string
  carId: string
  carName: string
  startDate: string
  endDate: string
  reason: string
  type: 'maintenance' | 'booked' | 'repair' | 'other'
  notes?: string
  active: boolean
}

interface Car {
  id: string
  name: string
  brand: string
  model: string
}

export default function AvailabilityManagement() {
  const [cars] = useState<Car[]>([
    { id: '1', name: 'Fiat 500', brand: 'Fiat', model: '500' },
    { id: '2', name: 'BMW Serie 3', brand: 'BMW', model: 'Serie 3' },
    { id: '3', name: 'Audi A4', brand: 'Audi', model: 'A4' }
  ])

  const [unavailabilityPeriods, setUnavailabilityPeriods] = useState<UnavailabilityPeriod[]>([
    {
      id: '1',
      carId: '2',
      carName: 'BMW Serie 3',
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      reason: 'Manutenzione programmata',
      type: 'maintenance',
      notes: 'Cambio olio e revisione generale',
      active: true
    },
    {
      id: '2',
      carId: '1',
      carName: 'Fiat 500',
      startDate: '2025-08-25',
      endDate: '2025-08-30',
      reason: 'Prenotazione esistente',
      type: 'booked',
      notes: 'Cliente: Mario Rossi',
      active: true
    }
  ])

  const [editingPeriod, setEditingPeriod] = useState<UnavailabilityPeriod | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newPeriod, setNewPeriod] = useState<Omit<UnavailabilityPeriod, 'id' | 'carName'>>({
    carId: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: 'maintenance',
    notes: '',
    active: true
  })

  const [selectedCar, setSelectedCar] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const typeLabels = {
    maintenance: 'Manutenzione',
    booked: 'Prenotato',
    repair: 'Riparazione',
    other: 'Altro'
  }

  const typeColors = {
    maintenance: 'bg-blue-100 text-blue-800',
    booked: 'bg-green-100 text-green-800',
    repair: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  }

  const filteredPeriods = unavailabilityPeriods.filter(period => {
    const matchesCar = selectedCar === 'all' || period.carId === selectedCar
    const matchesType = selectedType === 'all' || period.type === selectedType
    return matchesCar && matchesType
  })

  const handleEditPeriod = (period: UnavailabilityPeriod) => {
    setEditingPeriod({ ...period })
    setIsAddingNew(false)
  }

  const handleSaveEdit = () => {
    if (editingPeriod) {
      setUnavailabilityPeriods(periods => 
        periods.map(period => 
          period.id === editingPeriod.id ? editingPeriod : period
        )
      )
      setEditingPeriod(null)
    }
  }

  const handleAddNew = () => {
    const selectedCarData = cars.find(car => car.id === newPeriod.carId)
    if (!selectedCarData) return

    const id = (unavailabilityPeriods.length + 1).toString()
    const newPeriodData: UnavailabilityPeriod = {
      ...newPeriod,
      id,
      carName: `${selectedCarData.brand} ${selectedCarData.model}`
    }
    
    setUnavailabilityPeriods([...unavailabilityPeriods, newPeriodData])
    setNewPeriod({
      carId: '',
      startDate: '',
      endDate: '',
      reason: '',
      type: 'maintenance',
      notes: '',
      active: true
    })
    setIsAddingNew(false)
  }

  const handleDeletePeriod = (periodId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo periodo di indisponibilità?')) {
      setUnavailabilityPeriods(periods => 
        periods.filter(period => period.id !== periodId)
      )
    }
  }

  const togglePeriodStatus = (periodId: string) => {
    setUnavailabilityPeriods(periods => 
      periods.map(period => 
        period.id === periodId ? { ...period, active: !period.active } : period
      )
    )
  }

  const isDateRangeValid = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return false
    return new Date(startDate) <= new Date(endDate)
  }

  const getDaysCount = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Disponibilità Auto</h1>
          <p className="text-gray-600 mt-2">Imposta periodi di indisponibilità per manutenzione, riparazioni o prenotazioni</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Nuovo Periodo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per Auto
            </label>
            <select
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutte le Auto</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutti i Tipi</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <strong>{filteredPeriods.length}</strong> periodi trovati
            </div>
          </div>
        </div>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nuovo Periodo di Indisponibilità</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto *</label>
              <select
                value={newPeriod.carId}
                onChange={(e) => setNewPeriod({ ...newPeriod, carId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleziona un&apos;auto</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inizio *</label>
              <input
                type="date"
                value={newPeriod.startDate}
                onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Fine *</label>
              <input
                type="date"
                value={newPeriod.endDate}
                onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={newPeriod.startDate}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value as UnavailabilityPeriod['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo *</label>
              <input
                type="text"
                value={newPeriod.reason}
                onChange={(e) => setNewPeriod({ ...newPeriod, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. Manutenzione programmata, Riparazione freni"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              value={newPeriod.notes}
              onChange={(e) => setNewPeriod({ ...newPeriod, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Note aggiuntive (opzionale)"
            />
          </div>

          {/* Date Validation */}
          {newPeriod.startDate && newPeriod.endDate && (
            <div className="mb-4">
              {isDateRangeValid(newPeriod.startDate, newPeriod.endDate) ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">
                    <FaCalendarAlt className="inline mr-2" />
                    Periodo valido: {getDaysCount(newPeriod.startDate, newPeriod.endDate)} giorni
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">
                    <FaExclamationTriangle className="inline mr-2" />
                    Data di fine deve essere successiva o uguale alla data di inizio
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              disabled={!newPeriod.carId || !newPeriod.startDate || !newPeriod.endDate || !newPeriod.reason || !isDateRangeValid(newPeriod.startDate, newPeriod.endDate)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <FaSave className="mr-2" />
              Salva Periodo
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaTimes className="mr-2" />
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Periods List */}
      <div className="space-y-4">
        {filteredPeriods.map((period) => (
          <div key={period.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${!period.active ? 'opacity-60' : ''}`}>
            {editingPeriod?.id === period.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto</label>
                    <select
                      value={editingPeriod.carId}
                      onChange={(e) => {
                        const selectedCarData = cars.find(car => car.id === e.target.value)
                        setEditingPeriod({ 
                          ...editingPeriod, 
                          carId: e.target.value,
                          carName: selectedCarData ? `${selectedCarData.brand} ${selectedCarData.model}` : ''
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.brand} {car.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Inizio</label>
                    <input
                      type="date"
                      value={editingPeriod.startDate}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Fine</label>
                    <input
                      type="date"
                      value={editingPeriod.endDate}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={editingPeriod.startDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      value={editingPeriod.type}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, type: e.target.value as UnavailabilityPeriod['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                    <input
                      type="text"
                      value={editingPeriod.reason}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, reason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <textarea
                    value={editingPeriod.notes || ''}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!isDateRangeValid(editingPeriod.startDate, editingPeriod.endDate)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Salva
                  </button>
                  <button
                    onClick={() => setEditingPeriod(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FaCar className="text-blue-600 text-xl mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{period.carName}</h3>
                      <p className="text-gray-600">{period.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[period.type]}`}>
                      {typeLabels[period.type]}
                    </span>
                    
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      period.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {period.active ? 'Attivo' : 'Disattivo'}
                    </span>
                    
                    <button
                      onClick={() => handleEditPeriod(period)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="Modifica periodo"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => togglePeriodStatus(period.id)}
                      className={`p-2 ${period.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                      title={period.active ? 'Disattiva periodo' : 'Attiva periodo'}
                    >
                      {period.active ? '⏸️' : '▶️'}
                    </button>
                    
                    <button
                      onClick={() => handleDeletePeriod(period.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Elimina periodo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="mr-2" />
                      Data Inizio
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date(period.startDate).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarTimes className="mr-2" />
                      Data Fine
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date(period.endDate).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaClock className="mr-2" />
                      Durata
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {getDaysCount(period.startDate, period.endDate)} giorni
                    </div>
                  </div>
                </div>

                {period.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Note:</h4>
                    <p className="text-blue-800 text-sm">{period.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPeriods.length === 0 && (
        <div className="text-center py-12">
          <FaCalendarTimes className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun periodo di indisponibilità</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCar !== 'all' || selectedType !== 'all' 
              ? 'Nessun periodo trovato con i filtri attuali'
              : 'Non ci sono periodi di indisponibilità configurati'
            }
          </p>
          {selectedCar === 'all' && selectedType === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setIsAddingNew(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Aggiungi Primo Periodo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
