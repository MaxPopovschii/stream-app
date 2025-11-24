#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./logs.sh [service-name]"
    echo ""
    echo "Available services:"
    echo "  - api-gateway"
    echo "  - auth-service"
    echo "  - user-service"
    echo "  - video-service"
    echo "  - streaming-service"
    echo "  - recommendation-service"
    echo "  - frontend"
    echo "  - postgres"
    echo "  - mongodb"
    echo "  - redis"
    echo "  - rabbitmq"
    echo ""
    echo "Or use 'all' to see all logs"
    exit 1
fi

if [ "$1" = "all" ]; then
    docker-compose logs -f
else
    docker-compose logs -f "$1"
fi
