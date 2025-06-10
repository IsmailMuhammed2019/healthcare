#!/bin/bash
# setup.sh - Main setup script

set -e

echo "🚀 Setting up Firstcare Registration System..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create project structure
echo "📁 Creating project structure..."

mkdir -p backend/uploads
mkdir -p backend/cards
mkdir -p frontend/components/ui
mkdir -p frontend/lib
mkdir -p frontend/store
mkdir -p frontend/hooks
mkdir -p frontend/app

# Set permissions
chmod 755 backend/uploads
chmod 755 backend/cards

echo "✅ Project structure created"

# Create environment files
echo "🔧 Setting up environment files..."

# Backend .env
cat > backend/.env << 'EOF'
DATABASE_URL=sqlite:///./registration.db
SECRET_KEY=firstcare-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000
DEBUG=True
UPLOAD_DIR=uploads
CARDS_DIR=cards
EOF

# Frontend .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Firstcare Health Partners"
NEXT_PUBLIC_APP_VERSION="1.0.0"
EOF

echo "✅ Environment files created"

# Build and start services
echo "🏗️  Building and starting services..."

docker compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📍 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo ""
    echo "🛠️  Useful commands:"
    echo "   View logs: docker compose logs -f"
    echo "   Stop services: docker compose down"
    echo "   Restart services: docker compose restart"
    echo ""
else
    echo "❌ Services failed to start. Check logs with: docker compose logs"
    exit 1
fi

# init-db.py - Database initialization script
cat > backend/init_db.py << 'EOF'
#!/usr/bin/env python3
"""
Database initialization script for Firstcare Registration System
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from main import Base, User, engine

def init_database():
    """Initialize the database with tables and sample data"""
    print("🗄️  Initializing database...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if we already have data
        user_count = db.query(User).count()
        if user_count > 0:
            print(f"📊 Database already contains {user_count} users")
            return
        
        # Create sample admin user for testing
        sample_user = User(
            registration_id="FHP20241209ADMIN01",
            first_name="Admin",
            middle_name="Test",
            last_name="User",
            date_of_birth="1990-01-01",
            sex="M",
            phone_number="08012345678",
            nin="12345678901",
            address="Test Address, Kaduna",
            state="Kaduna",
            lga="Kaduna North",
            zone="Kaduna Region",
            unit="Admin Unit",
            emergency_contact_name="Emergency Contact",
            emergency_contact_address="Emergency Address",
            emergency_contact_phone="08087654321",
            beneficiary1_name="Beneficiary One",
            beneficiary1_address="Beneficiary Address",
            beneficiary1_phone="08011111111",
            beneficiary1_relationship="Spouse",
            registration_fee_paid=True,
            daily_dues_balance=2400.0,
            membership_status="active"
        )
        
        db.add(sample_user)
        db.commit()
        
        print("✅ Sample data created successfully")
        print(f"📝 Created admin user with ID: {sample_user.registration_id}")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
EOF

# dev-setup.sh - Development setup script
cat > dev-setup.sh << 'EOF'
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
EOF

chmod +x setup.sh
chmod +x dev-setup.sh

# quick-start.sh - Quick start script
cat > quick-start.sh << 'EOF'
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
EOF

chmod +x quick-start.sh

# backup.sh - Backup script
cat > backup.sh << 'EOF'
#!/bin/bash
# backup.sh - Backup script for data and uploads

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Creating backup in $BACKUP_DIR..."

# Backup database
echo "📊 Backing up database..."
if docker compose ps | grep -q "db.*Up"; then
    docker compose exec -T db pg_dump -U firstcare_user firstcare_db > "$BACKUP_DIR/database.sql"
else
    # SQLite backup
    docker compose exec -T backend cp registration.db /tmp/
    docker cp $(docker compose ps -q backend):/tmp/registration.db "$BACKUP_DIR/"
fi

# Backup uploads
echo "📁 Backing up uploads..."
docker cp $(docker compose ps -q backend):/app/uploads "$BACKUP_DIR/"

# Backup cards
echo "🆔 Backing up generated cards..."
docker cp $(docker compose ps -q backend):/app/cards "$BACKUP_DIR/"

# Create archive
echo "📦 Creating archive..."
tar -czf "$BACKUP_DIR.tar.gz" -C backups "$(basename $BACKUP_DIR)"
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed: $BACKUP_DIR.tar.gz"
EOF

chmod +x backup.sh

# monitoring.sh - Simple monitoring script
cat > monitoring.sh << 'EOF'
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
EOF

chmod +x monitoring.sh

# Package.json scripts update
cat > frontend/package.json << 'EOF'
{
  "name": "firstcare-registration-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^4.4.6",
    "axios": "^1.6.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "react-dropzone": "^14.2.3",
    "react-webcam": "^7.1.1",
    "qrcode": "^1.5.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-separator": "^1.0.3",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/qrcode": "^1.5.5",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}
EOF

echo "✅ All setup scripts created successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Run ./setup.sh to set up the complete system with Docker"
echo "2. Or run ./dev-setup.sh for local development"
echo "3. Use ./quick-start.sh to start services quickly"
echo "4. Use ./monitoring.sh to check system status"
echo "5. Use ./backup.sh to backup your data"