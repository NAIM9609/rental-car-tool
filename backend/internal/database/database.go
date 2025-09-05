package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"rental-car-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize() (*gorm.DB, error) {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		user = "rental_user"
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "rental_password"
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "rental_car_db"
	}

	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbname, port, sslmode)

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	db, err := gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err := migrate(db); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	if err := seedData(db); err != nil {
		log.Printf("Warning: failed to seed data: %v", err)
	}

	log.Println("Database initialized successfully")
	return db, nil
}

func migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Car{},
		&models.MonthlyPrice{},
		&models.Booking{},
		&models.BookingExtra{},
		&models.ExtraOption{},
		&models.Location{},
		&models.TimeSlot{},
		&models.Airport{},
		&models.PriceModifier{},
	)
}

func seedData(db *gorm.DB) error {
	// Seed locations
	locations := []models.Location{
		{
			ID:        "1",
			Name:      "Aeroporto di Catania",
			Address:   "Via Fontanarossa, 95121 Catania CT",
			IsAirport: true,
			Active:    true,
		},
		{
			ID:        "2",
			Name:      "Aeroporto di Palermo",
			Address:   "Via del Castello, 90121 Palermo PA",
			IsAirport: true,
			Active:    true,
		},
		{
			ID:        "3",
			Name:      "Nostra sede (via Garibaldi, 35)",
			Address:   "Via Garibaldi, 35",
			IsAirport: false,
			Active:    true,
		},
	}

	for _, location := range locations {
		db.FirstOrCreate(&location, models.Location{ID: location.ID})
	}

	// Seed time slots for locations
	timeSlots := []models.TimeSlot{
		// Catania Airport
		{ID: "1", LocationID: "1", FromHour: "00:00", ToHour: "07:59", Cost: 30},
		{ID: "2", LocationID: "1", FromHour: "08:00", ToHour: "20:00", Cost: 20},
		{ID: "3", LocationID: "1", FromHour: "20:01", ToHour: "23:59", Cost: 30},

		// Palermo Airport
		{ID: "4", LocationID: "2", FromHour: "00:00", ToHour: "07:59", Cost: 30},
		{ID: "5", LocationID: "2", FromHour: "08:00", ToHour: "20:00", Cost: 20},
		{ID: "6", LocationID: "2", FromHour: "20:01", ToHour: "23:59", Cost: 30},

		// Sede principale
		{ID: "7", LocationID: "3", FromHour: "20:02", ToHour: "23:59", Cost: 30},
		{ID: "8", LocationID: "3", FromHour: "00:00", ToHour: "07:59", Cost: 30},
		{ID: "9", LocationID: "3", FromHour: "08:00", ToHour: "20:01", Cost: 0},
	}

	for _, slot := range timeSlots {
		db.FirstOrCreate(&slot, models.TimeSlot{ID: slot.ID})
	}

	// Seed airports (legacy compatibility)
	airports := []models.Airport{
		{Code: "CTA", Name: "Catania-Fontanarossa", City: "Catania", AdditionalCost: 15.0, Active: true},
		{Code: "PMO", Name: "Palermo-Falcone-Borsellino", City: "Palermo", AdditionalCost: 20.0, Active: true},
		{Code: "MSG", Name: "Messina", City: "Messina", AdditionalCost: 12.0, Active: true},
	}

	for _, airport := range airports {
		db.FirstOrCreate(&airport, models.Airport{Code: airport.Code})
	}

	// Seed cars with enhanced data
	cars := []models.Car{
		{
			ID: "1", Brand: "Opel", Model: "Meriva 1300", Year: 2023, FuelType: "Diesel",
			Seats: 5, Doors: 5, Luggage: 5, Transmission: "Manuale",
			Consumption: "5.8L/100Km", Engine: "Diesel", PricePerDay: 50.0,
			Category: "Economia", Available: true,
		},
		{
			ID: "2", Brand: "Volkswagen", Model: "Golf", Year: 2022, FuelType: "Diesel",
			Seats: 5, Doors: 5, Luggage: 4, Transmission: "Automatico",
			Consumption: "4.5L/100Km", Engine: "Diesel", PricePerDay: 35.0,
			Category: "Compatta", Available: true,
		},
		{
			ID: "3", Brand: "BMW", Model: "Serie 3", Year: 2023, FuelType: "Ibrida",
			Seats: 5, Doors: 4, Luggage: 4, Transmission: "Automatico",
			Consumption: "3.8L/100Km", Engine: "Ibrido", PricePerDay: 65.0,
			Category: "Premium", Available: false,
		},
	}

	for _, car := range cars {
		db.FirstOrCreate(&car, models.Car{ID: car.ID})

		// Add monthly prices for each car
		monthlyPrices := []models.MonthlyPrice{
			{ID: car.ID + "_jan", CarID: car.ID, Month: "Gennaio", Price: car.PricePerDay},
			{ID: car.ID + "_feb", CarID: car.ID, Month: "Febbraio", Price: car.PricePerDay},
			{ID: car.ID + "_mar", CarID: car.ID, Month: "Marzo", Price: car.PricePerDay},
			{ID: car.ID + "_apr", CarID: car.ID, Month: "Aprile", Price: car.PricePerDay},
			{ID: car.ID + "_may", CarID: car.ID, Month: "Maggio", Price: car.PricePerDay},
			{ID: car.ID + "_jun", CarID: car.ID, Month: "Giugno", Price: car.PricePerDay},
			{ID: car.ID + "_jul", CarID: car.ID, Month: "Luglio", Price: car.PricePerDay},
			{ID: car.ID + "_aug", CarID: car.ID, Month: "Agosto", Price: car.PricePerDay},
			{ID: car.ID + "_sep", CarID: car.ID, Month: "Settembre", Price: car.PricePerDay},
			{ID: car.ID + "_oct", CarID: car.ID, Month: "Ottobre", Price: car.PricePerDay},
			{ID: car.ID + "_nov", CarID: car.ID, Month: "Novembre", Price: car.PricePerDay},
			{ID: car.ID + "_dec", CarID: car.ID, Month: "Dicembre", Price: car.PricePerDay},
		}

		for _, price := range monthlyPrices {
			db.FirstOrCreate(&price, models.MonthlyPrice{ID: price.ID})
		}
	}

	// Update nextAvailableDate for unavailable cars
	var unavailableCar models.Car
	if err := db.First(&unavailableCar, "id = ? AND available = ?", "3", false).Error; err == nil {
		nextDate := time.Now().AddDate(0, 0, 7) // Available in 7 days
		unavailableCar.NextAvailableDate = &nextDate
		db.Save(&unavailableCar)
	}

	// Seed price modifiers
	modifiers := []models.PriceModifier{
		{ID: "1", Type: "weekend", Multiplier: 1.2, Description: "Sovrapprezzo weekend (20%)", Active: true},
		{ID: "2", Type: "holiday", Multiplier: 1.3, Description: "Sovrapprezzo festivi (30%)", Active: true},
		{ID: "3", Type: "overtime", Multiplier: 1.15, Description: "Sovrapprezzo fuori orario (15%)", Active: true},
	}

	for _, modifier := range modifiers {
		db.FirstOrCreate(&modifier, models.PriceModifier{ID: modifier.ID})
	}

	// Seed extra options
	extraOptions := []models.ExtraOption{
		{ID: "1", Name: "1 seggiolino", Price: 10, Type: "per_day", Active: true},
		{ID: "2", Name: "2 seggiolini", Price: 15, Type: "per_day", Active: true},
		{ID: "3", Name: "Assicurazione KASKO - Franchigia zero danni, zero furto e incendio", Price: 20, Type: "per_day", Active: true},
		{ID: "4", Name: "Catene da neve", Price: 5, Type: "per_day", Active: true},
		{ID: "5", Name: "Navigatore satellitare Tom Tom", Price: 10, Type: "per_day", Active: true},
		{ID: "6", Name: "Neo patentato (inferiore a 3 anni)", Price: 10, Type: "per_day", Active: true},
		{ID: "8", Name: "Secondo guidatore", Price: 10, Type: "per_day", Active: true},
		{ID: "9", Name: "Wi-Fi portatile", Price: 5, Type: "per_day", Active: true},
	}

	for _, extra := range extraOptions {
		db.FirstOrCreate(&extra, models.ExtraOption{ID: extra.ID})
	}

	return nil
}
