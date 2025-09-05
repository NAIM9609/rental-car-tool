#!/bin/bash

# Development setup script
set -e

echo "🚀 Setting up Rental Car Tool development environment..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create environment files
echo "📁 Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

# Start development environment with Docker Compose
echo "🐳 Starting development environment..."
cd docker
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo "   Backend Health: http://localhost:8080/health"
    echo ""
    echo "📊 Database:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: rental_car_db"
    echo "   Username: rental_user"
    echo "   Password: rental_password"
    echo ""
    echo "🛠️  Development commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart services: docker-compose restart"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
