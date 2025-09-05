'use client'

import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEuroSign } from 'react-icons/fa'

interface Extra {
  id: string
  name: string
  price: number
  type: 'per_day' | 'one_time'
  description: string
  active: boolean
}

export default function ExtrasManagement() {
  const [extras, setExtras] = useState<Extra[]>([
    { id: '1', name: '1 seggiolino', price: 10, type: 'per_day', description: 'Seggiolino per bambini', active: true },
    { id: '2', name: '2 seggiolini', price: 15, type: 'per_day', description: 'Due seggiolini per bambini', active: true },
    { id: '3', name: 'Assicurazione KASKO', price: 20, type: 'per_day', description: 'Franchigia zero danni, zero furto e incendio', active: true },
    { id: '4', name: 'Catene da neve', price: 5, type: 'per_day', description: 'Catene da neve per stagione invernale', active: true },
    { id: '5', name: 'Navigatore Tom Tom', price: 10, type: 'per_day', description: 'GPS satellitare Tom Tom', active: true },
    { id: '6', name: 'Neo patentato', price: 10, type: 'per_day', description: 'Sovrapprezzo per patente inferiore a 3 anni', active: true },
    { id: '7', name: 'Secondo guidatore', price: 10, type: 'per_day', description: 'Guidatore aggiuntivo', active: true },
    { id: '8', name: 'Wi-Fi portatile', price: 5, type: 'per_day', description: 'Connessione internet mobile', active: true }
  ])

  const [editingExtra, setEditingExtra] = useState<Extra | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newExtra, setNewExtra] = useState<Omit<Extra, 'id'>>({
    name: '',
    price: 0,
    type: 'per_day',
    description: '',
    active: true
  })

  const handleEditExtra = (extra: Extra) => {
    setEditingExtra({ ...extra })
    setIsAddingNew(false)
  }

  const handleSaveEdit = () => {
    if (editingExtra) {
      setExtras(extras.map(extra => 
        extra.id === editingExtra.id ? editingExtra : extra
      ))
      setEditingExtra(null)
    }
  }

  const handleAddNew = () => {
    const id = (extras.length + 1).toString()
    setExtras([...extras, { ...newExtra, id }])
    setNewExtra({
      name: '',
      price: 0,
      type: 'per_day',
      description: '',
      active: true
    })
    setIsAddingNew(false)
  }

  const handleDeleteExtra = (extraId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo extra?')) {
      setExtras(extras.filter(extra => extra.id !== extraId))
    }
  }

  const toggleExtraStatus = (extraId: string) => {
    setExtras(extras.map(extra => 
      extra.id === extraId ? { ...extra, active: !extra.active } : extra
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Extra e Servizi</h1>
          <p className="text-gray-600 mt-2">Configura i servizi aggiuntivi disponibili per il noleggio</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Aggiungi Extra
        </button>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aggiungi Nuovo Extra</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Extra</label>
              <input
                type="text"
                value={newExtra.name}
                onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome del servizio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo (€)</label>
              <input
                type="number"
                value={newExtra.price}
                onChange={(e) => setNewExtra({ ...newExtra, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Tariffazione</label>
              <select
                value={newExtra.type}
                onChange={(e) => setNewExtra({ ...newExtra, type: e.target.value as 'per_day' | 'one_time' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="per_day">Al giorno</option>
                <option value="one_time">Una tantum</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newExtra.active}
                  onChange={(e) => setNewExtra({ ...newExtra, active: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Attivo</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
            <textarea
              value={newExtra.description}
              onChange={(e) => setNewExtra({ ...newExtra, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Descrizione del servizio"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              disabled={!newExtra.name || newExtra.price < 0}
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

      {/* Extras List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Extra Configurati ({extras.filter(e => e.active).length} attivi / {extras.length} totali)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome Extra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezzo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrizione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {extras.map((extra) => (
                <tr key={extra.id} className={!extra.active ? 'bg-gray-50 opacity-60' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExtra?.id === extra.id ? (
                      <input
                        type="text"
                        value={editingExtra.name}
                        onChange={(e) => setEditingExtra({ ...editingExtra, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{extra.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExtra?.id === extra.id ? (
                      <div className="flex items-center">
                        <FaEuroSign className="text-gray-400 mr-1" />
                        <input
                          type="number"
                          value={editingExtra.price}
                          onChange={(e) => setEditingExtra({ ...editingExtra, price: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaEuroSign className="text-gray-400 mr-1" />
                        {extra.price}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExtra?.id === extra.id ? (
                      <select
                        value={editingExtra.type}
                        onChange={(e) => setEditingExtra({ ...editingExtra, type: e.target.value as 'per_day' | 'one_time' })}
                        className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="per_day">Al giorno</option>
                        <option value="one_time">Una tantum</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        extra.type === 'per_day' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {extra.type === 'per_day' ? 'Al giorno' : 'Una tantum'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingExtra?.id === extra.id ? (
                      <textarea
                        value={editingExtra.description}
                        onChange={(e) => setEditingExtra({ ...editingExtra, description: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    ) : (
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={extra.description}>
                        {extra.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      extra.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {extra.active ? 'Attivo' : 'Disattivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingExtra?.id === extra.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900"
                          title="Salva modifiche"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingExtra(null)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Annulla modifiche"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditExtra(extra)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifica extra"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => toggleExtraStatus(extra.id)}
                          className={`${extra.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={extra.active ? 'Disattiva extra' : 'Attiva extra'}
                        >
                          {extra.active ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDeleteExtra(extra.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Elimina extra"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaPlus className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Extra Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{extras.filter(e => e.active).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaEuroSign className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Prezzo Medio</p>
              <p className="text-2xl font-bold text-gray-900">
                €{extras.length > 0 ? (extras.reduce((sum, e) => sum + e.price, 0) / extras.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 font-bold">%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tasso Attivazione</p>
              <p className="text-2xl font-bold text-gray-900">
                {extras.length > 0 ? Math.round((extras.filter(e => e.active).length / extras.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
