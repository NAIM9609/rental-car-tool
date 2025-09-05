# Search-Driven Rental Car Interface

This document describes the implementation of the search-driven rental car booking system based on the localrent.com example URLs.

## URL Parameter Support

The application now supports the following URL patterns, matching the example website:

### 1. Search Page URLs
```
/?pickup_date=2025-11-03T21:00&dropoff_date=2025-11-08T18:00&pc=TENERIFE_NORTH_AIRPORT&dc=TENERIFE_NORTH_AIRPORT
```

**Parameters:**
- `pickup_date`: ISO datetime string for pickup
- `dropoff_date`: ISO datetime string for dropoff  
- `pc`: Pickup city/location name
- `dc`: Dropoff city/location name
- `search_id`: Unique session identifier (generated automatically)

### 2. Booking Page URLs
```
/booking/[car-id]?car_id=29880&pickup_city_id=549042&dropoff_city_id=549042&pickup_date=2025-11-03T21:00&dropoff_date=2025-11-08T18:00&pickup_place_id=47411&dropoff_place_id=47411&search_id=fb0d1734bbe34fe758cb73407f7b2238&extras[0]=14&extras[1]=18
```

**Parameters:**
- `car_id`: Car identifier  
- `pickup_date` / `dropoff_date`: Date/time selection
- `pickup_location` / `dropoff_location`: Location names
- `pickup_place_id` / `dropoff_place_id`: Location IDs (for compatibility)
- `search_id`: Session identifier linking back to search
- `extras[0]`, `extras[1]`, etc.: Pre-selected extra service IDs

## Features Implemented

### Search Interface
- ✅ Comprehensive search form with date and location selection
- ✅ Real-time form validation
- ✅ URL parameter pre-population
- ✅ Search session management with unique IDs

### Car Filtering  
- ✅ Backend availability checking based on existing bookings
- ✅ Date range conflict detection
- ✅ Location-aware search results

### Deep Linking
- ✅ Direct links to car booking pages with pre-filled parameters
- ✅ Extras pre-selection via URL parameters
- ✅ Search context preservation throughout booking flow

### Session Management
- ✅ Unique search ID generation
- ✅ Session storage for search parameters  
- ✅ Automatic cleanup of expired sessions

## Technical Implementation

### Frontend Components
- **SearchForm.tsx**: Main search interface with URL parameter handling
- **CarList.tsx**: Filtered car display with search context
- **CarCard.tsx**: Enhanced booking links with search parameters  
- **searchSession.ts**: Utility functions for session management

### Backend Enhancements
- **car_handler.go**: Enhanced `/api/cars` endpoint with availability filtering
- Database queries for booking conflict detection
- Backward-compatible API responses

## Usage Examples

### 1. Home Page Search
Users can visit the home page and use the search form, or be directed via URL:
```
https://yoursite.com/?pickup_date=2025-11-03T21:00&dropoff_date=2025-11-08T18:00&pc=AIRPORT&dc=AIRPORT
```

### 2. Direct Car Booking
Users can be directed to specific car booking pages with pre-filled data:
```
https://yoursite.com/booking/hyundai-i10?pickup_date=2025-11-03T21:00&dropoff_date=2025-11-08T18:00&pickup_location=AIRPORT&extras[0]=14&extras[1]=18
```

### 3. Search Session Continuity
Search sessions maintain context across pages:
- Search generates unique `search_id`
- Car selection links include `search_id` 
- Booking pages can retrieve original search parameters

## Database Schema Requirements

The implementation assumes the following models exist:
- `Car`: Vehicle information with availability flag
- `Booking`: Reservations with date ranges and status
- `Location`: Pickup/dropoff locations with airport flags
- `Extra`: Additional services with pricing

## API Endpoints

### Enhanced Car Search
```
GET /api/cars?pickup_date=2025-11-03&dropoff_date=2025-11-08&pickup_location=AIRPORT&dropoff_location=AIRPORT
```

Returns filtered cars based on availability for the specified date range.

### Existing Endpoints
- `GET /api/locations` - Available pickup/dropoff locations
- `GET /api/extras` - Available extra services
- `POST /api/bookings` - Create new booking

## Future Enhancements

1. **Advanced Filtering**: Car type, price range, features
2. **Location Hierarchy**: Support for city/place ID relationships  
3. **Multi-language**: URL parameter localization
4. **Analytics**: Search session tracking and conversion metrics
5. **Cache Management**: Redis-based session storage for scalability