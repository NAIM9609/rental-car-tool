'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Badge } from 'primereact/badge'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { ProgressBar } from 'primereact/progressbar'

export default function AdminDashboard() {
  const [carStats, setCarStats] = useState({
    total: 15,
    available: 12,
    booked: 2,
    maintenance: 1
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: 'Nuova prenotazione',
      user: 'Mario Rossi',
      car: 'Fiat 500',
      time: '2 ore fa',
      status: 'success'
    },
    {
      id: 2,
      action: 'Auto in manutenzione',
      user: 'Sistema',
      car: 'BMW Serie 3',
      time: '4 ore fa',
      status: 'warning'
    },
    {
      id: 3,
      action: 'Prenotazione completata',
      user: 'Anna Bianchi',
      car: 'Audi A4',
      time: '6 ore fa',
      status: 'info'
    }
  ])

  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const data = {
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
      datasets: [
        {
          label: 'Prenotazioni',
          data: [65, 59, 80, 81, 56, 89],
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.4
        },
        {
          label: 'Ricavi (€)',
          data: [2800, 4800, 4000, 4900, 2600, 4200],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.4
        }
      ]
    }

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            fontColor: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    }

    setChartData(data)
    setChartOptions(options)
  }, [])

  const statusTemplate = (rowData: any) => {
    const className = rowData.status === 'success' ? 'bg-green-100 text-green-800' : 
                     rowData.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
    return <Chip label={rowData.action} className={className} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <i className="pi pi-chart-bar text-blue-600 mr-3"></i>
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Panoramica generale del sistema</p>
        </div>
        <Button 
          label="Aggiorna Dati" 
          icon="pi pi-refresh" 
          onClick={() => window.location.reload()}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Totale Auto</p>
              <p className="text-3xl font-bold">{carStats.total}</p>
            </div>
            <i className="pi pi-car text-4xl opacity-80"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Disponibili</p>
              <p className="text-3xl font-bold">{carStats.available}</p>
            </div>
            <i className="pi pi-check-circle text-4xl opacity-80"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Prenotate</p>
              <p className="text-3xl font-bold">{carStats.booked}</p>
            </div>
            <i className="pi pi-calendar text-4xl opacity-80"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Manutenzione</p>
              <p className="text-3xl font-bold">{carStats.maintenance}</p>
            </div>
            <i className="pi pi-wrench text-4xl opacity-80"></i>
          </div>
        </Card>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="pi pi-chart-line text-blue-600 mr-2"></i>
            Andamento Mensile
          </h3>
          <Chart type="line" data={chartData} options={chartOptions} style={{ height: '300px' }} />
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="pi pi-bolt text-orange-600 mr-2"></i>
            Azioni Rapide
          </h3>
          <div className="space-y-3">
            <Link href="/admin/cars/new">
              <Button 
                label="Aggiungi Auto" 
                icon="pi pi-plus" 
                outlined
                className="w-full"
              />
            </Link>
            <Link href="/admin/availability">
              <Button 
                label="Gestisci Disponibilità" 
                icon="pi pi-calendar" 
                severity="warning"
                outlined
                className="w-full"
              />
            </Link>
            <Link href="/admin/extras">
              <Button 
                label="Configura Extra" 
                icon="pi pi-cog" 
                severity="success"
                outlined
                className="w-full"
              />
            </Link>
            <Link href="/admin/locations">
              <Button 
                label="Gestisci Luoghi" 
                icon="pi pi-map-marker" 
                severity="help"
                outlined
                className="w-full"
              />
            </Link>
            <Link href="/admin/users">
              <Button 
                label="Gestisci Utenti" 
                icon="pi pi-users" 
                severity="danger"
                outlined
                className="w-full"
              />
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <i className="pi pi-clock text-green-600 mr-2"></i>
          Attività Recenti
        </h3>
        <DataTable 
          value={recentActivity} 
          paginator 
          rows={5}
          responsiveLayout="scroll"
        >
          <Column field="action" header="Azione" body={statusTemplate} />
          <Column field="user" header="Utente" />
          <Column field="car" header="Auto" />
          <Column field="time" header="Tempo" />
        </DataTable>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="pi pi-server text-purple-600 mr-2"></i>
            Stato Sistema
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>CPU</span>
                <span>45%</span>
              </div>
              <ProgressBar value={45} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Memoria</span>
                <span>62%</span>
              </div>
              <ProgressBar value={62} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Storage</span>
                <span>38%</span>
              </div>
              <ProgressBar value={38} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="pi pi-info-circle text-blue-600 mr-2"></i>
            Informazioni Rapide
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Prenotazioni Oggi</span>
              <Badge value="8" severity="success" />
            </div>
            <div className="flex justify-between items-center">
              <span>Incassi Mensili</span>
              <Badge value="€12,450" severity="info" />
            </div>
            <div className="flex justify-between items-center">
              <span>Auto in Revisione</span>
              <Badge value="2" severity="warning" />
            </div>
            <div className="flex justify-between items-center">
              <span>Clienti Attivi</span>
              <Badge value="156" severity="success" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
