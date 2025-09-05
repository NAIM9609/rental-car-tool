package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rental-car-backend/internal/models"
)

type LocationHandler struct {
	db *gorm.DB
}

func NewLocationHandler(db *gorm.DB) *LocationHandler {
	return &LocationHandler{db: db}
}

func (h *LocationHandler) GetLocations(c *gin.Context) {
	var locations []models.Location
	
	if err := h.db.Preload("TimeSlots").Where("active = ?", true).Find(&locations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch locations"})
		return
	}
	
	c.JSON(http.StatusOK, locations)
}

func (h *LocationHandler) GetLocation(c *gin.Context) {
	id := c.Param("id")
	var location models.Location
	
	if err := h.db.Preload("TimeSlots").First(&location, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch location"})
		return
	}
	
	c.JSON(http.StatusOK, location)
}

func (h *LocationHandler) CreateLocation(c *gin.Context) {
	var location models.Location
	
	if err := c.ShouldBindJSON(&location); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := h.db.Create(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create location"})
		return
	}
	
	c.JSON(http.StatusCreated, location)
}

func (h *LocationHandler) UpdateLocation(c *gin.Context) {
	id := c.Param("id")
	var location models.Location
	
	if err := h.db.First(&location, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch location"})
		return
	}
	
	if err := c.ShouldBindJSON(&location); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := h.db.Save(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update location"})
		return
	}
	
	c.JSON(http.StatusOK, location)
}

func (h *LocationHandler) DeleteLocation(c *gin.Context) {
	id := c.Param("id")
	
	if err := h.db.Delete(&models.Location{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete location"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Location deleted successfully"})
}
