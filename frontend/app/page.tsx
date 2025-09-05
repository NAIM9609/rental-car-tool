"use client"

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import CarList from './components/CarList'
import SearchForm, { SearchParams } from './components/SearchForm'

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(undefined)

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
  }

  return (
    <main className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3">
              <span className="text-primary">Rental</span> Car Tool
            </h1>
            <p className="text-lg text-color-secondary max-w-3xl mx-auto">
              Trova e prenota l&apos;auto perfetta per il tuo viaggio.
              Consegne negli aeroporti di Catania, Palermo e Messina.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Tag value="Consegna aeroporti" icon="pi pi-send" severity="info" />
              <Tag value="Flotta moderna" icon="pi pi-car" severity="success" />
              <Tag value="Prezzi competitivi" icon="pi pi-wallet" severity="warning" />
            </div>
          </div>
        </Card>

        <SearchForm onSearch={handleSearch} />
        
        <CarList searchParams={searchParams} />
      </div>
    </main>
  )
}
