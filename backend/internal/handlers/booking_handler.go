package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"rental-car-backend/internal/models"
)

type BookingHandler struct {
	db *gorm.DB
}

func NewBookingHandler(db *gorm.DB) *BookingHandler {
	return &BookingHandler{db: db}
}

func (h *BookingHandler) GetCarBookings(c *gin.Context) {
	carID := c.Param("id")
	var bookings []models.Booking
	
	if err := h.db.Where("car_id = ? AND status != ?", carID, "cancelled").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	
	c.JSON(http.StatusOK, bookings)
}

func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var booking models.Booking
	
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Generate UUID for booking
	booking.ID = uuid.New().String()
	booking.Status = "pending"
	
	// Validate dates
	if booking.StartDate.After(booking.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date must be before end date"})
		return
	}

	// Validate times for same day bookings
	if booking.StartDate.Format("2006-01-02") == booking.EndDate.Format("2006-01-02") {
		if booking.StartTime >= booking.EndTime {
			c.JSON(http.StatusBadRequest, gin.H{"error": "For same day bookings, end time must be after start time"})
			return
		}
	}
	
	if booking.StartDate.Before(time.Now().Truncate(24 * time.Hour)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be in the past"})
		return
	}
	
	// Check if car is available for the requested dates
	var existingBookings []models.Booking
	if err := h.db.Where("car_id = ? AND status != ? AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?))",
		booking.CarID, "cancelled",
		booking.StartDate, booking.StartDate,
		booking.EndDate, booking.EndDate,
		booking.StartDate, booking.EndDate).Find(&existingBookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check availability"})
		return
	}
	
	if len(existingBookings) > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Car is not available for the selected dates"})
		return
	}
	
	// Calculate price with advanced pricing logic
	pricingHandler := NewPricingHandler(h.db)
	
	// Converti gli extra del booking in formato richiesto
	var extraRequests []models.ExtraRequest
	for _, extra := range booking.SelectedExtras {
		extraRequests = append(extraRequests, models.ExtraRequest{
			ID:    extra.ID,
			Name:  extra.Name,
			Price: extra.Price,
			Type:  extra.Type,
		})
	}
	
	req := models.PriceCalculationRequest{
		CarID:           booking.CarID,
		StartDate:       booking.StartDate,
		EndDate:         booking.EndDate,
		StartTime:       booking.StartTime,
		EndTime:         booking.EndTime,
		PickupLocation:  booking.PickupLocation,
		DropoffLocation: booking.DropoffLocation,
		SelectedExtras:  extraRequests,
	}
	
	// Calcola le tariffe usando la logica avanzata
	additionalFees := pricingHandler.calculateAdditionalFees(
		req.StartDate, req.EndDate, req.StartTime, req.EndTime,
		req.PickupLocation, req.DropoffLocation,
	)
	
	// Calcola il prezzo totale
	days := int(booking.EndDate.Sub(booking.StartDate).Hours()/24) + 1
	if days < 1 {
		days = 1
	}
	
	var car models.Car
	if err := h.db.First(&car, "id = ?", booking.CarID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find car"})
		return
	}
	
	basePrice := car.PricePerDay * float64(days)
	extrasPrice := 0.0
	
	for _, extra := range booking.SelectedExtras {
		if extra.Type == "per_day" {
			extrasPrice += extra.Price * float64(days)
		} else {
			extrasPrice += extra.Price
		}
	}
	
	booking.TotalPrice = basePrice + extrasPrice + additionalFees.TotalAdditionalFees
	booking.AdditionalFees = additionalFees

	// Salva gli extra come entità separate
	if err := h.db.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}
	
	// Salva gli extra separatamente
	for i, extra := range booking.SelectedExtras {
		extra.ID = uuid.New().String()
		extra.BookingID = booking.ID
		booking.SelectedExtras[i] = extra
		if err := h.db.Create(&extra).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save extras"})
			return
		}
	}	// Load the car information and extras
	if err := h.db.Preload("Car").Preload("SelectedExtras").First(&booking, "id = ?", booking.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load booking details"})
		return
	}
	
	c.JSON(http.StatusCreated, booking)
}

func (h *BookingHandler) GetBooking(c *gin.Context) {
	id := c.Param("id")
	var booking models.Booking
	
	if err := h.db.Preload("Car").First(&booking, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booking"})
		return
	}
	
	c.JSON(http.StatusOK, booking)
}

func (h *BookingHandler) UpdateBooking(c *gin.Context) {
	id := c.Param("id")
	var booking models.Booking
	
	if err := h.db.First(&booking, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booking"})
		return
	}
	
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := h.db.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}
	
	c.JSON(http.StatusOK, booking)
}

func (h *BookingHandler) DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	
	if err := h.db.Delete(&models.Booking{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}
