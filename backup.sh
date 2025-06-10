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
