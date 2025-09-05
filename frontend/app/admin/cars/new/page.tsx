'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  FaSave, FaTimes, FaUpload, FaTrash, FaImage,
  FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump, FaEuroSign
} from 'react-icons/fa'

export default function NewCarForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    engine: '',
    pricePerDay: 50,
    doors: 4,
    seats: 5,
    luggage: 3,
    transmission: 'Manuale',
    fuelType: 'Benzina',
    consumption: '',
    description: '',
    available: true
  })

  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
             : type === 'number' ? Number(value) 
             : value
    }))
  }

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + images.length > 10) {
      alert('Puoi caricare massimo 10 immagini per auto')
      return
    }

    setUploadingImages(true)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          setImages(prev => [...prev, result])
          setImageFiles(prev => [...prev, file])
        }
        reader.readAsDataURL(file)
      }
    })
    
    setUploadingImages(false)
  }, [images.length])

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulazione salvataggio - in produzione fare chiamata API
      console.log('Salvando auto:', formData)
      console.log('Immagini:', imageFiles)
      
      // Simula upload immagini
      if (imageFiles.length > 0) {
        console.log('Upload di', imageFiles.length, 'immagini...')
      }
      
      // Simula delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Auto salvata con successo!')
      router.push('/admin/cars')
    } catch (error) {
      alert('Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aggiungi Nuova Auto</h1>
          <p className="text-gray-600 mt-2">Inserisci i dettagli della nuova vettura</p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <FaTimes className="mr-2" />
          Annulla
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCar className="mr-2" />
            Informazioni Base
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. Fiat, BMW, Audi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modello *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. 500, Serie 3, A4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anno *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motore
              </label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. 1.2 FireFly, 2.0 TDI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo al Giorno (€) *
              </label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumo
              </label>
              <input
                type="text"
                name="consumption"
                value={formData.consumption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="es. 5.2L/100Km"
              />
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCog className="mr-2" />
            Specifiche Tecniche
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porte
              </label>
              <select
                name="doors"
                value={formData.doors}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Porte</option>
                <option value={4}>4 Porte</option>
                <option value={5}>5 Porte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posti
              </label>
              <select
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2}>2 Posti</option>
                <option value={4}>4 Posti</option>
                <option value={5}>5 Posti</option>
                <option value={7}>7 Posti</option>
                <option value={9}>9 Posti</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bagagli
              </label>
              <select
                name="luggage"
                value={formData.luggage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 Bagaglio</option>
                <option value={2}>2 Bagagli</option>
                <option value={3}>3 Bagagli</option>
                <option value={4}>4 Bagagli</option>
                <option value={5}>5+ Bagagli</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cambio
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Manuale">Manuale</option>
                <option value="Automatico">Automatico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carburante
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Benzina">Benzina</option>
                <option value="Diesel">Diesel</option>
                <option value="Ibrido">Ibrido</option>
                <option value="Elettrico">Elettrico</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Disponibile</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaImage className="mr-2" />
            Immagini Auto
          </h2>
          
          {/* Upload Area */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Carica immagini dell&apos;auto
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Seleziona fino a 10 immagini (JPG, PNG, WebP - Max 5MB ciascuna)
                </p>
                <div className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center">
                  <FaUpload className="mr-2" />
                  Seleziona Immagini
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImages || images.length >= 10}
              />
            </label>
          </div>

          {/* Images Preview */}
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Anteprima Immagini ({images.length}/10)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Auto ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        Principale
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Descrizione
          </h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrizione opzionale dell'auto..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading || !formData.brand || !formData.model}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <FaSave className="mr-2" />
            {loading ? 'Salvando...' : 'Salva Auto'}
          </button>
        </div>
      </form>
    </div>
  )
}
