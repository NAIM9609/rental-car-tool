'use client'

import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { Car, Location } from '../../../types/car'
import { parseDateString, parseTimeString, formatDate, formatTime } from '../dateUtils'

interface Props {
  car: Car
  locations: Location[]
  pickupLocation: string
  setPickupLocation: (v: string) => void
  dropoffLocation: string
  setDropoffLocation: (v: string) => void
  pickupDate: string
  setPickupDate: (v: string) => void
  dropoffDate: string
  setDropoffDate: (v: string) => void
  pickupTime: string
  setPickupTime: (v: string) => void
  dropoffTime: string
  setDropoffTime: (v: string) => void
  additionalFees: any
}

export default function StepDatesLocations(props: Props) {
  const {
    car,
    locations,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    pickupDate,
    setPickupDate,
    dropoffDate,
    setDropoffDate,
    pickupTime,
    setPickupTime,
    dropoffTime,
    setDropoffTime,
    additionalFees
  } = props

  return (
    <div>
      <h3 className="text-2xl font-bold text-readable-dark mb-6">Date e Luoghi</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-readable-dark mb-2">
            <FaMapMarkerAlt className="inline mr-2" />
            Luogo di ritiro
          </label>
          <Dropdown
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.value)}
            options={locations}
            optionLabel="name"
            optionValue="name"
            placeholder="Seleziona luogo di ritiro"
            className="w-full"
            showClear
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-readable-dark mb-2">
            <FaMapMarkerAlt className="inline mr-2" />
            Luogo di consegna
          </label>
          <Dropdown
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.value)}
            options={locations}
            optionLabel="name"
            optionValue="name"
            placeholder="Seleziona luogo di consegna"
            className="w-full"
            showClear
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-readable-dark mb-2">
            <FaCalendarAlt className="inline mr-2" />
            Data e ora di ritiro
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              const today = new Date(); today.setHours(0,0,0,0)
              const minPickupDate = car?.nextAvailableDate ? new Date(car.nextAvailableDate) : today
              return (
                <Calendar
                  value={parseDateString(pickupDate)}
                  onChange={(e) => setPickupDate(formatDate(e.value as Date))}
                  minDate={minPickupDate}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className="w-full"
                />
              )
            })()}
            <Calendar
              value={parseTimeString(pickupTime)}
              onChange={(e) => setPickupTime(formatTime(e.value as Date))}
              timeOnly
              hourFormat="24"
              showIcon
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-readable-dark mb-2">
            <FaCalendarAlt className="inline mr-2" />
            Data e ora di consegna
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              const today = new Date(); today.setHours(0,0,0,0)
              const minDropoffDate = pickupDate ? new Date(pickupDate) : today
              return (
                <Calendar
                  value={parseDateString(dropoffDate)}
                  onChange={(e) => setDropoffDate(formatDate(e.value as Date))}
                  minDate={minDropoffDate}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className="w-full"
                />
              )
            })()}
            <Calendar
              value={parseTimeString(dropoffTime)}
              onChange={(e) => setDropoffTime(formatTime(e.value as Date))}
              timeOnly
              hourFormat="24"
              showIcon
              className="w-full"
            />
          </div>
        </div>
      </div>

      {car && !car.available && car.nextAvailableDate && pickupDate && new Date(pickupDate) < new Date(car.nextAvailableDate) && (
        <Message severity="error" className="mb-4" text={`Questa auto sarà disponibile solo dal ${new Date(car.nextAvailableDate).toLocaleDateString('it-IT')}. Seleziona una data successiva.`} />
      )}

      {pickupDate && dropoffDate && new Date(dropoffDate) < new Date(pickupDate) && (
        <Message severity="error" className="mb-4" text="La data di consegna deve essere uguale o successiva alla data di ritiro." />
      )}

      {pickupDate && dropoffDate && pickupTime && dropoffTime && pickupDate === dropoffDate && (() => {
        const pickupMinutes = pickupTime.split(':').map(Number)
        const dropoffMinutes = dropoffTime.split(':').map(Number)
        const pickupTotal = pickupMinutes[0] * 60 + pickupMinutes[1]
        const dropoffTotal = dropoffMinutes[0] * 60 + dropoffMinutes[1]
        return dropoffTotal <= pickupTotal
      })() && (
        <Message severity="error" className="mb-4" text="Per noleggi nello stesso giorno, l'orario di consegna deve essere successivo a quello di ritiro." />
      )}

      {(additionalFees.holidayFee > 0 || additionalFees.outOfHoursFee > 0 || additionalFees.airportFee > 0) && (
        <Card className="mb-6 p-4 bg-yellow-50 border border-yellow-200">
          <h4 className="font-semibold text-yellow-800">Costi Aggiuntivi Rilevati</h4>
          <div className="text-yellow-700 text-sm space-y-1 mt-2">
            {additionalFees.holidayFee > 0 && (
              <p>• Festivi/Domeniche: €{additionalFees.holidayFee} per le date: {additionalFees.holidayDates.join(', ')}</p>
            )}
            {additionalFees.outOfHoursFee > 0 && (
              <div>
                <p>• Fuori orario lavorativo: €{additionalFees.outOfHoursFee}</p>
                {additionalFees.outOfHoursDetails
                  .filter((detail: any) => detail.reason === 'fuori orario lavorativo')
                  .map((detail: any, index: number) => (
                    <p key={index} className="ml-4 text-xs">
                      - {detail.date} alle {detail.time} ({detail.type})
                    </p>
                  ))}
              </div>
            )}
            {additionalFees.outOfHoursDetails.some((detail: any) => detail.reason === 'festivo' || detail.reason.includes('non addebitato')) && (
              <div>
                <p>• Dettagli orari festivi (solo informativi):</p>
                {additionalFees.outOfHoursDetails
                  .filter((detail: any) => detail.reason === 'festivo' || detail.reason.includes('non addebitato'))
                  .map((detail: any, index: number) => (
                    <p key={index} className="ml-4 text-xs">
                      - {detail.date} alle {detail.time} ({detail.type})
                      {detail.reason.includes('non addebitato') ? ' - orario fuori standard gratuito per giorno festivo' : ''}
                    </p>
                  ))}
              </div>
            )}
            {additionalFees.airportFee > 0 && (
              <div>
                <p>• Costi aeroporto: €{additionalFees.airportFee}</p>
                {additionalFees.airportDetails.map((detail: any, index: number) => (
                  <p key={index} className="ml-4 text-xs">- {detail}</p>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
