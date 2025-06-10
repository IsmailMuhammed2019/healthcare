#!/bin/bash
# quick-start.sh - Quick start for existing setup

echo "🚀 Starting Firstcare Registration System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services
docker compose up -d

echo "⏳ Waiting for services..."
sleep 5

# Check status
if docker compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "📍 Access points:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
else
    echo "❌ Failed to start services"
    docker compose logs
fi
