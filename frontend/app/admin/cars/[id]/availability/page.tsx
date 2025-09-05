'use client'

import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'

export default function AdminCarAvailabilityPage() {
  const router = useRouter()

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button label="Torna all'elenco" icon="pi pi-arrow-left" text onClick={() => router.push('/admin/cars')} />
      </div>
      <Card title="Disponibilità Auto" className="shadow-sm">
        <Message severity="info" text="Gestione disponibilità in costruzione." className="mb-3" />
        <p className="text-sm text-gray-600">Qui potrai impostare periodi di indisponibilità e blocchi calendario.</p>
      </Card>
    </div>
  )
}
