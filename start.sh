#!/bin/bash

echo "🚀 Starting StreamApp Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Build and start all services
echo "🏗️  Building and starting all services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

services=("api-gateway:3000" "auth-service:3001" "user-service:3002" "video-service:3003" "streaming-service:3004" "recommendation-service:3005")

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if curl -s "http://localhost:$port/health" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "⚠️  $name is not responding"
    fi
done

echo ""
echo "🎉 StreamApp is ready!"
echo ""
echo "📍 Services are running at:"
echo "   Frontend:        http://localhost:5173"
echo "   API Gateway:     http://localhost:3000"
echo "   Auth Service:    http://localhost:3001"
echo "   User Service:    http://localhost:3002"
echo "   Video Service:   http://localhost:3003"
echo "   Streaming:       http://localhost:3004"
echo "   Recommendations: http://localhost:3005"
echo ""
echo "📊 Infrastructure:"
echo "   PostgreSQL:      localhost:5432"
echo "   MongoDB:         localhost:27017"
echo "   Redis:           localhost:6379"
echo "   RabbitMQ:        http://localhost:15672 (user: streamapp, pass: streamapp123)"
echo ""
echo "📝 To view logs: docker-compose logs -f [service-name]"
echo "🛑 To stop:      docker-compose down"
echo ""
