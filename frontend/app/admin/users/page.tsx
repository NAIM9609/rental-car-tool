'use client'

import { useState } from 'react'
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, 
  FaEye, FaEyeSlash, FaUserShield, FaUser, FaEnvelope, 
  FaLock, FaCheck, FaBan 
} from 'react-icons/fa'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator'
  active: boolean
  lastLogin?: string
  createdAt: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Admin Principale',
      email: 'admin@rentalcar.com',
      role: 'admin',
      active: true,
      lastLogin: '2025-01-12T10:30:00',
      createdAt: '2025-01-01T00:00:00'
    },
    {
      id: '2',
      name: 'Mario Operator',
      email: 'mario@rentalcar.com',
      role: 'operator',
      active: true,
      lastLogin: '2025-01-11T15:45:00',
      createdAt: '2025-01-05T00:00:00'
    },
    {
      id: '3',
      name: 'Luca Manager',
      email: 'luca@rentalcar.com',
      role: 'admin',
      active: false,
      createdAt: '2025-01-03T00:00:00'
    }
  ])

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator' as 'admin' | 'operator',
    active: true
  })

  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const roleLabels = {
    admin: 'Amministratore',
    operator: 'Operatore'
  }

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    operator: 'bg-blue-100 text-blue-800'
  }

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.active) ||
      (selectedStatus === 'inactive' && !user.active)
    return matchesRole && matchesStatus
  })

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({ ...user })
    setIsAddingNew(false)
  }

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers(users => 
        users.map(user => 
          user.id === editingUser.id ? editingUser : user
        )
      )
      setEditingUser(null)
    }
  }

  const handleAddNew = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Le password non coincidono!')
      return
    }

    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Compila tutti i campi obbligatori!')
      return
    }

    const id = (users.length + 1).toString()
    const newUserData: AdminUser = {
      id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      active: newUser.active,
      createdAt: new Date().toISOString()
    }
    
    setUsers([...users, newUserData])
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'operator',
      active: true
    })
    setIsAddingNew(false)
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user?.email === 'admin@rentalcar.com') {
      alert('Non puoi eliminare l&apos;amministratore principale!')
      return
    }
    
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      setUsers(users => users.filter(user => user.id !== userId))
    }
  }

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user?.email === 'admin@rentalcar.com') {
      alert('Non puoi disattivare l&apos;amministratore principale!')
      return
    }

    setUsers(users => 
      users.map(user => 
        user.id === userId ? { ...user, active: !user.active } : user
      )
    )
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Utenti</h1>
          <p className="text-gray-600 mt-2">Gestisci gli amministratori e operatori del sistema</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Nuovo Utente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUsers className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Totale Utenti</dt>
                <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUserShield className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Amministratori</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUser className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Operatori</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.filter(u => u.role === 'operator').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Utenti Attivi</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.filter(u => u.active).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per Ruolo
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutti i Ruoli</option>
              <option value="admin">Amministratori</option>
              <option value="operator">Operatori</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per Stato
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutti gli Stati</option>
              <option value="active">Attivi</option>
              <option value="inactive">Disattivi</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <strong>{filteredUsers.length}</strong> utenti trovati
            </div>
          </div>
        </div>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nuovo Utente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. Mario Rossi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mario@rentalcar.com"
                required
              />
              {newUser.email && !isValidEmail(newUser.email) && (
                <p className="text-red-600 text-sm mt-1">Email non valida</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conferma Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Conferma password"
                required
              />
              {newUser.confirmPassword && newUser.password !== newUser.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Le password non coincidono</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ruolo *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'operator' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="operator">Operatore</option>
                <option value="admin">Amministratore</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newUserActive"
                checked={newUser.active}
                onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="newUserActive" className="ml-2 block text-sm text-gray-900">
                Utente attivo
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              disabled={!newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword || 
                      newUser.password !== newUser.confirmPassword || !isValidEmail(newUser.email)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <FaSave className="mr-2" />
              Crea Utente
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

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${!user.active ? 'opacity-60' : ''}`}>
            {editingUser?.id === user.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ruolo</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'operator' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editingUser.email === 'admin@rentalcar.com'}
                    >
                      <option value="operator">Operatore</option>
                      <option value="admin">Amministratore</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`editUserActive-${editingUser.id}`}
                      checked={editingUser.active}
                      onChange={(e) => setEditingUser({ ...editingUser, active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={editingUser.email === 'admin@rentalcar.com'}
                    />
                    <label htmlFor={`editUserActive-${editingUser.id}`} className="ml-2 block text-sm text-gray-900">
                      Utente attivo
                    </label>
                  </div>
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
                    onClick={() => setEditingUser(null)}
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
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      {user.role === 'admin' ? 
                        <FaUserShield className="text-red-600 text-xl" /> : 
                        <FaUser className="text-blue-600 text-xl" />
                      }
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                    
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Attivo' : 'Disattivo'}
                    </span>
                    
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="Modifica utente"
                    >
                      <FaEdit />
                    </button>
                    
                    {user.email !== 'admin@rentalcar.com' && (
                      <>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-2 ${user.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.active ? 'Disattiva utente' : 'Attiva utente'}
                        >
                          {user.active ? <FaBan /> : <FaCheck />}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Elimina utente"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Ultimo Accesso</div>
                    <div className="text-lg font-bold text-gray-900">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Mai'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Creato il</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>

                {user.email === 'admin@rentalcar.com' && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <FaLock className="inline mr-2" />
                      Questo è l&apos;account amministratore principale. Non può essere modificato o eliminato.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun utente trovato</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedRole !== 'all' || selectedStatus !== 'all' 
              ? 'Nessun utente trovato con i filtri attuali'
              : 'Non ci sono utenti configurati'
            }
          </p>
        </div>
      )}
    </div>
  )
}
