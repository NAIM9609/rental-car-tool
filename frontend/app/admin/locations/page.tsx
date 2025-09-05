'use client'

import { useState } from 'react'
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaMapMarkerAlt, 
  FaPlane, FaClock, FaEuroSign 
} from 'react-icons/fa'

interface TimeSlot {
  fromHour: string
  toHour: string
  cost: number
}

interface Location {
  id: string
  name: string
  address: string
  isAirport: boolean
  timeSlots: TimeSlot[]
  active: boolean
}

export default function LocationsManagement() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Aeroporto Falcone e Borsellino (Palermo)',
      address: 'Aeroporto Palermo',
      isAirport: true,
      timeSlots: [
        { fromHour: '00:00', toHour: '08:59', cost: 180 },
        { fromHour: '09:00', toHour: '20:30', cost: 180 },
        { fromHour: '20:31', toHour: '23:59', cost: 180 }
      ],
      active: true
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
      ],
      active: true
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
      ],
      active: true
    }
  ])

  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({
    name: '',
    address: '',
    isAirport: false,
    timeSlots: [
      { fromHour: '08:00', toHour: '18:00', cost: 0 }
    ],
    active: true
  })

  const handleEditLocation = (location: Location) => {
    setEditingLocation({ ...location })
    setIsAddingNew(false)
  }

  const handleSaveEdit = () => {
    if (editingLocation) {
      setLocations(locations.map(location => 
        location.id === editingLocation.id ? editingLocation : location
      ))
      setEditingLocation(null)
    }
  }

  const handleAddNew = () => {
    const id = (locations.length + 1).toString()
    setLocations([...locations, { ...newLocation, id }])
    setNewLocation({
      name: '',
      address: '',
      isAirport: false,
      timeSlots: [{ fromHour: '08:00', toHour: '18:00', cost: 0 }],
      active: true
    })
    setIsAddingNew(false)
  }

  const handleDeleteLocation = (locationId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa località?')) {
      setLocations(locations.filter(location => location.id !== locationId))
    }
  }

  const toggleLocationStatus = (locationId: string) => {
    setLocations(locations.map(location => 
      location.id === locationId ? { ...location, active: !location.active } : location
    ))
  }

  const addTimeSlot = (location: Location | Omit<Location, 'id'>) => {
    const newSlot = { fromHour: '08:00', toHour: '18:00', cost: 0 }
    if ('id' in location && editingLocation?.id === location.id) {
      setEditingLocation({
        ...editingLocation,
        timeSlots: [...editingLocation.timeSlots, newSlot]
      })
    } else if (location === newLocation) {
      setNewLocation({
        ...newLocation,
        timeSlots: [...newLocation.timeSlots, newSlot]
      })
    }
  }

  const removeTimeSlot = (location: Location | Omit<Location, 'id'>, index: number) => {
    if ('id' in location && editingLocation?.id === location.id) {
      setEditingLocation({
        ...editingLocation,
        timeSlots: editingLocation.timeSlots.filter((_, i) => i !== index)
      })
    } else if (location === newLocation) {
      setNewLocation({
        ...newLocation,
        timeSlots: newLocation.timeSlots.filter((_, i) => i !== index)
      })
    }
  }

  const updateTimeSlot = (location: Location | Omit<Location, 'id'>, index: number, field: keyof TimeSlot, value: string | number) => {
    if ('id' in location && editingLocation?.id === location.id) {
      const updatedSlots = [...editingLocation.timeSlots]
      updatedSlots[index] = { ...updatedSlots[index], [field]: value }
      setEditingLocation({ ...editingLocation, timeSlots: updatedSlots })
    } else if (location === newLocation) {
      const updatedSlots = [...newLocation.timeSlots]
      updatedSlots[index] = { ...updatedSlots[index], [field]: value }
      setNewLocation({ ...newLocation, timeSlots: updatedSlots })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Località</h1>
          <p className="text-gray-600 mt-2">Gestisci i punti di ritiro/consegna e i costi aeroportuali</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Aggiungi Località
        </button>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aggiungi Nuova Località</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Località</label>
              <input
                type="text"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. Aeroporto di Roma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
              <input
                type="text"
                value={newLocation.address}
                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. Via del Aeroporto, 1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newLocation.isAirport}
                onChange={(e) => setNewLocation({ ...newLocation, isAirport: e.target.checked })}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <FaPlane className="mr-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">È un aeroporto</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newLocation.active}
                onChange={(e) => setNewLocation({ ...newLocation, active: e.target.checked })}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Attivo</span>
            </label>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Fasce Orarie e Costi</h3>
              <button
                onClick={() => addTimeSlot(newLocation)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-1" />
                Aggiungi Fascia
              </button>
            </div>
            
            {newLocation.timeSlots.map((slot, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Da Ora</label>
                  <input
                    type="time"
                    value={slot.fromHour}
                    onChange={(e) => updateTimeSlot(newLocation, index, 'fromHour', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">A Ora</label>
                  <input
                    type="time"
                    value={slot.toHour}
                    onChange={(e) => updateTimeSlot(newLocation, index, 'toHour', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Costo (€)</label>
                  <input
                    type="number"
                    value={slot.cost}
                    onChange={(e) => updateTimeSlot(newLocation, index, 'cost', Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeTimeSlot(newLocation, index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    disabled={newLocation.timeSlots.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              disabled={!newLocation.name || !newLocation.address}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <FaSave className="mr-2" />
              Salva
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

      {/* Locations List */}
      <div className="space-y-4">
        {locations.map((location) => (
          <div key={location.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${!location.active ? 'opacity-60' : ''}`}>
            {editingLocation?.id === location.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Località</label>
                    <input
                      type="text"
                      value={editingLocation.name}
                      onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                    <input
                      type="text"
                      value={editingLocation.address}
                      onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingLocation.isAirport}
                      onChange={(e) => setEditingLocation({ ...editingLocation, isAirport: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <FaPlane className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">È un aeroporto</span>
                  </label>
                </div>

                {/* Edit Time Slots */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Fasce Orarie e Costi</h3>
                    <button
                      onClick={() => addTimeSlot(editingLocation)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <FaPlus className="mr-1" />
                      Aggiungi Fascia
                    </button>
                  </div>
                  
                  {editingLocation.timeSlots.map((slot, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Da Ora</label>
                        <input
                          type="time"
                          value={slot.fromHour}
                          onChange={(e) => updateTimeSlot(editingLocation, index, 'fromHour', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">A Ora</label>
                        <input
                          type="time"
                          value={slot.toHour}
                          onChange={(e) => updateTimeSlot(editingLocation, index, 'toHour', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Costo (€)</label>
                        <input
                          type="number"
                          value={slot.cost}
                          onChange={(e) => updateTimeSlot(editingLocation, index, 'cost', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeTimeSlot(editingLocation, index)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          disabled={editingLocation.timeSlots.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Salva
                  </button>
                  <button
                    onClick={() => setEditingLocation(null)}
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
                    {location.isAirport ? (
                      <FaPlane className="text-blue-600 text-xl mr-3" />
                    ) : (
                      <FaMapMarkerAlt className="text-green-600 text-xl mr-3" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      location.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.active ? 'Attivo' : 'Disattivo'}
                    </span>
                    
                    <button
                      onClick={() => handleEditLocation(location)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="Modifica località"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => toggleLocationStatus(location.id)}
                      className={`p-2 ${location.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                      title={location.active ? 'Disattiva località' : 'Attiva località'}
                    >
                      {location.active ? '⏸️' : '▶️'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Elimina località"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Time Slots Display */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FaClock className="mr-2" />
                    Fasce Orarie e Costi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {location.timeSlots.map((slot, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {slot.fromHour} - {slot.toHour}
                          </div>
                          <div className="flex items-center text-sm font-bold text-blue-600">
                            <FaEuroSign className="mr-1" />
                            {slot.cost}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {locations.length === 0 && (
        <div className="text-center py-12">
          <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nessuna località configurata</h3>
          <p className="mt-1 text-sm text-gray-500">
            Inizia aggiungendo la tua prima località di ritiro/consegna
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Aggiungi Prima Località
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
