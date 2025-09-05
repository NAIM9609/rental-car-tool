package models

import (
	"time"

	"gorm.io/gorm"
)

type Car struct {
	ID                string         `json:"id" gorm:"primaryKey"`
	Brand             string         `json:"brand" gorm:"not null"`
	Model             string         `json:"model" gorm:"not null"`
	Year              int            `json:"year" gorm:"not null"`
	FuelType          string         `json:"fuelType" gorm:"not null"`
	Seats             int            `json:"seats" gorm:"not null"`
	Doors             int            `json:"doors" gorm:"not null"`
	Luggage           int            `json:"luggage" gorm:"not null"`
	Transmission      string         `json:"transmission" gorm:"not null"`
	Consumption       string         `json:"consumption"`
	Engine            string         `json:"engine"`
	PricePerDay       float64        `json:"pricePerDay" gorm:"not null"`
	ImageURL          string         `json:"imageUrl"`
	Available         bool           `json:"available" gorm:"default:true"`
	NextAvailableDate *time.Time     `json:"nextAvailableDate,omitempty"`
	Category          string         `json:"category"`
	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
	DeletedAt         gorm.DeletedAt `json:"-" gorm:"index"`

	Bookings      []Booking      `json:"bookings,omitempty" gorm:"foreignKey:CarID"`
	MonthlyPrices []MonthlyPrice `json:"monthlyPrices,omitempty" gorm:"foreignKey:CarID"`
}

type Booking struct {
	ID              string         `json:"id" gorm:"primaryKey"`
	CarID           string         `json:"carId" gorm:"not null"`
	StartDate       time.Time      `json:"startDate" gorm:"not null"`
	EndDate         time.Time      `json:"endDate" gorm:"not null"`
	StartTime       string         `json:"startTime" gorm:"not null"`
	EndTime         string         `json:"endTime" gorm:"not null"`
	PickupLocation  string         `json:"pickupLocation" gorm:"not null"`
	DropoffLocation string         `json:"dropoffLocation" gorm:"not null"`
	TotalPrice      float64        `json:"totalPrice" gorm:"not null"`
	CustomerInfo    CustomerInfo   `json:"customerInfo" gorm:"embedded"`
	SelectedExtras  []BookingExtra `json:"selectedExtras,omitempty" gorm:"foreignKey:BookingID"`
	AdditionalFees  AdditionalFees `json:"additionalFees" gorm:"embedded"`
	Status          string         `json:"status" gorm:"default:'pending'"` // pending, confirmed, cancelled
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`

	Car Car `json:"car,omitempty" gorm:"foreignKey:CarID"`
}

type CustomerInfo struct {
	FirstName     string `json:"firstName" gorm:"not null"`
	LastName      string `json:"lastName" gorm:"not null"`
	Email         string `json:"email" gorm:"not null"`
	Phone         string `json:"phone" gorm:"not null"`
	LicenseNumber string `json:"licenseNumber" gorm:"not null"`
}

type MonthlyPrice struct {
	ID    string  `json:"id" gorm:"primaryKey"`
	CarID string  `json:"carId" gorm:"not null"`
	Month string  `json:"month" gorm:"not null"`
	Price float64 `json:"price" gorm:"not null"`
}

type BookingExtra struct {
	ID        string  `json:"id" gorm:"primaryKey"`
	BookingID string  `json:"bookingId" gorm:"not null"`
	Name      string  `json:"name" gorm:"not null"`
	Price     float64 `json:"price" gorm:"not null"`
	Type      string  `json:"type" gorm:"not null"` // per_day, one_time
}

// Master data for selectable extras in bookings
type ExtraOption struct {
	ID     string  `json:"id" gorm:"primaryKey"`
	Name   string  `json:"name" gorm:"not null"`
	Price  float64 `json:"price" gorm:"not null"`
	Type   string  `json:"type" gorm:"not null"` // per_day, one_time
	Active bool    `json:"active" gorm:"default:true"`
}

type AdditionalFees struct {
	HolidayFee          float64 `json:"holidayFee" gorm:"default:0"`
	OutOfHoursFee       float64 `json:"outOfHoursFee" gorm:"default:0"`
	AirportFee          float64 `json:"airportFee" gorm:"default:0"`
	HolidayDates        string  `json:"holidayDates"`      // JSON string array
	OutOfHoursDetails   string  `json:"outOfHoursDetails"` // JSON string array
	AirportDetails      string  `json:"airportDetails"`    // JSON string array
	TotalAdditionalFees float64 `json:"totalAdditionalFees" gorm:"default:0"`
}

type Location struct {
	ID        string     `json:"id" gorm:"primaryKey"`
	Name      string     `json:"name" gorm:"not null"`
	Address   string     `json:"address" gorm:"not null"`
	IsAirport bool       `json:"isAirport" gorm:"default:false"`
	TimeSlots []TimeSlot `json:"timeSlots,omitempty" gorm:"foreignKey:LocationID"`
	Active    bool       `json:"active" gorm:"default:true"`
}

type TimeSlot struct {
	ID         string  `json:"id" gorm:"primaryKey"`
	LocationID string  `json:"locationId" gorm:"not null"`
	FromHour   string  `json:"fromHour" gorm:"not null"`
	ToHour     string  `json:"toHour" gorm:"not null"`
	Cost       float64 `json:"cost" gorm:"not null"`
}

type Airport struct {
	Code           string  `json:"code" gorm:"primaryKey"`
	Name           string  `json:"name" gorm:"not null"`
	City           string  `json:"city" gorm:"not null"`
	AdditionalCost float64 `json:"additionalCost" gorm:"not null"`
	Active         bool    `json:"active" gorm:"default:true"`
}

type PriceModifier struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Type        string    `json:"type" gorm:"not null"` // holiday, weekend, overtime, airport
	Multiplier  float64   `json:"multiplier"`
	FixedAmount float64   `json:"fixedAmount"`
	Description string    `json:"description" gorm:"not null"`
	Active      bool      `json:"active" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Shared request/response structs used by handlers
type ExtraRequest struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"`
}

type PriceCalculationRequest struct {
	CarID           string         `json:"carId" binding:"required"`
	StartDate       time.Time      `json:"startDate" binding:"required"`
	EndDate         time.Time      `json:"endDate" binding:"required"`
	StartTime       string         `json:"startTime" binding:"required"`
	EndTime         string         `json:"endTime" binding:"required"`
	PickupLocation  string         `json:"pickupLocation" binding:"required"`
	DropoffLocation string         `json:"dropoffLocation" binding:"required"`
	SelectedExtras  []ExtraRequest `json:"selectedExtras"`
}
