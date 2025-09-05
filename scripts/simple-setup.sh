#!/bin/bash

# Simple development setup without Docker
set -e

echo "🚀 Setting up Rental Car Tool development environment (without Docker)..."

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

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built successfully"

cd ..

echo "✅ Setup completed!"
echo ""
echo "🛠️  To start development:"
echo "   1. Start PostgreSQL database manually (port 5432)"
echo "   2. Frontend: cd frontend && npm run dev"
echo "   3. Backend: cd backend && go run main.go (requires Go installation)"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo ""
echo "📊 Database Configuration:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: rental_car_db"
echo "   Username: rental_user"
echo "   Password: rental_password"
