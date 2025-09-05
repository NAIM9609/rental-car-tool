package handlers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rental-car-backend/internal/models"
)

type PricingHandler struct {
	db *gorm.DB
}

type OutOfHoursDetail struct {
	Date   string `json:"date"`
	Time   string `json:"time"`
	Type   string `json:"type"`
	Reason string `json:"reason"`
}

type PriceCalculationResponse struct {
	BasePrice       float64            `json:"basePrice"`
	ExtrasPrice     float64            `json:"extrasPrice"`
	AdditionalFees  models.AdditionalFees `json:"additionalFees"`
	TotalPrice      float64            `json:"totalPrice"`
	Days            int                `json:"days"`
}

func NewPricingHandler(db *gorm.DB) *PricingHandler {
	return &PricingHandler{db: db}
}

// CalculatePrice calcola il prezzo totale per una prenotazione
func (h *PricingHandler) CalculatePrice(c *gin.Context) {
	var req models.PriceCalculationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Recupera l'auto
	var car models.Car
	if err := h.db.First(&car, "id = ?", req.CarID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Car not found"})
		return
	}

	// MODIFICA: Calcolo giorni corretto - inizia dalla data di ritiro
	// Dopo 24 ore dalla data di ritiro scatta la tariffa del giorno successivo
	days := int(req.EndDate.Sub(req.StartDate).Hours()/24)
	if days <= 0 {
		days = 1
	}

	// Prezzo base
	basePrice := car.PricePerDay * float64(days)

	// Prezzo degli extra
	extrasPrice := 0.0
	for _, extra := range req.SelectedExtras {
		if extra.Type == "per_day" {
			extrasPrice += extra.Price * float64(days)
		} else {
			extrasPrice += extra.Price
		}
	}

	// Calcola le tariffe aggiuntive
	additionalFees := h.calculateAdditionalFees(req.StartDate, req.EndDate, req.StartTime, req.EndTime, req.PickupLocation, req.DropoffLocation)

	response := PriceCalculationResponse{
		BasePrice:      basePrice,
		ExtrasPrice:    extrasPrice,
		AdditionalFees: additionalFees,
		TotalPrice:     basePrice + extrasPrice + additionalFees.TotalAdditionalFees,
		Days:           days,
	}

	c.JSON(200, response)
}

// calculateAdditionalFees implementa la logica del frontend
func (h *PricingHandler) calculateAdditionalFees(startDate, endDate time.Time, startTime, endTime, pickupLoc, dropoffLoc string) models.AdditionalFees {
	var holidayFee, outOfHoursFee, airportFee float64
	var holidayDates []string
	var outOfHoursDetails []OutOfHoursDetail
	var airportDetails []string

	// Verifica se le date sono festive
	isPickupHoliday := h.isHolidayOrSunday(startDate)
	isDropoffHoliday := h.isHolidayOrSunday(endDate)

	if isPickupHoliday {
		holidayFee += 30
		holidayDates = append(holidayDates, fmt.Sprintf("%s (ritiro)", startDate.Format("2006-01-02")))
	}

	if isDropoffHoliday {
		holidayFee += 30
		holidayDates = append(holidayDates, fmt.Sprintf("%s (consegna)", endDate.Format("2006-01-02")))
	}

	// MODIFICA: Verifica orari fuori standard per ENTRAMBI ritiro e consegna
	// Ritiro - NON applica sovrapprezzo fuori orario se è già festivo
	if h.isOutOfHours(startTime) {
		if !isPickupHoliday {
			// Solo se NON è festivo, applica il sovrapprezzo fuori orario
			outOfHoursFee += 30
			outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
				Date:   startDate.Format("2006-01-02"),
				Time:   startTime,
				Type:   "ritiro",
				Reason: "fuori orario lavorativo",
			})
		} else {
			// Se è festivo, non applica sovrapprezzo fuori orario (solo informativo)
			outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
				Date:   startDate.Format("2006-01-02"),
				Time:   startTime,
				Type:   "ritiro",
				Reason: "festivo (orario fuori standard non addebitato)",
			})
		}
	} else if isPickupHoliday {
		outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
			Date:   startDate.Format("2006-01-02"),
			Time:   startTime,
			Type:   "ritiro",
			Reason: "festivo",
		})
	}

	// Consegna - NON applica sovrapprezzo fuori orario se è già festivo
	if h.isOutOfHours(endTime) {
		if !isDropoffHoliday {
			// Solo se NON è festivo, applica il sovrapprezzo fuori orario
			outOfHoursFee += 30
			outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
				Date:   endDate.Format("2006-01-02"),
				Time:   endTime,
				Type:   "consegna",
				Reason: "fuori orario lavorativo",
			})
		} else {
			// Se è festivo, non applica sovrapprezzo fuori orario (solo informativo)
			outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
				Date:   endDate.Format("2006-01-02"),
				Time:   endTime,
				Type:   "consegna",
				Reason: "festivo (orario fuori standard non addebitato)",
			})
		}
	} else if isDropoffHoliday {
		outOfHoursDetails = append(outOfHoursDetails, OutOfHoursDetail{
			Date:   endDate.Format("2006-01-02"),
			Time:   endTime,
			Type:   "consegna",
			Reason: "festivo",
		})
	}

	// Calcola costi aeroporto
	var locations []models.Location
	h.db.Preload("TimeSlots").Find(&locations)

	for _, location := range locations {
		if location.Name == pickupLoc && location.IsAirport {
			for _, slot := range location.TimeSlots {
				if h.isTimeInSlot(startTime, slot.FromHour, slot.ToHour) {
					airportFee += slot.Cost
					airportDetails = append(airportDetails, fmt.Sprintf("Ritiro aeroporto: €%.0f", slot.Cost))
					break
				}
			}
		}
		if location.Name == dropoffLoc && location.IsAirport {
			for _, slot := range location.TimeSlots {
				if h.isTimeInSlot(endTime, slot.FromHour, slot.ToHour) {
					airportFee += slot.Cost
					airportDetails = append(airportDetails, fmt.Sprintf("Consegna aeroporto: €%.0f", slot.Cost))
					break
				}
			}
		}
	}

	// Serializza gli array in JSON
	holidayDatesJSON, _ := json.Marshal(holidayDates)
	outOfHoursDetailsJSON, _ := json.Marshal(outOfHoursDetails)
	airportDetailsJSON, _ := json.Marshal(airportDetails)

	return models.AdditionalFees{
		HolidayFee:          holidayFee,
		OutOfHoursFee:       outOfHoursFee,
		AirportFee:          airportFee,
		HolidayDates:        string(holidayDatesJSON),
		OutOfHoursDetails:   string(outOfHoursDetailsJSON),
		AirportDetails:      string(airportDetailsJSON),
		TotalAdditionalFees: holidayFee + outOfHoursFee + airportFee,
	}
}

// isHolidayOrSunday verifica se una data è domenica o festivo
func (h *PricingHandler) isHolidayOrSunday(date time.Time) bool {
	// Domenica
	if date.Weekday() == time.Sunday {
		return true
	}

	// Festivi italiani 2025
	holidays := []string{
		"2025-01-01", "2025-01-06", "2025-04-21", "2025-04-25",
		"2025-05-01", "2025-06-02", "2025-08-15", "2025-11-01",
		"2025-12-08", "2025-12-25", "2025-12-26",
	}

	dateStr := date.Format("2006-01-02")
	for _, holiday := range holidays {
		if holiday == dateStr {
			return true
		}
	}

	return false
}

// isOutOfHours verifica se un orario è fuori dagli orari standard (8:00-18:00)
func (h *PricingHandler) isOutOfHours(timeStr string) bool {
	parts := strings.Split(timeStr, ":")
	if len(parts) != 2 {
		return false
	}

	hours, err1 := strconv.Atoi(parts[0])
	minutes, err2 := strconv.Atoi(parts[1])
	if err1 != nil || err2 != nil {
		return false
	}

	totalMinutes := hours*60 + minutes
	return totalMinutes < 8*60 || totalMinutes >= 18*60
}

// isTimeInSlot verifica se un orario è in un determinato slot
func (h *PricingHandler) isTimeInSlot(timeStr, fromHour, toHour string) bool {
	time := h.parseTime(timeStr)
	from := h.parseTime(fromHour)
	to := h.parseTime(toHour)

	return time >= from && time <= to
}

// parseTime converte una stringa orario in minuti dal mezzanotte
func (h *PricingHandler) parseTime(timeStr string) int {
	parts := strings.Split(timeStr, ":")
	if len(parts) != 2 {
		return 0
	}

	hours, err1 := strconv.Atoi(parts[0])
	minutes, err2 := strconv.Atoi(parts[1])
	if err1 != nil || err2 != nil {
		return 0
	}

	return hours*60 + minutes
}
