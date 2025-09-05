'use client'

import { Checkbox } from 'primereact/checkbox'
import { CarExtra } from '../../../types/car'

export default function StepExtras({ availableExtras, selectedExtras, onToggle }: { availableExtras: CarExtra[]; selectedExtras: CarExtra[]; onToggle: (e: CarExtra) => void }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-readable-dark mb-6">Opzioni Aggiuntive</h3>
      <div className="extras-section">
        <div className="space-y-3">
          {availableExtras.map((extra) => (
            <div key={extra.id} className="extra-item">
              <div className="flex items-start gap-3">
                <Checkbox inputId={`extra-${extra.id}`} checked={selectedExtras.some((e) => e.id === extra.id)} onChange={() => onToggle(extra)} />
                <label htmlFor={`extra-${extra.id}`} className="cursor-pointer flex-1">
                  {extra.name}
                </label>
              </div>
              <span className="extra-price">€{extra.price} {extra.type === 'per_day' ? 'al giorno' : 'una tantum'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
