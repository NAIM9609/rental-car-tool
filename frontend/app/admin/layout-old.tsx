'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Tooltip } from 'primereact/tooltip'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token === 'admin-authenticated') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      url: '/admin/dashboard',
      badge: '5'
    },
    {
      label: 'Gestione Auto',
      icon: 'pi pi-car',
      url: '/admin/cars'
    },
    {
      label: 'Disponibilità',
      icon: 'pi pi-calendar',
      url: '/admin/availability'
    },
    {
      label: 'Extra & Servizi',
      icon: 'pi pi-cog',
      url: '/admin/extras'
    },
    {
      label: 'Luoghi & Aeroporti',
      icon: 'pi pi-map-marker',
      url: '/admin/locations'
    },
    {
      label: 'Gestione Utenti',
      icon: 'pi pi-users',
      url: '/admin/users'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="text-center p-6">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Caricamento...</h3>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center">
          <i className="pi pi-shield text-2xl text-primary mr-3"></i>
          <div>
            <h2 className="font-bold text-lg text-color">Admin Panel</h2>
            <p className="text-sm text-color-secondary">Rental Car System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.url}>
              <div 
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  pathname === item.url 
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500' 
                    : 'text-color hover:bg-surface-100'
                }`}
                data-pr-tooltip={item.label}
                data-pr-position="right"
              >
                <i className={`${item.icon} text-lg mr-3`}></i>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <Badge value={item.badge} severity="info" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center mb-4">
          <Avatar 
            icon="pi pi-user" 
            className="mr-3"
            style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }} 
            shape="circle" 
          />
          <div>
            <p className="font-semibold text-color">Admin</p>
            <p className="text-sm text-color-secondary">Amministratore</p>
          </div>
        </div>
        
        <Button 
          label="Logout" 
          icon="pi pi-sign-out" 
          severity="danger"
          outlined
          className="w-full"
          onClick={handleLogout}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-50">
      <Tooltip target=".menu-item" />
      
      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="lg:hidden"
        style={{ width: '280px' }}
      >
        {sidebarContent}
      </Sidebar>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Card className="h-full rounded-none border-r border-surface-200 shadow-none">
          {sidebarContent}
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <Card className="rounded-none border-b border-surface-200 shadow-sm mb-0">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              icon="pi pi-bars"
              text
              className="lg:hidden"
              onClick={() => setSidebarVisible(true)}
            />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="pi pi-clock text-color-secondary"></i>
                <span className="text-sm text-color-secondary">
                  {new Date().toLocaleDateString('it-IT')}
                </span>
              </div>
              
              <Button
                icon="pi pi-bell"
                text
                rounded
                badge="3"
                badgeClassName="p-badge-danger"
              />
            </div>
          </div>
        </Card>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
