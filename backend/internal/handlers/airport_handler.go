package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rental-car-backend/internal/models"
)

func GetAirports(c *gin.Context) {
	airports := []models.Airport{
		{Code: "CTA", Name: "Catania-Fontanarossa", City: "Catania", AdditionalCost: 15.0, Active: true},
		{Code: "PMO", Name: "Palermo-Falcone-Borsellino", City: "Palermo", AdditionalCost: 20.0, Active: true},
		{Code: "MSG", Name: "Messina", City: "Messina", AdditionalCost: 12.0, Active: true},
	}
	
	c.JSON(http.StatusOK, airports)
}

type AirportHandler struct {
	db *gorm.DB
}

func NewAirportHandler(db *gorm.DB) *AirportHandler {
	return &AirportHandler{db: db}
}

func (h *AirportHandler) GetAirports(c *gin.Context) {
	var airports []models.Airport
	
	if err := h.db.Where("active = ?", true).Find(&airports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch airports"})
		return
	}
	
	c.JSON(http.StatusOK, airports)
}
