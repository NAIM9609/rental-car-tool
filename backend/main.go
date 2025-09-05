package main

import (
	"log"
	"os"

	"rental-car-backend/internal/database"
	"rental-car-backend/internal/handlers"
	"rental-car-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// Initialize database
	db, err := database.Initialize()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://frontend:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Initialize handlers
	carHandler := handlers.NewCarHandler(db)
	bookingHandler := handlers.NewBookingHandler(db)
	locationHandler := handlers.NewLocationHandler(db)
	pricingHandler := handlers.NewPricingHandler(db)
	extrasHandler := handlers.NewExtrasHandler(db)

	// Routes
	api := r.Group("/api")
	{
		// Car routes
		api.GET("/cars", carHandler.GetCars)
		api.GET("/cars/:id", carHandler.GetCar)
		api.POST("/cars", middleware.AdminAuth(), carHandler.CreateCar)
		api.PUT("/cars/:id", middleware.AdminAuth(), carHandler.UpdateCar)
		api.DELETE("/cars/:id", middleware.AdminAuth(), carHandler.DeleteCar)

		// Booking routes
		api.GET("/cars/:id/bookings", bookingHandler.GetCarBookings)
		api.POST("/bookings", bookingHandler.CreateBooking)
		api.GET("/bookings/:id", bookingHandler.GetBooking)
		api.PUT("/bookings/:id", middleware.AdminAuth(), bookingHandler.UpdateBooking)
		api.DELETE("/bookings/:id", middleware.AdminAuth(), bookingHandler.DeleteBooking)

		// Location routes
		api.GET("/locations", locationHandler.GetLocations)
		api.GET("/locations/:id", locationHandler.GetLocation)
		api.POST("/locations", middleware.AdminAuth(), locationHandler.CreateLocation)
		api.PUT("/locations/:id", middleware.AdminAuth(), locationHandler.UpdateLocation)
		api.DELETE("/locations/:id", middleware.AdminAuth(), locationHandler.DeleteLocation)

		// Pricing routes
		api.POST("/pricing/calculate", pricingHandler.CalculatePrice)

		// Extras routes
		api.GET("/extras", extrasHandler.GetExtras)

		// Airport routes (legacy compatibility)
		api.GET("/airports", handlers.GetAirports)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
