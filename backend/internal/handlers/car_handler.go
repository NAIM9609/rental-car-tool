package handlers

import (
	"net/http"

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
	
	if err := h.db.Preload("MonthlyPrices").Where("available = ?", true).Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cars"})
		return
	}
	
	c.JSON(http.StatusOK, cars)
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
