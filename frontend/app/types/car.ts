export interface Car {
  id: string
  brand: string
  model: string
  year: number
  fuelType: string
  seats: number
  doors: number
  luggage: number
  transmission: string
  consumption: string
  engine: string
  pricePerDay: number
  monthlyPrices: MonthlyPrice[]
  imageUrl: string
  available: boolean
  nextAvailableDate?: string
  category: string
}

export interface MonthlyPrice {
  month: string
  price: number
}

export interface CarExtra {
  id: string
  name: string
  price: number
  type: 'per_day' | 'one_time'
  description?: string
}

export interface Booking {
  id: string
  carId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  pickupLocation: string
  dropoffLocation: string
  totalPrice: number
  extras: CarExtra[]
  customerInfo: CustomerInfo
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
}

export interface PriceModifier {
  type: 'holiday' | 'weekend' | 'overtime' | 'airport'
  multiplier: number
  fixedAmount?: number
  description: string
}

export interface Airport {
  code: string
  name: string
  city: string
  additionalCost: number
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  fromHour: string
  toHour: string
  cost: number
}

export interface Location {
  id: string
  name: string
  address: string
  timeSlots: TimeSlot[]
  isAirport: boolean
}
