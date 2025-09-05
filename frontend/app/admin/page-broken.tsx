'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token === 'admin-authenticated') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      if (email === 'admin@rentalcar.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-authenticated')
        setIsLoggedIn(true)
        router.push('/admin/dashboard')
      } else {
        setError('Credenziali non valide! Usa: admin@rentalcar.com / admin123')
      }
      setLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setError('')
  }

  // Pannello Admin se loggato
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  <i className="pi pi-shield text-blue-600 mr-3"></i>
                  Pannello Amministrativo
                </h1>
                <p className="text-gray-600">Benvenuto nel sistema di gestione rental car</p>
              </div>
              <Button 
                label="Logout" 
                icon="pi pi-sign-out" 
                className="p-button-danger"
                onClick={handleLogout}
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <i className="pi pi-chart-line text-4xl text-blue-600 mb-3 block"></i>
                <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm mb-4">Statistiche e panoramica</p>
                <Button 
                  label="Apri" 
                  icon="pi pi-arrow-right"
                  className="p-button-outlined"
                  onClick={() => router.push('/admin/dashboard')}
                />
              </div>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <i className="pi pi-car text-4xl text-green-600 mb-3 block"></i>
                <h3 className="text-lg font-semibold mb-2">Gestione Auto</h3>
                <p className="text-gray-600 text-sm mb-4">Auto, foto e specifiche</p>
                <Button 
                  label="Apri" 
                  icon="pi pi-arrow-right"
                  className="p-button-outlined"
                  onClick={() => router.push('/admin/cars')}
                />
              </div>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <i className="pi pi-calendar text-4xl text-orange-600 mb-3 block"></i>
                <h3 className="text-lg font-semibold mb-2">Disponibilità</h3>
                <p className="text-gray-600 text-sm mb-4">Periodi indisponibilità</p>
                <Button 
                  label="Apri" 
                  icon="pi pi-arrow-right"
                  className="p-button-outlined"
                  onClick={() => router.push('/admin/availability')}
                />
              </div>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <i className="pi pi-cog text-4xl text-purple-600 mb-3 block"></i>
                <h3 className="text-lg font-semibold mb-2">Extra & Servizi</h3>
                <p className="text-gray-600 text-sm mb-4">Configura prezzi extra</p>
                <Button 
                  label="Apri" 
                  icon="pi pi-arrow-right"
                  className="p-button-outlined"
                  onClick={() => router.push('/admin/extras')}
                />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-xl font-semibold mb-4">
                <i className="pi pi-map-marker text-red-600 mr-2"></i>
                Luoghi & Aeroporti
              </h3>
              <p className="text-gray-600 mb-4">Gestisci punti di ritiro e costi aeroportuali</p>
              <Button 
                label="Gestisci Luoghi" 
                icon="pi pi-external-link"
                onClick={() => router.push('/admin/locations')}
              />
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">
                <i className="pi pi-users text-indigo-600 mr-2"></i>
                Gestione Utenti
              </h3>
              <p className="text-gray-600 mb-4">Amministratori e operatori del sistema</p>
              <Button 
                label="Gestisci Utenti" 
                icon="pi pi-external-link"
                onClick={() => router.push('/admin/users')}
              />
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Form di Login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <i className="pi pi-shield text-4xl text-blue-600 mb-4 block"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pannello Amministrativo
          </h1>
          <p className="text-gray-600">Accedi per gestire il sistema di noleggio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="pi pi-envelope mr-2"></i>
              Email Admin
            </label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rentalcar.com"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="pi pi-lock mr-2"></i>
              Password
            </label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full"
              feedback={false}
              toggleMask
              required
            />
          </div>

          {error && (
            <Message severity="error" text={error} className="w-full" />
          )}

          <Button 
            type="submit" 
            label={loading ? "Accesso in corso..." : "Accedi"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
            className="w-full p-button-lg"
            loading={loading}
          />
        </form>

        <Divider />

        <Card className="bg-blue-50 border border-blue-200">
          <div className="text-center">
            <h4 className="font-semibold text-blue-900 mb-2">
              <i className="pi pi-info-circle mr-2"></i>
              Credenziali Demo
            </h4>
            <p className="text-blue-700 text-sm">
              <strong>Email:</strong> admin@rentalcar.com<br/>
              <strong>Password:</strong> admin123
            </p>
          </div>
        </Card>
      </Card>
    </div>
  )
}
