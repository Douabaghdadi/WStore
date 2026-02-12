#!/bin/bash

###############################################################################
# Script de monitoring en temps réel
# Usage: bash monitoring.sh
###############################################################################

APP_DIR="/var/www/wstore"
LOG_FILE="/var/log/wstore/monitoring.log"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo "======================================"
echo "   🔍 WStore Monitoring Dashboard"
echo "======================================"
echo ""

# Fonction pour vérifier un service
check_service() {
    local url=$1
    local name=$2
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ $name${NC} - Healthy"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - Down"
        return 1
    fi
}

# Vérification des services
echo "📊 Services Status:"
echo "-------------------"
check_service "http://localhost:3000" "Frontend"
check_service "http://localhost:5000/api/products" "Backend API"
echo ""

# Statut PM2
echo "🔧 PM2 Processes:"
echo "-------------------"
pm2 jlist | jq -r '.[] | "\(.name): \(.pm2_env.status) (CPU: \(.monit.cpu)%, Memory: \(.monit.memory / 1024 / 1024 | floor)MB)"'
echo ""

# Utilisation système
echo "💻 System Resources:"
echo "-------------------"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""

# Derniers logs
echo "📝 Recent Logs (last 10 lines):"
echo "-------------------"
echo -e "${BLUE}Backend:${NC}"
pm2 logs wstore-backend --lines 5 --nostream 2>/dev/null | tail -n 5
echo ""
echo -e "${BLUE}Frontend:${NC}"
pm2 logs wstore-frontend --lines 5 --nostream 2>/dev/null | tail -n 5
echo ""

# Backups disponibles
echo "💾 Available Backups:"
echo "-------------------"
ls -lht /var/backups/wstore/backup-*.tar.gz 2>/dev/null | head -n 5 | awk '{print $9, "(" $5 ")"}'
echo ""

# Uptime
echo "⏱️  Uptime:"
echo "-------------------"
uptime
echo ""

echo "======================================"
echo "Monitoring completed at $(date)"
echo "======================================"
