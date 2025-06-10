#!/bin/bash
# monitoring.sh - Monitor system health

echo "🔍 Firstcare Registration System Status"
echo "======================================"

# Check Docker services
echo "🐳 Docker Services:"
docker compose ps

echo ""

# Check service health
echo "🏥 Service Health:"
echo -n "Frontend: "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ DOWN"
fi

echo -n "Backend: "
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ DOWN"
fi

echo -n "API Docs: "
if curl -s http://localhost:8000/docs > /dev/null; then
    echo "✅ OK"
else
    echo "❌ DOWN"
fi

echo ""

# Check disk usage
echo "💾 Disk Usage:"
du -sh backend/uploads 2>/dev/null || echo "Uploads: 0"
du -sh backend/cards 2>/dev/null || echo "Cards: 0"

echo ""

# Check logs for errors
echo "📋 Recent Errors:"
docker compose logs --tail=10 backend | grep -i error || echo "No recent errors"
