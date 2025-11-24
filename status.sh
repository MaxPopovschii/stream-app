#!/bin/bash

echo "📊 StreamApp Service Status"
echo ""

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Check containers
echo "🐳 Docker Containers:"
docker-compose ps

echo ""
echo "🔍 Service Health:"

services=("api-gateway:3000" "auth-service:3001" "user-service:3002" "video-service:3003" "streaming-service:3004" "recommendation-service:3005")

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "✅ $name (port $port) - HEALTHY"
    else
        echo "❌ $name (port $port) - UNHEALTHY"
    fi
done

echo ""
echo "💾 Database Status:"

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
    echo "✅ PostgreSQL - RUNNING"
else
    echo "❌ PostgreSQL - NOT RUNNING"
fi

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB - RUNNING"
else
    echo "❌ MongoDB - NOT RUNNING"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis - RUNNING"
else
    echo "❌ Redis - NOT RUNNING"
fi

# Check RabbitMQ
if curl -s http://localhost:15672 > /dev/null 2>&1; then
    echo "✅ RabbitMQ - RUNNING"
else
    echo "❌ RabbitMQ - NOT RUNNING"
fi

echo ""
