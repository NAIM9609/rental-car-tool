'use client'

import { Car, CarExtra } from '../../../types/car'

interface Props {
  car: Car
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  dropoffDate: string
  pickupTime: string
  dropoffTime: string
  selectedExtras: CarExtra[]
  additionalFees: any
  totalPrice: number
}

export default function StepSummary({ car, pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime, selectedExtras, additionalFees, totalPrice }: Props) {
  const days = car && pickupDate && dropoffDate
    ? Math.max(1, Math.floor((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 3600 * 24)))
    : 0

  return (
    <div>
      <h3 className="text-2xl font-bold text-readable-dark mb-6">Riepilogo Prenotazione</h3>
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-readable-dark mb-3">Dettagli Noleggio</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Ritiro:</strong><br />
              {pickupLocation}<br />
              {pickupDate} alle {pickupTime}
            </div>
            <div>
              <strong>Consegna:</strong><br />
              {dropoffLocation}<br />
              {dropoffDate} alle {dropoffTime}
            </div>
          </div>
        </div>

        {(selectedExtras.length > 0 || additionalFees.totalAdditionalFees > 0) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-readable-dark mb-3 text-sm">Servizi e Costi Aggiuntivi</h4>
            <div className="space-y-2 text-xs">
              {selectedExtras.map((extra) => (
                <div key={extra.id} className="flex justify-between items-start">
                  <span className="text-gray-700 flex-1 pr-2 leading-relaxed">{extra.name}</span>
                  <span className="font-medium text-gray-900 whitespace-nowrap">€{extra.price} {extra.type === 'per_day' ? 'al giorno' : 'una tantum'}</span>
                </div>
              ))}

              {additionalFees.holidayFee > 0 && (
                <div className="text-amber-700 bg-amber-50 px-3 py-2 rounded border-l-2 border-amber-300">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Costo festivi/domeniche</span>
                    <span className="font-semibold">€{additionalFees.holidayFee}</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {additionalFees.holidayDates.map((date: string, index: number) => (
                      <div key={index} className="text-xs opacity-80">• {date}</div>
                    ))}
                  </div>
                </div>
              )}

              {additionalFees.outOfHoursFee > 0 && (
                <div className="text-orange-700 bg-orange-50 px-3 py-2 rounded border-l-2 border-orange-300">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Costo fuori orario lavorativo</span>
                    <span className="font-semibold">€{additionalFees.outOfHoursFee}</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {additionalFees.outOfHoursDetails
                      .filter((detail: any) => detail.reason === 'fuori orario lavorativo')
                      .map((detail: any, index: number) => (
                        <div key={index} className="text-xs opacity-80">• {detail.date} alle {detail.time} ({detail.type})</div>
                      ))}
                  </div>
                </div>
              )}

              {additionalFees.outOfHoursDetails.some((detail: any) => detail.reason.includes('festivo')) && (
                <div className="text-purple-700 bg-purple-50 px-3 py-2 rounded border-l-2 border-purple-300">
                  <div className="text-xs font-medium mb-1">Dettagli orari festivi:</div>
                  <div className="space-y-1">
                    {additionalFees.outOfHoursDetails
                      .filter((detail: any) => detail.reason.includes('festivo'))
                      .map((detail: any, index: number) => (
                        <div key={index} className="text-xs opacity-80">• {detail.date} alle {detail.time} ({detail.type}) - {detail.reason}</div>
                      ))}
                  </div>
                </div>
              )}

              {additionalFees.airportFee > 0 && (
                <div className="flex justify-between text-blue-700 bg-blue-50 px-3 py-2 rounded border-l-2 border-blue-300">
                  <span className="font-medium">Costo aeroporto</span>
                  <span className="font-semibold">€{additionalFees.airportFee}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            {car && pickupDate && dropoffDate && (
              <div className="text-xs text-gray-800 font-medium space-y-1">
                <div className="flex justify-between">
                  <span>Noleggio auto ({days} giorni)</span>
                  <span>€{car.pricePerDay * days}</span>
                </div>
                {selectedExtras.map((extra) => (
                  <div key={extra.id} className="flex justify-between">
                    <span className="text-gray-700">{extra.name}</span>
                    <span>€{extra.type === 'per_day' ? extra.price * days : extra.price}</span>
                  </div>
                ))}
                {additionalFees.holidayFee > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <span>Costi festivi</span>
                      <span>€{additionalFees.holidayFee}</span>
                    </div>
                    <div className="ml-4 space-y-0.5">
                      {additionalFees.holidayDates.map((date: string, index: number) => (
                        <div key={index} className="text-xs text-gray-600">• {date}</div>
                      ))}
                    </div>
                  </div>
                )}
                {additionalFees.outOfHoursFee > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <span>Costi fuori orario lavorativo</span>
                      <span>€{additionalFees.outOfHoursFee}</span>
                    </div>
                    <div className="ml-4 space-y-0.5">
                      {additionalFees.outOfHoursDetails
                        .filter((detail: any) => detail.reason === 'fuori orario lavorativo')
                        .map((detail: any, index: number) => (
                          <div key={index} className="text-xs text-gray-600">• {detail.date} alle {detail.time} ({detail.type})</div>
                        ))}
                    </div>
                  </div>
                )}
                {additionalFees.outOfHoursDetails.some((detail: any) => detail.reason.includes('festivo') || detail.reason.includes('non addebitato')) && (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">Dettagli orari festivi e fuori standard:</div>
                    <div className="ml-4 space-y-0.5">
                      {additionalFees.outOfHoursDetails
                        .filter((detail: any) => detail.reason.includes('festivo') || detail.reason.includes('non addebitato'))
                        .map((detail: any, index: number) => (
                          <div key={index} className="text-xs text-gray-600">• {detail.date} alle {detail.time} ({detail.type}){detail.reason.includes('non addebitato') ? ' - gratuito' : ''}</div>
                        ))}
                    </div>
                  </div>
                )}
                {additionalFees.airportFee > 0 && (
                  <div className="flex justify-between">
                    <span>Costi aeroporto</span>
                    <span>€{additionalFees.airportFee}</span>
                  </div>
                )}
              </div>
            )}
            <hr className="border-blue-200" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-readable-dark">Totale:</span>
              <span className="text-2xl font-bold text-blue-600">€{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
