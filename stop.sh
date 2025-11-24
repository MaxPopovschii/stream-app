#!/bin/bash

echo "🛑 Stopping StreamApp..."

docker-compose down

echo "✅ All services stopped"
echo ""
echo "To remove volumes (databases): docker-compose down -v"
echo "To remove images: docker-compose down --rmi all"
