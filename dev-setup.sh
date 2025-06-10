#!/bin/bash
# dev-setup.sh - Development environment setup

set -e

echo "🔧 Setting up development environment..."

# Backend setup
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

echo "✅ Backend setup complete"

# Frontend setup
echo "⚛️  Setting up React frontend..."
cd ../frontend

# Install dependencies
npm install

echo "✅ Frontend setup complete"

echo "🎉 Development environment ready!"
echo ""
echo "To start development servers:"
echo "  Backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "  Frontend: cd frontend && npm run dev"
