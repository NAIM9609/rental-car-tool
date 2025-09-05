package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rental-car-backend/internal/models"
)

type CarHandler struct {
	db *gorm.DB
}

func NewCarHandler(db *gorm.DB) *CarHandler {
	return &CarHandler{db: db}
}

func (h *CarHandler) GetCars(c *gin.Context) {
	var cars []models.Car
	
	// Parse search parameters
	pickupDate := c.Query("pickup_date")
	dropoffDate := c.Query("dropoff_date")
	pickupLocation := c.Query("pickup_location")
	dropoffLocation := c.Query("dropoff_location")
	
	// Base query - get all available cars
	query := h.db.Preload("MonthlyPrices").Where("available = ?", true)
	
	// If date range is provided, filter cars based on availability
	if pickupDate != "" && dropoffDate != "" {
		startDate, err1 := time.Parse("2006-01-02", pickupDate)
		endDate, err2 := time.Parse("2006-01-02", dropoffDate)
		
		if err1 == nil && err2 == nil {
			// Find cars that are NOT booked during the requested period
			// Using a subquery to exclude cars with conflicting bookings
			query = query.Where("id NOT IN (?)", 
				h.db.Model(&models.Booking{}).
					Select("car_id").
					Where("status != ? AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?))",
						"cancelled",
						startDate, startDate,
						endDate, endDate,
						startDate, endDate))
		}
	}
	
	if err := query.Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cars"})
		return
	}
	
	// Add search metadata to response if search parameters were provided
	response := gin.H{
		"cars": cars,
	}
	
	if pickupDate != "" || dropoffDate != "" || pickupLocation != "" || dropoffLocation != "" {
		response["search_criteria"] = gin.H{
			"pickup_date":     pickupDate,
			"dropoff_date":    dropoffDate,
			"pickup_location": pickupLocation,
			"dropoff_location": dropoffLocation,
		}
	}
	
	// If no search parameters, just return the cars array for backward compatibility
	if pickupDate == "" && dropoffDate == "" && pickupLocation == "" && dropoffLocation == "" {
		c.JSON(http.StatusOK, cars)
	} else {
		c.JSON(http.StatusOK, response)
	}
}

func (h *CarHandler) GetCar(c *gin.Context) {
	id := c.Param("id")
	var car models.Car
	
	if err := h.db.Preload("MonthlyPrices").First(&car, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch car"})
		return
	}
	
	c.JSON(http.StatusOK, car)
}

func (h *CarHandler) CreateCar(c *gin.Context) {
	var car models.Car
	
	if err := c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := h.db.Create(&car).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create car"})
		return
	}
	
	c.JSON(http.StatusCreated, car)
}

func (h *CarHandler) UpdateCar(c *gin.Context) {
	id := c.Param("id")
	var car models.Car
	
	if err := h.db.First(&car, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch car"})
		return
	}
	
	if err := c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := h.db.Save(&car).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update car"})
		return
	}
	
	c.JSON(http.StatusOK, car)
}

func (h *CarHandler) DeleteCar(c *gin.Context) {
	id := c.Param("id")
	
	if err := h.db.Delete(&models.Car{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete car"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Car deleted successfully"})
}
