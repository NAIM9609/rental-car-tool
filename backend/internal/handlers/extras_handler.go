package handlers

import (
	"net/http"
	"rental-car-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ExtrasHandler struct {
	db *gorm.DB
}

func NewExtrasHandler(db *gorm.DB) *ExtrasHandler {
	return &ExtrasHandler{db: db}
}

// GetExtras returns active extra options
func (h *ExtrasHandler) GetExtras(c *gin.Context) {
	var extras []models.ExtraOption
	if err := h.db.Where("active = ?", true).Find(&extras).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch extras"})
		return
	}
	c.JSON(http.StatusOK, extras)
}
